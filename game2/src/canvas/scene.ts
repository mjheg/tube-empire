"use client";

import * as BABYLON from "@babylonjs/core";

export function createScene(canvas: HTMLCanvasElement) {
  const engine = new BABYLON.Engine(canvas, true, { stencil: false });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.96, 0.91, 0.82, 1); // warm beige

  // Camera - 3/4 view like hammyhome
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,    // horizontal angle
    Math.PI / 3.5,   // vertical angle (~50 degrees from top)
    12,              // distance
    new BABYLON.Vector3(0, 0, 0),
    scene
  );
  camera.lowerRadiusLimit = 8;
  camera.upperRadiusLimit = 18;
  camera.lowerBetaLimit = 0.5;
  camera.upperBetaLimit = Math.PI / 2.5;
  camera.attachControl(canvas, true);
  camera.panningSensibility = 0; // disable panning

  // Lighting
  const hemiLight = new BABYLON.HemisphericLight(
    "hemiLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  hemiLight.intensity = 0.7;

  const dirLight = new BABYLON.DirectionalLight(
    "dirLight",
    new BABYLON.Vector3(-1, -2, 1),
    scene
  );
  dirLight.intensity = 0.5;

  // Shadows
  const shadowGen = new BABYLON.ShadowGenerator(1024, dirLight);
  shadowGen.useBlurExponentialShadowMap = true;

  // === CAGE ===
  // Floor
  const floor = BABYLON.MeshBuilder.CreateBox("floor", { width: 8, height: 0.15, depth: 6 }, scene);
  floor.position.y = -0.075;
  const floorMat = new BABYLON.StandardMaterial("floorMat", scene);
  floorMat.diffuseColor = new BABYLON.Color3(0.95, 0.9, 0.78);
  floorMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  floor.material = floorMat;
  floor.receiveShadows = true;

  // Bedding texture (small bumps)
  const beddingTexture = new BABYLON.DynamicTexture("beddingTex", 512, scene);
  const texCtx = beddingTexture.getContext();
  texCtx.fillStyle = "#f0dfc0";
  texCtx.fillRect(0, 0, 512, 512);
  texCtx.fillStyle = "#e8d5b0";
  for (let i = 0; i < 200; i++) {
    texCtx.fillRect(
      Math.random() * 512,
      Math.random() * 512,
      3 + Math.random() * 5,
      1 + Math.random() * 2
    );
  }
  beddingTexture.update();
  floorMat.diffuseTexture = beddingTexture;

  // Cage walls (wooden frame)
  const wallMat = new BABYLON.StandardMaterial("wallMat", scene);
  wallMat.diffuseColor = new BABYLON.Color3(0.72, 0.58, 0.3);
  wallMat.specularColor = new BABYLON.Color3(0.2, 0.15, 0.05);

  const wallThickness = 0.25;
  const wallHeight = 2.5;

  // Back wall
  const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: 8.5, height: wallHeight, depth: wallThickness }, scene);
  backWall.position = new BABYLON.Vector3(0, wallHeight / 2, -3.125);
  backWall.material = wallMat;

  // Front wall (lower, so we can see inside)
  const frontWall = BABYLON.MeshBuilder.CreateBox("frontWall", { width: 8.5, height: 0.8, depth: wallThickness }, scene);
  frontWall.position = new BABYLON.Vector3(0, 0.4, 3.125);
  frontWall.material = wallMat;

  // Left wall
  const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: wallThickness, height: wallHeight, depth: 6.5 }, scene);
  leftWall.position = new BABYLON.Vector3(-4.125, wallHeight / 2, 0);
  leftWall.material = wallMat;

  // Right wall
  const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: wallThickness, height: wallHeight, depth: 6.5 }, scene);
  rightWall.position = new BABYLON.Vector3(4.125, wallHeight / 2, 0);
  rightWall.material = wallMat;

  return { engine, scene, camera, shadowGen };
}

