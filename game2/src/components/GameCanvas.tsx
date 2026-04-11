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

const ITEM_POSITIONS = {
  "water-bottle": { x: -4.2, z: -1 },
  "food-bowl": { x: -2, z: 2 },
  "wheel": { x: 0.5, z: 0 },
  "house": { x: 3.5, z: 0.5 },
};

interface Props {
  state: HamsterState;
  feedMode: boolean;
  onStateChange: (updater: (prev: HamsterState) => HamsterState) => void;
  onFeed: () => void;
}

export function GameCanvas({ state, feedMode, onStateChange, onFeed }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const hamsterRef = useRef<BABYLON.TransformNode | null>(null);
  const stateRef = useRef(state);
  const feedModeRef = useRef(feedMode);

  // Hamster AI
  const targetRef = useRef({ x: 0, z: 0 });
  const timerRef = useRef(3);

  // Dragging hamster
  const isDraggingHamsterRef = useRef(false);
  const isPettingRef = useRef(false);
  const petCountRef = useRef(0);

  useEffect(() => { stateRef.current = state; }, [state]);
  useEffect(() => { feedModeRef.current = feedMode; }, [feedMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { engine, scene, camera, shadowGen } = createScene(canvas);
    sceneRef.current = scene;

    // Camera always attached for rotation/zoom
    camera.attachControl(canvas, true);

    // Create hamster
    const hamster = createHamster(scene, shadowGen);
    hamster.position = new BABYLON.Vector3(1, 0, 1);
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
    toyBall.position = new BABYLON.Vector3(2, 0, 2);

    const hamsterBall = createHamsterBall(scene, shadowGen);
    hamsterBall.position = new BABYLON.Vector3(3.5, 0, -2);

    // === HAMSTER AI ===
    let lastTime = performance.now();
    scene.registerBeforeRender(() => {
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      if (!hamsterRef.current || isDraggingHamsterRef.current) return;
      const h = hamsterRef.current;
      const s = stateRef.current;

      // Pick behavior
      timerRef.current -= dt;
      if (timerRef.current <= 0) {
        timerRef.current = 3 + Math.random() * 5;
        if (s.hunger < 30) {
          targetRef.current = { ...ITEM_POSITIONS["food-bowl"] };
        } else if (s.energy < 20) {
          targetRef.current = { ...ITEM_POSITIONS["house"] };
        } else if (s.happiness > 60 && Math.random() < 0.3) {
          targetRef.current = { ...ITEM_POSITIONS["wheel"] };
        } else {
          targetRef.current = { x: (Math.random() - 0.5) * 8, z: (Math.random() - 0.5) * 5 };
        }
      }

      // Move
      const dx = targetRef.current.x - h.position.x;
      const dz = targetRef.current.z - h.position.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.3) {
        h.position.x += (dx / dist) * 1.5 * dt;
        h.position.z += (dz / dist) * 1.5 * dt;
        const targetAngle = Math.atan2(dx, dz);
        let angleDiff = targetAngle - h.rotation.y;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        h.rotation.y += angleDiff * 5 * dt;
        h.position.y = Math.abs(Math.sin(now * 0.01)) * 0.08;
      } else {
        h.position.y = Math.sin(now * 0.003) * 0.02 + 0.01;
      }

      h.position.x = Math.max(-4.5, Math.min(4.5, h.position.x));
      h.position.z = Math.max(-3, Math.min(3, h.position.z));

      // Breathing
      const body = scene.getMeshByName("body");
      if (body) body.scaling.y = 1 + Math.sin(now * 0.003) * 0.02;

      // Wheel rotation
      const wheelDist = Math.sqrt(
        (h.position.x - ITEM_POSITIONS["wheel"].x) ** 2 +
        (h.position.z - ITEM_POSITIONS["wheel"].z) ** 2
      );
      if (wheelDist < 1) {
        const wheelMesh = scene.getMeshByName("wheelRing");
        if (wheelMesh) wheelMesh.rotation.z += dt * 3;
        const plate = scene.getMeshByName("wheelPlate");
        if (plate) plate.rotation.z += dt * 3;
      }
    });

    // === POINTER EVENTS for hamster interaction ===
    let pointerDownOnHamster = false;
    let dragStartPos = { x: 0, y: 0 };

    scene.onPointerDown = (evt, pickResult) => {
      if (feedModeRef.current && pickResult?.hit && pickResult.pickedPoint) {
        // Feed mode: drop food
        onFeed();
        const food = BABYLON.MeshBuilder.CreateSphere("foodDrop", { diameter: 0.15 }, scene);
        food.position = pickResult.pickedPoint.clone();
        food.position.y = 0.1;
        const foodMat = new BABYLON.StandardMaterial("fdm", scene);
        foodMat.diffuseColor = new BABYLON.Color3(0.55, 0.43, 0.35);
        food.material = foodMat;
        if (hamsterRef.current) {
          targetRef.current = { x: food.position.x, z: food.position.z };
          timerRef.current = 5;
        }
        setTimeout(() => food.dispose(), 3000);
        return;
      }

      // Check if clicked hamster
      if (pickResult?.hit && pickResult.pickedMesh) {
        let node: BABYLON.Node | null = pickResult.pickedMesh;
        while (node) {
          if (node.name === "hamster") {
            pointerDownOnHamster = true;
            dragStartPos = { x: evt.clientX, y: evt.clientY };
            petCountRef.current = 0;
            // Disable camera while interacting with hamster
            camera.detachControl();
            return;
          }
          node = node.parent;
        }
      }
    };

    // Target position for drag (hamster lerps toward it for resistance feel)
    let dragTargetX = 0;
    let dragTargetZ = 0;
    let dragLiftTarget = 0;

    scene.onPointerMove = (evt) => {
      if (!pointerDownOnHamster || !hamsterRef.current) return;

      const dx = evt.clientX - dragStartPos.x;
      const dy = evt.clientY - dragStartPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 10) {
        isDraggingHamsterRef.current = true;

        // Get target position on floor
        const pickResult = scene.pick(evt.clientX, evt.clientY, (mesh) => mesh.name === "floor");
        if (pickResult?.hit && pickResult.pickedPoint) {
          dragTargetX = Math.max(-4.5, Math.min(4.5, pickResult.pickedPoint.x));
          dragTargetZ = Math.max(-3, Math.min(3, pickResult.pickedPoint.z));
          dragLiftTarget = 0.4; // slight lift, not too high
        }

        // Petting effect
        petCountRef.current += dist;
        if (petCountRef.current > 40) {
          petCountRef.current = 0;
          onStateChange((prev) => pet(prev));
        }
        dragStartPos = { x: evt.clientX, y: evt.clientY };
      }
    };

    // Smooth drag follow in render loop (creates resistance feeling)
    scene.registerBeforeRender(() => {
      if (!isDraggingHamsterRef.current || !hamsterRef.current) return;
      const h = hamsterRef.current;
      // Lerp toward target (0.12 = resistance, lower = more resistance)
      const lerpSpeed = 0.12;
      h.position.x += (dragTargetX - h.position.x) * lerpSpeed;
      h.position.z += (dragTargetZ - h.position.z) * lerpSpeed;
      h.position.y += (dragLiftTarget - h.position.y) * lerpSpeed;

      // Slight wobble while being held
      const now = performance.now();
      h.rotation.z = Math.sin(now * 0.008) * 0.1;
      h.rotation.x = Math.sin(now * 0.006) * 0.05;
    });

    scene.onPointerUp = () => {
      if (pointerDownOnHamster && !isDraggingHamsterRef.current) {
        // Tap on hamster = pet + small bounce
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
            { frame: 4, value: startY + 0.3 },
            { frame: 8, value: startY },
          ]);
          h.animations = [jumpAnim];
          scene.beginAnimation(h, 0, 8, false);
        }
      }

      if (isDraggingHamsterRef.current && hamsterRef.current) {
        // Smooth drop with bounce
        const h = hamsterRef.current;
        const startY = h.position.y;
        const dropAnim = new BABYLON.Animation(
          "drop", "position.y", 30,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        dropAnim.setKeys([
          { frame: 0, value: startY },
          { frame: 4, value: 0 },
          { frame: 6, value: 0.1 },  // small bounce
          { frame: 8, value: 0 },
        ]);
        h.animations = [dropAnim];
        scene.beginAnimation(h, 0, 8, false);

        // Reset rotation smoothly
        const rotZAnim = new BABYLON.Animation(
          "rotZ", "rotation.z", 30,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        rotZAnim.setKeys([
          { frame: 0, value: h.rotation.z },
          { frame: 6, value: 0 },
        ]);
        const rotXAnim = new BABYLON.Animation(
          "rotX", "rotation.x", 30,
          BABYLON.Animation.ANIMATIONTYPE_FLOAT,
          BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
        );
        rotXAnim.setKeys([
          { frame: 0, value: h.rotation.x },
          { frame: 6, value: 0 },
        ]);
        h.animations.push(rotZAnim, rotXAnim);
        scene.beginAnimation(h, 0, 8, false);
      }

      pointerDownOnHamster = false;
      isDraggingHamsterRef.current = false;
      isPettingRef.current = false;
      // Re-enable camera
      camera.attachControl(canvas, true);
    };

    engine.runRenderLoop(() => scene.render());
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      scene.onPointerDown = undefined;
      scene.onPointerMove = undefined;
      scene.onPointerUp = undefined;
      engine.dispose();
    };
  }, [onStateChange, onFeed]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
}
