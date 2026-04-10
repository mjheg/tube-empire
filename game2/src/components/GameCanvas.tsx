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
  createToyBall,
  createHamsterBall,
} from "@/canvas/scene";

// Item positions in 3D space
const ITEM_POSITIONS = {
  "water-bottle": { x: -3, z: -2 },
  "food-bowl": { x: -2.5, z: 1.5 },
  "wheel": { x: 2, z: -1 },
  "house": { x: 2.5, z: 1.5 },
};

interface Props {
  state: HamsterState;
  onStateChange: (updater: (prev: HamsterState) => HamsterState) => void;
}

export function GameCanvas({ state, onStateChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const hamsterRef = useRef<BABYLON.TransformNode | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const stateRef = useRef(state);

  // AI state
  const targetRef = useRef({ x: 0, z: 0 });
  const timerRef = useRef(3);
  const behaviorRef = useRef<"wander" | "eat" | "sleep" | "wheel">("wander");

  // Keep stateRef in sync
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

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
    waterBottle.position = new BABYLON.Vector3(ITEM_POSITIONS["water-bottle"].x, 0, ITEM_POSITIONS["water-bottle"].z);

    const wheel = createWheel(scene, shadowGen);
    wheel.position = new BABYLON.Vector3(ITEM_POSITIONS["wheel"].x, 0, ITEM_POSITIONS["wheel"].z);

    const foodBowl = createFoodBowl(scene, shadowGen);
    foodBowl.position = new BABYLON.Vector3(ITEM_POSITIONS["food-bowl"].x, 0, ITEM_POSITIONS["food-bowl"].z);

    const house = createHouse(scene, shadowGen);
    house.position = new BABYLON.Vector3(ITEM_POSITIONS["house"].x, 0, ITEM_POSITIONS["house"].z);

    // Extra items for visual richness
    const toyBall = createToyBall(scene, shadowGen);
    toyBall.position = new BABYLON.Vector3(-0.5, 0, 0.5);

    const hamsterBall = createHamsterBall(scene, shadowGen);
    hamsterBall.position = new BABYLON.Vector3(1, 0, -2);

    // Initial target
    targetRef.current = { x: Math.random() * 4 - 2, z: Math.random() * 3 - 1.5 };

    // Animation loop
    let lastTime = performance.now();
    scene.registerBeforeRender(() => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!hamsterRef.current) return;
      const h = hamsterRef.current;
      const s = stateRef.current;

      // === HAMSTER AI ===
      timerRef.current -= dt;
      if (timerRef.current <= 0) {
        // Pick behavior based on state
        if (s.hunger < 30) {
          behaviorRef.current = "eat";
          targetRef.current = { ...ITEM_POSITIONS["food-bowl"] };
        } else if (s.energy < 20) {
          behaviorRef.current = "sleep";
          targetRef.current = { ...ITEM_POSITIONS["house"] };
        } else if (s.happiness > 60 && s.energy > 40 && Math.random() < 0.3) {
          behaviorRef.current = "wheel";
          targetRef.current = { ...ITEM_POSITIONS["wheel"] };
        } else {
          behaviorRef.current = "wander";
          targetRef.current = {
            x: (Math.random() - 0.5) * 6,
            z: (Math.random() - 0.5) * 4,
          };
        }
        timerRef.current = 3 + Math.random() * 5;
      }

      // Move toward target
      const dx = targetRef.current.x - h.position.x;
      const dz = targetRef.current.z - h.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.3) {
        const speed = 1.5;
        h.position.x += (dx / dist) * speed * dt;
        h.position.z += (dz / dist) * speed * dt;

        // Smooth rotation toward target
        const targetAngle = Math.atan2(dx, dz);
        let angleDiff = targetAngle - h.rotation.y;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        h.rotation.y += angleDiff * 5 * dt;

        // Walking bounce
        h.position.y = Math.abs(Math.sin(now * 0.01)) * 0.1;
      } else {
        // Arrived at target - idle bobbing
        h.position.y = Math.sin(now * 0.003) * 0.02 + 0.02;

        // Sleeping: slight rotation (lying down feel)
        if (behaviorRef.current === "sleep") {
          h.rotation.z = Math.sin(now * 0.001) * 0.05;
        } else {
          h.rotation.z = 0;
        }
      }

      // Clamp to cage bounds
      h.position.x = Math.max(-3.5, Math.min(3.5, h.position.x));
      h.position.z = Math.max(-2.5, Math.min(2.5, h.position.z));

      // === BREATHING ===
      const body = scene.getMeshByName("body");
      if (body) {
        const breathe = 1 + Math.sin(now * 0.003) * 0.025;
        body.scaling.y = breathe;
      }

      // === CHEEK SIZE (hunger indicator) ===
      const cheeks = scene.getMeshesByTags?.("cheek") ?? [];
      if (cheeks.length === 0) {
        // Find cheeks by name
        scene.meshes.forEach((m) => {
          if (m.name === "cheek") {
            const puffScale = s.hunger > 70 ? 1.3 : s.hunger > 40 ? 1.0 : 0.8;
            m.scaling = new BABYLON.Vector3(puffScale, puffScale, puffScale);
          }
        });
      }

      // === WHEEL ROTATION ===
      if (behaviorRef.current === "wheel" && dist < 0.5) {
        const wheelMesh = scene.getMeshByName("wheelRing");
        if (wheelMesh) {
          wheelMesh.rotation.z += dt * 3;
        }
        const plate = scene.getMeshByName("wheelPlate");
        if (plate) {
          plate.rotation.z += dt * 3;
        }
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
        let node: BABYLON.Node | null = pickResult.pickedMesh;
        while (node) {
          if (node.name === "hamster") {
            // Pet the hamster!
            onStateChange((prev) => pet(prev));

            // Jump animation
            if (hamsterRef.current) {
              const h = hamsterRef.current;
              const startY = h.position.y;
              const jumpAnim = new BABYLON.Animation(
                "jump", "position.y", 30,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );
              jumpAnim.setKeys([
                { frame: 0, value: startY },
                { frame: 5, value: startY + 0.6 },
                { frame: 10, value: startY },
              ]);
              h.animations = [jumpAnim];
              scene.beginAnimation(h, 0, 10, false);

              // Spin happily
              const spinAnim = new BABYLON.Animation(
                "spin", "rotation.y", 30,
                BABYLON.Animation.ANIMATIONTYPE_FLOAT,
                BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
              );
              const startRot = h.rotation.y;
              spinAnim.setKeys([
                { frame: 0, value: startRot },
                { frame: 10, value: startRot + Math.PI * 2 },
              ]);
              h.animations.push(spinAnim);
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
