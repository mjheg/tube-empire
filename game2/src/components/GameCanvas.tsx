"use client";

import { useRef, useEffect, useCallback } from "react";
import * as BABYLON from "@babylonjs/core";
import { HamsterState } from "@/game/state";
import { pet } from "@/game/stats";
import {
  createScene,
  createHamster,
  createWaterBottle,
  createWheel,
  createFoodBowl,
  createHouse,
} from "@/canvas/scene";

interface Props {
  state: HamsterState;
  onStateChange: (updater: (prev: HamsterState) => HamsterState) => void;
}

export function GameCanvas({ state, onStateChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const hamsterRef = useRef<BABYLON.TransformNode | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);

  // Target position for hamster AI
  const targetRef = useRef({ x: 0, z: 0 });
  const timerRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { engine, scene, shadowGen } = createScene(canvas);
    engineRef.current = engine;
    sceneRef.current = scene;

    // Create hamster
    const hamster = createHamster(scene, shadowGen);
    hamster.position = new BABYLON.Vector3(0, 0, 0);
    hamsterRef.current = hamster;

    // Create items
    const waterBottle = createWaterBottle(scene, shadowGen);
    waterBottle.position = new BABYLON.Vector3(-3, 0, -2);

    const wheel = createWheel(scene, shadowGen);
    wheel.position = new BABYLON.Vector3(2, 0, -1);

    const foodBowl = createFoodBowl(scene, shadowGen);
    foodBowl.position = new BABYLON.Vector3(-2.5, 0, 1.5);

    const house = createHouse(scene, shadowGen);
    house.position = new BABYLON.Vector3(2.5, 0, 1.5);

    // Pick random target
    targetRef.current = { x: Math.random() * 4 - 2, z: Math.random() * 3 - 1.5 };
    timerRef.current = 3;

    // Animation - hamster movement
    let lastTime = performance.now();
    scene.registerBeforeRender(() => {
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      if (!hamsterRef.current) return;
      const h = hamsterRef.current;

      // Move toward target
      const dx = targetRef.current.x - h.position.x;
      const dz = targetRef.current.z - h.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.2) {
        const speed = 1.5;
        h.position.x += (dx / dist) * speed * dt;
        h.position.z += (dz / dist) * speed * dt;

        // Face direction of movement
        h.rotation.y = Math.atan2(dx, dz);

        // Walking bounce
        h.position.y = Math.abs(Math.sin(now * 0.008)) * 0.08;
      }

      // Pick new target periodically
      timerRef.current -= dt;
      if (timerRef.current <= 0) {
        timerRef.current = 3 + Math.random() * 5;
        targetRef.current = {
          x: Math.random() * 6 - 3,
          z: Math.random() * 4 - 2,
        };
      }

      // Breathing animation
      const body = scene.getMeshByName("body");
      if (body) {
        const breathe = 1 + Math.sin(now * 0.003) * 0.02;
        body.scaling.y = breathe;
      }
    });

    // Render loop
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Resize
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, []);

  // Handle clicking on hamster
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const scene = sceneRef.current;
      if (!scene) return;

      const pickResult = scene.pick(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      if (pickResult?.hit && pickResult.pickedMesh) {
        const mesh = pickResult.pickedMesh;
        // Check if clicked on hamster (any mesh parented to hamster node)
        let node: BABYLON.Node | null = mesh;
        while (node) {
          if (node.name === "hamster") {
            // Pet the hamster!
            onStateChange((prev) => pet(prev));

            // Visual feedback - hamster jumps
            if (hamsterRef.current) {
              const h = hamsterRef.current;
              const startY = h.position.y;
              const jumpAnim = new BABYLON.Animation(
                "jump",
                "position.y",
                30,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );
              jumpAnim.setKeys([
                { frame: 0, value: startY },
                { frame: 5, value: startY + 0.5 },
                { frame: 10, value: startY },
              ]);
              h.animations = [jumpAnim];
              scene.beginAnimation(h, 0, 10, false);
            }
            break;
          }
          node = node.parent;
        }
      }
    },
    [onStateChange]
  );

  return (
    <canvas
      ref={canvasRef}
      className="w-full flex-1"
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none" }}
    />
  );
}