// === 3D HAMSTER from primitives ===
export function createHamster(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const hamster = new BABYLON.TransformNode("hamster", scene);

  // Body
  const body = BABYLON.MeshBuilder.CreateSphere("body", { diameterX: 1.2, diameterY: 1.0, diameterZ: 1.0 }, scene);
  body.position.y = 0.5;
  body.parent = hamster;
  const bodyMat = new BABYLON.StandardMaterial("bodyMat", scene);
  bodyMat.diffuseColor = new BABYLON.Color3(0.83, 0.65, 0.46);
  bodyMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
  body.material = bodyMat;
  shadowGen.addShadowCaster(body);

  // Belly (white patch)
  const belly = BABYLON.MeshBuilder.CreateSphere("belly", { diameterX: 0.8, diameterY: 0.7, diameterZ: 0.7 }, scene);
  belly.position = new BABYLON.Vector3(0, 0.45, 0.15);
  belly.parent = hamster;
  const bellyMat = new BABYLON.StandardMaterial("bellyMat", scene);
  bellyMat.diffuseColor = new BABYLON.Color3(0.96, 0.93, 0.88);
  bellyMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);
  belly.material = bellyMat;

  // Head
  const head = BABYLON.MeshBuilder.CreateSphere("head", { diameter: 0.75 }, scene);
  head.position = new BABYLON.Vector3(0, 0.85, 0.35);
  head.parent = hamster;
  head.material = bodyMat;
  shadowGen.addShadowCaster(head);

  // Ears
  for (const side of [-1, 1]) {
    const ear = BABYLON.MeshBuilder.CreateSphere("ear", { diameterX: 0.25, diameterY: 0.3, diameterZ: 0.1 }, scene);
    ear.position = new BABYLON.Vector3(side * 0.3, 1.15, 0.25);
    ear.parent = hamster;
    const earMat = new BABYLON.StandardMaterial("earMat", scene);
    earMat.diffuseColor = new BABYLON.Color3(0.95, 0.7, 0.7);
    ear.material = earMat;
  }

  // Eyes
  for (const side of [-1, 1]) {
    const eye = BABYLON.MeshBuilder.CreateSphere("eye", { diameter: 0.12 }, scene);
    eye.position = new BABYLON.Vector3(side * 0.15, 0.92, 0.6);
    eye.parent = hamster;
    const eyeMat = new BABYLON.StandardMaterial("eyeMat", scene);
    eyeMat.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05);
    eye.material = eyeMat;

    // Eye shine
    const shine = BABYLON.MeshBuilder.CreateSphere("shine", { diameter: 0.05 }, scene);
    shine.position = new BABYLON.Vector3(side * 0.13, 0.94, 0.65);
    shine.parent = hamster;
    const shineMat = new BABYLON.StandardMaterial("shineMat", scene);
    shineMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
    shineMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
    shine.material = shineMat;
  }

  // Nose
  const nose = BABYLON.MeshBuilder.CreateSphere("nose", { diameter: 0.1 }, scene);
  nose.position = new BABYLON.Vector3(0, 0.82, 0.7);
  nose.parent = hamster;
  const noseMat = new BABYLON.StandardMaterial("noseMat", scene);
  noseMat.diffuseColor = new BABYLON.Color3(0.95, 0.6, 0.6);
  nose.material = noseMat;

  // Cheeks
  for (const side of [-1, 1]) {
    const cheek = BABYLON.MeshBuilder.CreateSphere("cheek", { diameterX: 0.35, diameterY: 0.25, diameterZ: 0.25 }, scene);
    cheek.position = new BABYLON.Vector3(side * 0.3, 0.78, 0.45);
    cheek.parent = hamster;
    const cheekMat = new BABYLON.StandardMaterial("cheekMat", scene);
    cheekMat.diffuseColor = new BABYLON.Color3(0.9, 0.72, 0.55);
    cheekMat.alpha = 0.9;
    cheek.material = cheekMat;
  }

  // Front paws
  for (const side of [-1, 1]) {
    const paw = BABYLON.MeshBuilder.CreateSphere("paw", { diameterX: 0.18, diameterY: 0.12, diameterZ: 0.2 }, scene);
    paw.position = new BABYLON.Vector3(side * 0.3, 0.15, 0.35);
    paw.parent = hamster;
    paw.material = bodyMat;
  }

  // Back paws
  for (const side of [-1, 1]) {
    const paw = BABYLON.MeshBuilder.CreateSphere("backPaw", { diameterX: 0.22, diameterY: 0.12, diameterZ: 0.25 }, scene);
    paw.position = new BABYLON.Vector3(side * 0.35, 0.12, -0.2);
    paw.parent = hamster;
    paw.material = bodyMat;
  }

  // Tail
  const tail = BABYLON.MeshBuilder.CreateSphere("tail", { diameter: 0.15 }, scene);
  tail.position = new BABYLON.Vector3(0, 0.35, -0.55);
  tail.parent = hamster;
  tail.material = bodyMat;

  return hamster;
}

