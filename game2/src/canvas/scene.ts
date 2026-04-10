"use client";

import * as BABYLON from "@babylonjs/core";

export function createScene(canvas: HTMLCanvasElement) {
  const engine = new BABYLON.Engine(canvas, true, { stencil: false });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0.91, 0.84, 0.7, 1); // hammyhome warm tan background

  // Camera - front-facing slight top-down like hammyhome
  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    -Math.PI / 2,    // looking from front
    Math.PI / 4,     // ~45 degrees from top (more front-facing)
    14,              // distance
    new BABYLON.Vector3(0, 0.5, 0), // look slightly above center
    scene
  );
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 20;
  camera.lowerBetaLimit = 0.4;
  camera.upperBetaLimit = Math.PI / 2.2;
  camera.attachControl(canvas, true);
  camera.panningSensibility = 0;
  camera.wheelPrecision = 30;

  // Lighting
  const hemiLight = new BABYLON.HemisphericLight(
    "hemiLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  hemiLight.intensity = 0.85;
  hemiLight.groundColor = new BABYLON.Color3(0.4, 0.35, 0.3); // warm ground bounce

  const dirLight = new BABYLON.DirectionalLight(
    "dirLight",
    new BABYLON.Vector3(-1, -2, 1),
    scene
  );
  dirLight.intensity = 0.6;
  dirLight.diffuse = new BABYLON.Color3(1, 0.95, 0.85); // warm sunlight

  // Shadows
  const shadowGen = new BABYLON.ShadowGenerator(1024, dirLight);
  shadowGen.useBlurExponentialShadowMap = true;

  // === CAGE ===
  // Floor (wider landscape proportions like hammyhome)
  const floor = BABYLON.MeshBuilder.CreateBox("floor", { width: 10, height: 0.15, depth: 7 }, scene);
  floor.position.y = -0.075;
  const floorMat = new BABYLON.StandardMaterial("floorMat", scene);
  floorMat.diffuseColor = new BABYLON.Color3(0.96, 0.94, 0.88); // lighter bedding
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
  wallMat.diffuseColor = new BABYLON.Color3(0.75, 0.68, 0.58); // grayish tan like hammyhome
  wallMat.specularColor = new BABYLON.Color3(0.15, 0.12, 0.08);

  const wallThickness = 0.25;
  const wallHeight = 2.5;

  // Back wall
  const backWall = BABYLON.MeshBuilder.CreateBox("backWall", { width: 10.5, height: wallHeight, depth: wallThickness }, scene);
  backWall.position = new BABYLON.Vector3(0, wallHeight / 2, -3.625);
  backWall.material = wallMat;

  // Front wall (lower, so we can see inside)
  const frontWall = BABYLON.MeshBuilder.CreateBox("frontWall", { width: 10.5, height: 0.6, depth: wallThickness }, scene);
  frontWall.position = new BABYLON.Vector3(0, 0.3, 3.625);
  frontWall.material = wallMat;

  // Left wall
  const leftWall = BABYLON.MeshBuilder.CreateBox("leftWall", { width: wallThickness, height: wallHeight, depth: 7.5 }, scene);
  leftWall.position = new BABYLON.Vector3(-5.125, wallHeight / 2, 0);
  leftWall.material = wallMat;

  // Right wall
  const rightWall = BABYLON.MeshBuilder.CreateBox("rightWall", { width: wallThickness, height: wallHeight, depth: 7.5 }, scene);
  rightWall.position = new BABYLON.Vector3(5.125, wallHeight / 2, 0);
  rightWall.material = wallMat;

  return { engine, scene, camera, shadowGen };
}

