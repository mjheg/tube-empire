"use client";

import { useRef, useEffect, useCallback } from "react";
import { HamsterState } from "@/game/state";
import { renderFrame } from "@/canvas/renderer";
import { HamsterAIState, updateHamsterAI, createHamsterAI } from "@/canvas/hamsterAI";
import { handleTap, handleDrag } from "@/canvas/interactions";
import { pet } from "@/game/stats";
import { preloadSprites } from "@/canvas/sprites";

interface Props {
  state: HamsterState;
  onStateChange: (updater: (prev: HamsterState) => HamsterState) => void;
}

export function GameCanvas({ state, onStateChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aiRef = useRef<HamsterAIState | null>(null);
  const lastTimeRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    preloadSprites();
    const canvas = canvasRef.current;
    if (!canvas) return;
    aiRef.current = createHamsterAI(canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const loop = (time: number) => {
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = time;

      const rect = canvas.getBoundingClientRect();
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        if (aiRef.current) {
          aiRef.current.x = Math.min(aiRef.current.x, rect.width - 30);
          aiRef.current.y = Math.min(aiRef.current.y, rect.height - 30);
        }
      }

      if (aiRef.current) {
        aiRef.current = updateHamsterAI(
          aiRef.current, state, state.placedItems,
          canvas.width, canvas.height, dt
        );
        renderFrame(ctx, state, aiRef.current, canvas.width, canvas.height, dt);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [state]);

  const getCanvasPos = useCallback((e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    isDraggingRef.current = false;
    dragStartRef.current = getCanvasPos(e);
  }, [getCanvasPos]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const pos = getCanvasPos(e);
    const dx = pos.x - dragStartRef.current.x;
    const dy = pos.y - dragStartRef.current.y;
    if (dx * dx + dy * dy > 100) isDraggingRef.current = true;

    if (isDraggingRef.current && aiRef.current) {
      const result = handleDrag(aiRef.current, pos.x, pos.y);
      if (result.action === "pet") {
        aiRef.current = result.ai;
        onStateChange((prev) => pet(prev));
        isDraggingRef.current = false;
        dragStartRef.current = pos;
      }
    }
  }, [getCanvasPos, onStateChange]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (isDraggingRef.current) return;
    const pos = getCanvasPos(e);
    if (aiRef.current) {
      const result = handleTap(aiRef.current, pos.x, pos.y);
      if (result.action === "poke") {
        aiRef.current = result.ai;
        onStateChange((prev) => ({ ...prev, happiness: Math.min(100, prev.happiness + 1) }));
      }
    }
  }, [getCanvasPos, onStateChange]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full flex-1 cursor-pointer"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ touchAction: "none" }}
    />
  );
}