// === CAGE ITEMS ===
export function createWaterBottle(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const group = new BABYLON.TransformNode("waterBottle", scene);

  // Bottle body (transparent)
  const bottle = BABYLON.MeshBuilder.CreateCylinder("bottle", { height: 2, diameter: 0.7, tessellation: 16 }, scene);
  bottle.position.y = 1.5;
  bottle.parent = group;
  const bottleMat = new BABYLON.StandardMaterial("bottleMat", scene);
  bottleMat.diffuseColor = new BABYLON.Color3(0.7, 0.85, 1);
  bottleMat.alpha = 0.6;
  bottleMat.specularColor = new BABYLON.Color3(0.5, 0.5, 0.5);
  bottle.material = bottleMat;

  // Water inside
  const water = BABYLON.MeshBuilder.CreateCylinder("water", { height: 1.2, diameter: 0.55, tessellation: 16 }, scene);
  water.position.y = 1.1;
  water.parent = group;
  const waterMat = new BABYLON.StandardMaterial("waterMat", scene);
  waterMat.diffuseColor = new BABYLON.Color3(0.3, 0.6, 1);
  waterMat.alpha = 0.7;
  water.material = waterMat;

  // Spout
  const spout = BABYLON.MeshBuilder.CreateCylinder("spout", { height: 0.6, diameter: 0.15 }, scene);
  spout.position.y = 0.3;
  spout.parent = group;
  const spoutMat = new BABYLON.StandardMaterial("spoutMat", scene);
  spoutMat.diffuseColor = new BABYLON.Color3(0.7, 0.75, 0.8);
  spoutMat.specularColor = new BABYLON.Color3(0.4, 0.4, 0.4);
  spout.material = spoutMat;

  // Mounting bracket
  const bracket = BABYLON.MeshBuilder.CreateBox("bracket", { width: 1, height: 0.15, depth: 0.3 }, scene);
  bracket.position.y = 1.8;
  bracket.parent = group;
  const bracketMat = new BABYLON.StandardMaterial("bracketMat", scene);
  bracketMat.diffuseColor = new BABYLON.Color3(0.3, 0.7, 0.3);
  bracket.material = bracketMat;

  shadowGen.addShadowCaster(bottle);
  return group;
}

export function createWheel(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const group = new BABYLON.TransformNode("wheel", scene);

  // Wheel disc
  const wheel = BABYLON.MeshBuilder.CreateTorus("wheelRing", { diameter: 2.5, thickness: 0.15, tessellation: 32 }, scene);
  wheel.position.y = 1.5;
  wheel.rotation.x = Math.PI / 2;
  wheel.parent = group;
  const wheelMat = new BABYLON.StandardMaterial("wheelMat", scene);
  wheelMat.diffuseColor = new BABYLON.Color3(0.45, 0.5, 0.85);
  wheelMat.specularColor = new BABYLON.Color3(0.3, 0.3, 0.4);
  wheel.material = wheelMat;

  // Wheel back plate
  const plate = BABYLON.MeshBuilder.CreateDisc("wheelPlate", { radius: 1.2, tessellation: 32 }, scene);
  plate.position = new BABYLON.Vector3(0, 1.5, -0.05);
  plate.parent = group;
  const plateMat = new BABYLON.StandardMaterial("plateMat", scene);
  plateMat.diffuseColor = new BABYLON.Color3(0.55, 0.6, 0.9);
  plateMat.alpha = 0.8;
  plate.material = plateMat;

  // Spokes
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const spoke = BABYLON.MeshBuilder.CreateCylinder("spoke", { height: 1.15, diameter: 0.06 }, scene);
    spoke.position = new BABYLON.Vector3(
      Math.cos(angle) * 0.575,
      1.5 + Math.sin(angle) * 0.575,
      0
    );
    spoke.rotation.z = angle;
    spoke.parent = group;
    spoke.material = wheelMat;
  }

  // Stand
  const stand = BABYLON.MeshBuilder.CreateBox("stand", { width: 0.3, height: 1.5, depth: 0.3 }, scene);
  stand.position = new BABYLON.Vector3(0, 0.75, -0.3);
  stand.parent = group;
  const standMat = new BABYLON.StandardMaterial("standMat", scene);
  standMat.diffuseColor = new BABYLON.Color3(0.5, 0.55, 0.6);
  stand.material = standMat;

  // Base
  const base = BABYLON.MeshBuilder.CreateBox("base", { width: 1.2, height: 0.15, depth: 0.8 }, scene);
  base.position.y = 0.075;
  base.parent = group;
  base.material = standMat;

  shadowGen.addShadowCaster(wheel);
  shadowGen.addShadowCaster(stand);
  return group;
}