// === 3D HAMSTER - detailed, bigger, rounder, cuter ===
export function createHamster(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const hamster = new BABYLON.TransformNode("hamster", scene);
  hamster.scaling = new BABYLON.Vector3(1.4, 1.4, 1.4); // bigger overall

  // Materials
  const furMat = new BABYLON.StandardMaterial("furMat", scene);
  furMat.diffuseColor = new BABYLON.Color3(0.82, 0.62, 0.38); // golden brown
  furMat.specularColor = new BABYLON.Color3(0.15, 0.12, 0.08);
  furMat.specularPower = 16;

  const darkFurMat = new BABYLON.StandardMaterial("darkFurMat", scene);
  darkFurMat.diffuseColor = new BABYLON.Color3(0.6, 0.4, 0.22); // darker brown patches
  darkFurMat.specularColor = new BABYLON.Color3(0.1, 0.08, 0.05);

  const bellyMat = new BABYLON.StandardMaterial("bellyMat", scene);
  bellyMat.diffuseColor = new BABYLON.Color3(0.97, 0.94, 0.89); // cream white
  bellyMat.specularColor = new BABYLON.Color3(0.05, 0.05, 0.05);

  const earMat = new BABYLON.StandardMaterial("earMat", scene);
  earMat.diffuseColor = new BABYLON.Color3(0.95, 0.72, 0.72); // pink inside ear

  // === BODY === (plump oval)
  const body = BABYLON.MeshBuilder.CreateSphere("body", {
    diameterX: 1.5, diameterY: 1.2, diameterZ: 1.3, segments: 24
  }, scene);
  body.position.y = 0.6;
  body.parent = hamster;
  body.material = furMat;
  shadowGen.addShadowCaster(body);

  // Back fur (darker stripe)
  const backStripe = BABYLON.MeshBuilder.CreateSphere("backStripe", {
    diameterX: 0.9, diameterY: 0.4, diameterZ: 1.0, segments: 16
  }, scene);
  backStripe.position = new BABYLON.Vector3(0, 0.95, -0.1);
  backStripe.parent = hamster;
  backStripe.material = darkFurMat;

  // Belly
  const belly = BABYLON.MeshBuilder.CreateSphere("belly", {
    diameterX: 1.0, diameterY: 0.85, diameterZ: 0.9, segments: 16
  }, scene);
  belly.position = new BABYLON.Vector3(0, 0.5, 0.2);
  belly.parent = hamster;
  belly.material = bellyMat;

  // Butt (rounder back)
  const butt = BABYLON.MeshBuilder.CreateSphere("butt", {
    diameterX: 1.1, diameterY: 0.9, diameterZ: 0.8, segments: 16
  }, scene);
  butt.position = new BABYLON.Vector3(0, 0.55, -0.45);
  butt.parent = hamster;
  butt.material = furMat;

  // === HEAD === (big round head, hamsters have big heads)
  const head = BABYLON.MeshBuilder.CreateSphere("head", {
    diameterX: 1.0, diameterY: 0.9, diameterZ: 0.95, segments: 24
  }, scene);
  head.position = new BABYLON.Vector3(0, 0.95, 0.45);
  head.parent = hamster;
  head.material = furMat;
  shadowGen.addShadowCaster(head);

  // Snout (slightly protruding)
  const snout = BABYLON.MeshBuilder.CreateSphere("snout", {
    diameterX: 0.45, diameterY: 0.35, diameterZ: 0.3, segments: 16
  }, scene);
  snout.position = new BABYLON.Vector3(0, 0.85, 0.85);
  snout.parent = hamster;
  snout.material = bellyMat;

  // === EARS === (round, cute)
  for (const side of [-1, 1]) {
    // Outer ear
    const earOuter = BABYLON.MeshBuilder.CreateSphere("earOuter" + side, {
      diameterX: 0.3, diameterY: 0.35, diameterZ: 0.12, segments: 16
    }, scene);
    earOuter.position = new BABYLON.Vector3(side * 0.38, 1.35, 0.3);
    earOuter.rotation.z = side * 0.3;
    earOuter.parent = hamster;
    earOuter.material = furMat;

    // Inner ear (pink)
    const earInner = BABYLON.MeshBuilder.CreateSphere("earInner" + side, {
      diameterX: 0.18, diameterY: 0.22, diameterZ: 0.06, segments: 12
    }, scene);
    earInner.position = new BABYLON.Vector3(side * 0.38, 1.35, 0.33);
    earInner.rotation.z = side * 0.3;
    earInner.parent = hamster;
    earInner.material = earMat;
  }

  // === EYES === (big, shiny, round - key to cuteness)
  const eyeMat = new BABYLON.StandardMaterial("eyeMat", scene);
  eyeMat.diffuseColor = new BABYLON.Color3(0.02, 0.02, 0.02);
  eyeMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  eyeMat.specularPower = 64;

  const shineMat = new BABYLON.StandardMaterial("shineMat", scene);
  shineMat.diffuseColor = new BABYLON.Color3(1, 1, 1);
  shineMat.emissiveColor = new BABYLON.Color3(0.9, 0.9, 0.9);

  for (const side of [-1, 1]) {
    // Eye (bigger = cuter)
    const eye = BABYLON.MeshBuilder.CreateSphere("eye" + side, { diameter: 0.18, segments: 16 }, scene);
    eye.position = new BABYLON.Vector3(side * 0.22, 1.0, 0.8);
    eye.parent = hamster;
    eye.material = eyeMat;

    // Big highlight
    const shine1 = BABYLON.MeshBuilder.CreateSphere("shine1_" + side, { diameter: 0.07 }, scene);
    shine1.position = new BABYLON.Vector3(side * 0.2, 1.04, 0.88);
    shine1.parent = hamster;
    shine1.material = shineMat;

    // Small highlight
    const shine2 = BABYLON.MeshBuilder.CreateSphere("shine2_" + side, { diameter: 0.04 }, scene);
    shine2.position = new BABYLON.Vector3(side * 0.24, 0.97, 0.87);
    shine2.parent = hamster;
    shine2.material = shineMat;
  }

  // === NOSE === (tiny pink triangle shape)
  const nose = BABYLON.MeshBuilder.CreateSphere("nose", {
    diameterX: 0.1, diameterY: 0.07, diameterZ: 0.07, segments: 12
  }, scene);
  nose.position = new BABYLON.Vector3(0, 0.9, 0.97);
  nose.parent = hamster;
  const noseMat = new BABYLON.StandardMaterial("noseMat", scene);
  noseMat.diffuseColor = new BABYLON.Color3(0.95, 0.55, 0.55);
  nose.material = noseMat;

  // === CHEEKS === (hamster's signature puffy cheeks)
  const cheekMat = new BABYLON.StandardMaterial("cheekMat", scene);
  cheekMat.diffuseColor = new BABYLON.Color3(0.88, 0.68, 0.48);
  cheekMat.specularColor = new BABYLON.Color3(0.08, 0.06, 0.04);

  for (const side of [-1, 1]) {
    const cheek = BABYLON.MeshBuilder.CreateSphere("cheek", {
      diameterX: 0.45, diameterY: 0.35, diameterZ: 0.4, segments: 16
    }, scene);
    cheek.position = new BABYLON.Vector3(side * 0.38, 0.82, 0.55);
    cheek.parent = hamster;
    cheek.material = cheekMat;
  }

  // === WHISKERS === (thin cylinders)
  const whiskerMat = new BABYLON.StandardMaterial("whiskerMat", scene);
  whiskerMat.diffuseColor = new BABYLON.Color3(0.85, 0.8, 0.75);
  whiskerMat.alpha = 0.5;

  for (const side of [-1, 1]) {
    for (const angle of [-0.15, 0, 0.15]) {
      const whisker = BABYLON.MeshBuilder.CreateCylinder("whisker", {
        height: 0.5, diameter: 0.01, tessellation: 6
      }, scene);
      whisker.position = new BABYLON.Vector3(side * 0.35, 0.88 + angle * 0.5, 0.8);
      whisker.rotation.z = side * (Math.PI / 2 + angle);
      whisker.rotation.y = angle * 2;
      whisker.parent = hamster;
      whisker.material = whiskerMat;
    }
  }

  // === PAWS === (little round feet)
  const pawMat = new BABYLON.StandardMaterial("pawMat", scene);
  pawMat.diffuseColor = new BABYLON.Color3(0.92, 0.78, 0.62);

  // Front paws
  for (const side of [-1, 1]) {
    const paw = BABYLON.MeshBuilder.CreateSphere("frontPaw" + side, {
      diameterX: 0.2, diameterY: 0.1, diameterZ: 0.22, segments: 12
    }, scene);
    paw.position = new BABYLON.Vector3(side * 0.35, 0.1, 0.45);
    paw.parent = hamster;
    paw.material = pawMat;
  }

  // Back paws (bigger)
  for (const side of [-1, 1]) {
    const paw = BABYLON.MeshBuilder.CreateSphere("backPaw" + side, {
      diameterX: 0.25, diameterY: 0.1, diameterZ: 0.3, segments: 12
    }, scene);
    paw.position = new BABYLON.Vector3(side * 0.4, 0.1, -0.25);
    paw.parent = hamster;
    paw.material = pawMat;
  }

  // === TAIL === (tiny stub)
  const tail = BABYLON.MeshBuilder.CreateSphere("tail", { diameter: 0.12, segments: 8 }, scene);
  tail.position = new BABYLON.Vector3(0, 0.45, -0.65);
  tail.parent = hamster;
  tail.material = furMat;

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

export function createToyBall(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const ball = BABYLON.MeshBuilder.CreateSphere("toyBall", { diameter: 0.5, segments: 16 }, scene);
  ball.position.y = 0.25;
  const ballMat = new BABYLON.StandardMaterial("ballMat", scene);
  ballMat.diffuseColor = new BABYLON.Color3(0.9, 0.2, 0.2);
  ballMat.specularColor = new BABYLON.Color3(0.6, 0.3, 0.3);
  ball.material = ballMat;
  shadowGen.addShadowCaster(ball);
  return ball;
}

export function createHamsterBall(scene: BABYLON.Scene, shadowGen: BABYLON.ShadowGenerator) {
  const group = new BABYLON.TransformNode("hamsterBallGroup", scene);

  const sphere = BABYLON.MeshBuilder.CreateSphere("hamBall", { diameter: 1.2, segments: 24 }, scene);
  sphere.position.y = 0.6;
  sphere.parent = group;
  const sphereMat = new BABYLON.StandardMaterial("hamBallMat", scene);
  sphereMat.diffuseColor = new BABYLON.Color3(0.9, 0.9, 1);
  sphereMat.alpha = 0.3;
  sphereMat.specularColor = new BABYLON.Color3(0.8, 0.8, 0.8);
  sphereMat.specularPower = 64;
  sphere.material = sphereMat;
  shadowGen.addShadowCaster(sphere);

  return group;
}
