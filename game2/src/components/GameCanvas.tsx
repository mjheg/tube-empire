"use client";

import { useRef, useEffect, useCallback } from "react";
import * as BABYLON from "@babylonjs/core";
import { HamsterState } from "@/game/state";
import { pet } from "@/game/stats";
import { InteractMode } from "./Game";
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

const ITEM_POSITIONS = {
  "water-bottle": { x: -4, z: -2.5 },
  "food-bowl": { x: -3.5, z: 2 },
  "wheel": { x: 0, z: -1 },
  "house": { x: 3.5, z: 1 },
};

interface Props {
  state: HamsterState;
  mode: InteractMode;
  onStateChange: (updater: (prev: HamsterState) => HamsterState) => void;
  onFeed: () => void;
}

export function GameCanvas({ state, mode, onStateChange, onFeed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const hamsterRef = useRef<BABYLON.TransformNode | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null);
  const stateRef = useRef(state);
  const modeRef = useRef(mode);

  const targetRef = useRef({ x: 0, z: 0 });
  const timerRef = useRef(3);
  const behaviorRef = useRef<"wander" | "eat" | "sleep" | "wheel">("wander");

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => {
    modeRef.current = mode;
    // Enable/disable camera controls based on mode
    if (cameraRef.current) {
      if (mode === "move") {
        cameraRef.current.attachControl(canvasRef.current!, true);
      } else {
        cameraRef.current.detachControl();
      }
    }
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { engine, scene, camera, shadowGen } = createScene(canvas);
    engineRef.current = engine;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Start with camera detached (touch mode default)
    camera.detachControl();

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

    const toyBall = createToyBall(scene, shadowGen);
    toyBall.position = new BABYLON.Vector3(3.5, 0, -2);

    const hamsterBall = createHamsterBall(scene, shadowGen);
    hamsterBall.position = new BABYLON.Vector3(-1, 0, -2);

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

      // AI behavior
      timerRef.current -= dt;
      if (timerRef.current <= 0) {
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
            x: (Math.random() - 0.5) * 8,
            z: (Math.random() - 0.5) * 5,
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

        const targetAngle = Math.atan2(dx, dz);
        let angleDiff = targetAngle - h.rotation.y;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        h.rotation.y += angleDiff * 5 * dt;

        h.position.y = Math.abs(Math.sin(now * 0.01)) * 0.1;
      } else {
        h.position.y = Math.sin(now * 0.003) * 0.02 + 0.02;

        if (behaviorRef.current === "sleep") {
          h.rotation.z = Math.sin(now * 0.001) * 0.05;
        } else {
          h.rotation.z = 0;
        }
      }

      h.position.x = Math.max(-4.5, Math.min(4.5, h.position.x));
      h.position.z = Math.max(-3, Math.min(3, h.position.z));

      // Breathing
      const body = scene.getMeshByName("body");
      if (body) {
        body.scaling.y = 1 + Math.sin(now * 0.003) * 0.025;
      }

      // Wheel rotation when near wheel
      if (behaviorRef.current === "wheel" && dist < 0.5) {
        const wheelMesh = scene.getMeshByName("wheelRing");
        if (wheelMesh) wheelMesh.rotation.z += dt * 3;
        const plate = scene.getMeshByName("wheelPlate");
        if (plate) plate.rotation.z += dt * 3;
      }
    });

    engine.runRenderLoop(() => scene.render());

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      engine.dispose();
    };
  }, []);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const scene = sceneRef.current;
      if (!scene || modeRef.current === "move") return;

      const pickResult = scene.pick(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

      if (modeRef.current === "feed") {
        // Feed mode: drop food where clicked on floor
        if (pickResult?.hit) {
          onFeed();

          // Visual: create a small food sphere at click position
          if (pickResult.pickedPoint) {
            const food = BABYLON.MeshBuilder.CreateSphere("foodDrop", { diameter: 0.15 }, scene);
            food.position = pickResult.pickedPoint.clone();
            food.position.y = 0.1;
            const foodMat = new BABYLON.StandardMaterial("foodDropMat", scene);
            foodMat.diffuseColor = new BABYLON.Color3(0.55, 0.43, 0.35);
            food.material = foodMat;

            // Make hamster go to food
            targetRef.current = { x: food.position.x, z: food.position.z };
            timerRef.current = 5;
            behaviorRef.current = "eat";

            // Remove food after 3 seconds
            setTimeout(() => food.dispose(), 3000);
          }
        }
        return;
      }

      // Touch mode: pet the hamster
      if (pickResult?.hit && pickResult.pickedMesh) {
        let node: BABYLON.Node | null = pickResult.pickedMesh;
        while (node) {
          if (node.name === "hamster") {
            onStateChange((prev) => pet(prev));

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
            }
            break;
          }
          node = node.parent;
        }
      }
    },
    [onStateChange, onFeed]
  );

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onPointerDown={handlePointerDown}
      style={{ touchAction: "none" }}
    />
  );
}