export function createFoodBowl(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const group = new BABYLON.TransformNode("foodBowl", scene);

  // Bowl (half sphere shape using lathe)
  const bowlProfile = [
    new BABYLON.Vector3(0.5, 0, 0),
    new BABYLON.Vector3(0.55, 0.1, 0),
    new BABYLON.Vector3(0.5, 0.25, 0),
    new BABYLON.Vector3(0.35, 0.3, 0),
    new BABYLON.Vector3(0.3, 0.25, 0),
    new BABYLON.Vector3(0.4, 0.08, 0),
    new BABYLON.Vector3(0, 0.05, 0),
  ];
  const bowl = BABYLON.MeshBuilder.CreateLathe("bowl", { shape: bowlProfile, tessellation: 24 }, scene);
  bowl.position.y = 0;
  bowl.parent = group;
  const bowlMat = new BABYLON.StandardMaterial("bowlMat", scene);
  bowlMat.diffuseColor = new BABYLON.Color3(0.9, 0.45, 0.15);
  bowlMat.specularColor = new BABYLON.Color3(0.2, 0.1, 0.05);
  bowl.material = bowlMat;

  // Seeds
  for (let i = 0; i < 5; i++) {
    const seed = BABYLON.MeshBuilder.CreateSphere("seed", { diameterX: 0.12, diameterY: 0.06, diameterZ: 0.08 }, scene);
    seed.position = new BABYLON.Vector3(
      (Math.random() - 0.5) * 0.3,
      0.28,
      (Math.random() - 0.5) * 0.3
    );
    seed.parent = group;
    const seedMat = new BABYLON.StandardMaterial("seedMat", scene);
    seedMat.diffuseColor = new BABYLON.Color3(0.55, 0.43, 0.35);
    seed.material = seedMat;
  }

  shadowGen.addShadowCaster(bowl);
  return group;
}

export function createHouse(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const group = new BABYLON.TransformNode("house", scene);

  // Main body
  const body = BABYLON.MeshBuilder.CreateBox("houseBody", { width: 1.8, height: 1.2, depth: 1.5 }, scene);
  body.position.y = 0.6;
  body.parent = group;
  const houseMat = new BABYLON.StandardMaterial("houseMat", scene);
  houseMat.diffuseColor = new BABYLON.Color3(0.4, 0.73, 0.42);
  houseMat.specularColor = new BABYLON.Color3(0.1, 0.15, 0.1);
  body.material = houseMat;
  shadowGen.addShadowCaster(body);

  // Roof (slightly wider)
  const roof = BABYLON.MeshBuilder.CreateBox("roof", { width: 2, height: 0.2, depth: 1.7 }, scene);
  roof.position.y = 1.3;
  roof.parent = group;
  const roofMat = new BABYLON.StandardMaterial("roofMat", scene);
  roofMat.diffuseColor = new BABYLON.Color3(0.3, 0.6, 0.32);
  roof.material = roofMat;

  // Door (hole - dark cylinder)
  const door = BABYLON.MeshBuilder.CreateCylinder("door", { height: 0.1, diameter: 0.7, tessellation: 16 }, scene);
  door.position = new BABYLON.Vector3(0, 0.45, 0.76);
  door.rotation.x = Math.PI / 2;
  door.parent = group;
  const doorMat = new BABYLON.StandardMaterial("doorMat", scene);
  doorMat.diffuseColor = new BABYLON.Color3(0.05, 0.15, 0.05);
  door.material = doorMat;

  // Window
  const win = BABYLON.MeshBuilder.CreateBox("window", { width: 0.3, height: 0.25, depth: 0.05 }, scene);
  win.position = new BABYLON.Vector3(0.5, 0.8, 0.76);
  win.parent = group;
  const winMat = new BABYLON.StandardMaterial("winMat", scene);
  winMat.diffuseColor = new BABYLON.Color3(1, 0.95, 0.4);
  winMat.emissiveColor = new BABYLON.Color3(0.3, 0.28, 0.1);
  win.material = winMat;

  return group;
}
