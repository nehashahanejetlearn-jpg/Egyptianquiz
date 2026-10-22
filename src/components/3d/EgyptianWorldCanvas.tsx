import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { LocationId } from '../../types/game';
import { sound } from '../../utils/audio';
import { Eye, Compass, ZoomIn, ZoomOut, RotateCcw, Sparkles } from 'lucide-react';

interface EgyptianWorldCanvasProps {
  activeLocation: LocationId | null;
  onSelectLocation: (id: LocationId) => void;
  scannerMode: boolean;
  unlockedLocations: LocationId[];
}

export const EgyptianWorldCanvas: React.FC<EgyptianWorldCanvasProps> = ({
  activeLocation,
  onSelectLocation,
  scannerMode,
  unlockedLocations,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);
  const [cameraView, setCameraView] = useState<'overview' | 'monument' | 'cinematic'>('overview');
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Mutable refs for Three.js lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 35, 65));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 4, 0));
  const interactiveObjects = useRef<THREE.Object3D[]>([]);
  const scarabCompanion = useRef<THREE.Group | null>(null);
  const waterMesh = useRef<THREE.Mesh | null>(null);
  const particles = useRef<THREE.Points | null>(null);

  // Map landmark IDs to camera targets
  const locationCameraTargets: Record<LocationId, { pos: THREE.Vector3; lookAt: THREE.Vector3; name: string }> = {
    desert: {
      pos: new THREE.Vector3(-35, 12, 28),
      lookAt: new THREE.Vector3(-30, 2, 10),
      name: 'Desert of Discovery & Relic Site',
    },
    pyramid: {
      pos: new THREE.Vector3(-5, 22, 28),
      lookAt: new THREE.Vector3(-5, 14, -10),
      name: 'The Great Pyramid of Giza',
    },
    hieroglyphs: {
      pos: new THREE.Vector3(28, 16, 22),
      lookAt: new THREE.Vector3(26, 6, 0),
      name: 'The Temple of Sacred Hieroglyphs',
    },
    tomb: {
      pos: new THREE.Vector3(-18, 10, 42),
      lookAt: new THREE.Vector3(-18, 1, 28),
      name: 'The Subterranean Lost Tomb',
    },
    nile: {
      pos: new THREE.Vector3(45, 18, 15),
      lookAt: new THREE.Vector3(40, 2, -20),
      name: 'The River Nile & Delta Farmlands',
    },
    chamber: {
      pos: new THREE.Vector3(0, 18, -12),
      lookAt: new THREE.Vector3(0, 8, -30),
      name: 'The Pharaoh\'s Final Celestial Chamber',
    },
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL as per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // Initialize Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1510); // Warm desert dusk
    scene.fog = new THREE.FogExp2(0x1a1510, 0.008);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.5,
      1000
    );
    camera.position.set(0, 35, 65);
    cameraRef.current = camera;

    // Studio Environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3-Point Lighting Rig
    const sunLight = new THREE.DirectionalLight(0xfff1cf, 2.8);
    sunLight.position.set(45, 60, 35);
    sunLight.castShadow = !isSoftwareGl;
    if (!isSoftwareGl) {
      sunLight.shadow.mapSize.width = 2048;
      sunLight.shadow.mapSize.height = 2048;
      sunLight.shadow.camera.near = 0.5;
      sunLight.shadow.camera.far = 180;
      sunLight.shadow.camera.left = -60;
      sunLight.shadow.camera.right = 60;
      sunLight.shadow.camera.top = 60;
      sunLight.shadow.camera.bottom = -60;
      sunLight.shadow.bias = -0.0005;
      sunLight.shadow.normalBias = 0.02;
    }
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0xd97706, 0.85); // Cool sky against warm sand
    scene.add(hemiLight);

    // Procedural Sand Ripple Ground
    const groundGeo = new THREE.PlaneGeometry(260, 260, 64, 64);
    // Displace vertices gently to form natural rolling dunes
    const posAttr = groundGeo.attributes.position;
    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vy = posAttr.getY(i);
      const dune = Math.sin(vx * 0.04) * Math.cos(vy * 0.03) * 3.2 + Math.sin(vy * 0.06) * 1.5;
      posAttr.setZ(i, dune);
    }
    groundGeo.computeVertexNormals();

    const sandMat = new THREE.MeshStandardMaterial({
      color: 0xcd9a5b,
      roughness: 0.9,
      metalness: 0.05,
      flatShading: true,
    });
    const groundMesh = new THREE.Mesh(groundGeo, sandMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = !isSoftwareGl;
    scene.add(groundMesh);

    // ==========================================
    // PROCEDURAL MODEL 1: THE GREAT PYRAMID (Composite 3-12 parts)
    // ==========================================
    const pyramidGroup = new THREE.Group();
    pyramidGroup.name = 'pyramid';
    pyramidGroup.position.set(-8, 0, -12);

    // Tier 1 Base
    const baseGeo = new THREE.CylinderGeometry(22, 28, 9, 4);
    const stoneMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.82,
      metalness: 0.1,
      flatShading: true,
    });
    const baseMesh = new THREE.Mesh(baseGeo, stoneMat);
    baseMesh.position.y = 4.5;
    baseMesh.rotation.y = Math.PI / 4;
    baseMesh.castShadow = !isSoftwareGl;
    baseMesh.receiveShadow = !isSoftwareGl;
    pyramidGroup.add(baseMesh);

    // Tier 2 Mid
    const midGeo = new THREE.CylinderGeometry(14, 21, 9, 4);
    const midMesh = new THREE.Mesh(midGeo, stoneMat);
    midMesh.position.y = 13.5;
    midMesh.rotation.y = Math.PI / 4;
    midMesh.castShadow = !isSoftwareGl;
    midMesh.receiveShadow = !isSoftwareGl;
    pyramidGroup.add(midMesh);

    // Tier 3 High
    const highGeo = new THREE.CylinderGeometry(6, 13, 8, 4);
    const highMesh = new THREE.Mesh(highGeo, stoneMat);
    highMesh.position.y = 21.5;
    highMesh.rotation.y = Math.PI / 4;
    highMesh.castShadow = !isSoftwareGl;
    highMesh.receiveShadow = !isSoftwareGl;
    pyramidGroup.add(highMesh);

    // Tier 4 Capstone: Golden Pyramidion
    const capGeo = new THREE.ConeGeometry(8.5, 7.5, 4);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.9,
      roughness: 0.18,
      emissive: 0x996515,
      emissiveIntensity: 0.25,
    });
    const capMesh = new THREE.Mesh(capGeo, goldMat);
    capMesh.position.y = 28.5;
    capMesh.rotation.y = Math.PI / 4;
    capMesh.castShadow = !isSoftwareGl;
    pyramidGroup.add(capMesh);

    // Grand Entrance Archway
    const entryGeo = new THREE.BoxGeometry(4, 5, 6);
    const darkStoneMat = new THREE.MeshStandardMaterial({ color: 0x2c1f14, roughness: 0.95 });
    const entryMesh = new THREE.Mesh(entryGeo, darkStoneMat);
    entryMesh.position.set(0, 2.5, 16);
    pyramidGroup.add(entryMesh);

    // Holographic Energy Beam from Capstone
    const beamGeo = new THREE.CylinderGeometry(0.2, 1.2, 45, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide,
    });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.y = 50;
    pyramidGroup.add(beamMesh);

    scene.add(pyramidGroup);
    interactiveObjects.current.push(pyramidGroup);

    // ==========================================
    // PROCEDURAL MODEL 2: THE GREAT SPHINX
    // ==========================================
    const sphinxGroup = new THREE.Group();
    sphinxGroup.name = 'desert';
    sphinxGroup.position.set(-28, 0, 12);
    sphinxGroup.rotation.y = Math.PI / 3;

    // Body
    const sBodyGeo = new THREE.BoxGeometry(10, 5, 18);
    const sBody = new THREE.Mesh(sBodyGeo, stoneMat);
    sBody.position.y = 2.5;
    sBody.castShadow = !isSoftwareGl;
    sphinxGroup.add(sBody);

    // Paws (left & right)
    const pawGeo = new THREE.BoxGeometry(2.5, 2, 7);
    const pawLeft = new THREE.Mesh(pawGeo, stoneMat);
    pawLeft.position.set(-3, 1, 10);
    const pawRight = new THREE.Mesh(pawGeo, stoneMat);
    pawRight.position.set(3, 1, 10);
    sphinxGroup.add(pawLeft);
    sphinxGroup.add(pawRight);

    // Head with Royal Headdress (Nemes)
    const sHeadGeo = new THREE.BoxGeometry(4.2, 4.8, 4.5);
    const sHead = new THREE.Mesh(sHeadGeo, stoneMat);
    sHead.position.set(0, 6.8, 6.5);
    sphinxGroup.add(sHead);

    const headdressGeo = new THREE.CylinderGeometry(3.5, 4.8, 3, 4);
    const nemesMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      metalness: 0.5,
      roughness: 0.4,
    });
    const headdress = new THREE.Mesh(headdressGeo, nemesMat);
    headdress.position.set(0, 8.5, 6.5);
    headdress.rotation.y = Math.PI / 4;
    sphinxGroup.add(headdress);

    // Relic Pedestal & Floating Eye of Ra
    const pedGeo = new THREE.CylinderGeometry(1.5, 2, 2.5, 8);
    const pedMesh = new THREE.Mesh(pedGeo, darkStoneMat);
    pedMesh.position.set(0, 1.25, 16);
    sphinxGroup.add(pedMesh);

    const eyeOrbGeo = new THREE.SphereGeometry(1, 24, 24);
    const eyeOrbMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.8,
      roughness: 0.1,
      emissive: 0x0891b2,
      emissiveIntensity: 0.6,
    });
    const eyeOrb = new THREE.Mesh(eyeOrbGeo, eyeOrbMat);
    eyeOrb.position.set(0, 3.5, 16);
    sphinxGroup.add(eyeOrb);

    scene.add(sphinxGroup);
    interactiveObjects.current.push(sphinxGroup);

    // ==========================================
    // PROCEDURAL MODEL 3: THE TEMPLE OF HIEROGLYPHS
    // ==========================================
    const templeGroup = new THREE.Group();
    templeGroup.name = 'hieroglyphs';
    templeGroup.position.set(24, 0, 2);

    // Pylon Gateway (Two sloping towers)
    const pylonGeo = new THREE.BoxGeometry(6, 14, 4);
    const pylonL = new THREE.Mesh(pylonGeo, stoneMat);
    pylonL.position.set(-7, 7, 0);
    const pylonR = new THREE.Mesh(pylonGeo, stoneMat);
    pylonR.position.set(7, 7, 0);
    pylonL.castShadow = !isSoftwareGl;
    pylonR.castShadow = !isSoftwareGl;
    templeGroup.add(pylonL);
    templeGroup.add(pylonR);

    // Lintel connecting pylons
    const lintelGeo = new THREE.BoxGeometry(20, 2.5, 4.5);
    const lintel = new THREE.Mesh(lintelGeo, stoneMat);
    lintel.position.set(0, 13.5, 0);
    lintel.castShadow = !isSoftwareGl;
    templeGroup.add(lintel);

    // Row of 6 Lotus Columns
    const colGeo = new THREE.CylinderGeometry(0.9, 1.1, 10, 12);
    const capGeoLotus = new THREE.CylinderGeometry(1.5, 0.9, 1.8, 12);
    for (let c = 0; c < 6; c++) {
      const zOffset = -5 - c * 3.5;
      const xOffset = c % 2 === 0 ? -4 : 4;
      const col = new THREE.Mesh(colGeo, stoneMat);
      col.position.set(xOffset, 5, zOffset);
      const cap = new THREE.Mesh(capGeoLotus, goldMat);
      cap.position.set(xOffset, 10.4, zOffset);
      templeGroup.add(col);
      templeGroup.add(cap);
    }

    // Two colossal Anubis Statues in front
    const anubisGeo = new THREE.BoxGeometry(1.8, 7.5, 2.5);
    const anubisMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.35,
      metalness: 0.65,
    });
    const anubisL = new THREE.Mesh(anubisGeo, anubisMat);
    anubisL.position.set(-6, 3.75, 4);
    const anubisR = new THREE.Mesh(anubisGeo, anubisMat);
    anubisR.position.set(6, 3.75, 4);
    templeGroup.add(anubisL);
    templeGroup.add(anubisR);

    // Glowing Hieroglyphic Wall inside
    const glyphWallGeo = new THREE.PlaneGeometry(10, 8);
    const glyphWallMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.6,
    });
    const glyphWall = new THREE.Mesh(glyphWallGeo, glyphWallMat);
    glyphWall.position.set(0, 5, -18);
    templeGroup.add(glyphWall);

    scene.add(templeGroup);
    interactiveObjects.current.push(templeGroup);

    // ==========================================
    // PROCEDURAL MODEL 4: THE LOST TOMB OF ANUBIS
    // ==========================================
    const tombGroup = new THREE.Group();
    tombGroup.name = 'tomb';
    tombGroup.position.set(-16, 0, 32);

    // Sunken Stone Steps leading down
    const pitGeo = new THREE.BoxGeometry(12, 4, 16);
    const pit = new THREE.Mesh(pitGeo, darkStoneMat);
    pit.position.y = -1.5;
    tombGroup.add(pit);

    // Stone Portal
    const tombArchGeo = new THREE.BoxGeometry(8, 6, 2);
    const tombArch = new THREE.Mesh(tombArchGeo, stoneMat);
    tombArch.position.set(0, 3, -6);
    tombGroup.add(tombArch);

    // Golden Sarcophagus preview inside
    const sarcGeo = new THREE.BoxGeometry(2.5, 1.8, 6.5);
    const sarcMesh = new THREE.Mesh(sarcGeo, goldMat);
    sarcMesh.position.set(0, 0.8, -4);
    tombGroup.add(sarcMesh);

    // Flickering Fire Braziers (Warm point lights)
    const firePoint1 = new THREE.PointLight(0xff7700, 2.5, 14);
    firePoint1.position.set(-4, 2.5, -3);
    tombGroup.add(firePoint1);
    const firePoint2 = new THREE.PointLight(0xff7700, 2.5, 14);
    firePoint2.position.set(4, 2.5, -3);
    tombGroup.add(firePoint2);

    const brazierStandGeo = new THREE.CylinderGeometry(0.8, 0.5, 2, 8);
    const bStand1 = new THREE.Mesh(brazierStandGeo, darkStoneMat);
    bStand1.position.set(-4, 1, -3);
    const bStand2 = new THREE.Mesh(brazierStandGeo, darkStoneMat);
    bStand2.position.set(4, 1, -3);
    tombGroup.add(bStand1);
    tombGroup.add(bStand2);

    scene.add(tombGroup);
    interactiveObjects.current.push(tombGroup);

    // ==========================================
    // PROCEDURAL MODEL 5: THE NILE RIVER & DELTA
    // ==========================================
    const nileGroup = new THREE.Group();
    nileGroup.name = 'nile';
    nileGroup.position.set(48, 0, -10);

    // River Water Strip
    const waterGeo = new THREE.PlaneGeometry(36, 120, 32, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.15,
      metalness: 0.45,
      transparent: true,
      opacity: 0.88,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, 0.2, 0);
    waterMesh.current = water;
    nileGroup.add(water);

    // Traditional Egyptian Felucca Sailboat
    const boatGroup = new THREE.Group();
    boatGroup.position.set(-2, 0.4, 10);
    // Hull
    const hullGeo = new THREE.CylinderGeometry(1.2, 0.6, 6, 8);
    const woodMat = new THREE.MeshStandardMaterial({ color: 0x854d0e, roughness: 0.7 });
    const hull = new THREE.Mesh(hullGeo, woodMat);
    hull.rotation.z = Math.PI / 2;
    hull.scale.set(1, 0.5, 1.8);
    boatGroup.add(hull);

    // Mast & Triangular Lateen Sail
    const mastGeo = new THREE.CylinderGeometry(0.08, 0.1, 7, 8);
    const mast = new THREE.Mesh(mastGeo, woodMat);
    mast.position.y = 3.5;
    boatGroup.add(mast);

    const sailGeo = new THREE.BufferGeometry();
    const sailVertices = new Float32Array([
      0, 6.5, 0,
      0, 1.2, 0,
      3.2, 2.5, 1.2,
    ]);
    sailGeo.setAttribute('position', new THREE.BufferAttribute(sailVertices, 3));
    sailGeo.computeVertexNormals();
    const sailMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      side: THREE.DoubleSide,
      roughness: 0.6,
    });
    const sail = new THREE.Mesh(sailGeo, sailMat);
    boatGroup.add(sail);
    nileGroup.add(boatGroup);

    // Procedural Palm Trees along riverbank
    const trunkGeo = new THREE.CylinderGeometry(0.3, 0.5, 6, 6);
    const frondGeo = new THREE.ConeGeometry(3.5, 2, 7);
    const palmMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

    for (let p = 0; p < 8; p++) {
      const palm = new THREE.Group();
      const trunk = new THREE.Mesh(trunkGeo, woodMat);
      trunk.position.y = 3;
      const fronds = new THREE.Mesh(frondGeo, palmMat);
      fronds.position.y = 6;
      palm.add(trunk);
      palm.add(fronds);

      const xPos = p % 2 === 0 ? -14 : -10;
      const zPos = -30 + p * 12;
      palm.position.set(xPos, 0, zPos);
      nileGroup.add(palm);
    }

    scene.add(nileGroup);
    interactiveObjects.current.push(nileGroup);

    // ==========================================
    // PROCEDURAL MODEL 6: PHARAOH'S CELESTIAL CHAMBER
    // ==========================================
    const chamberGroup = new THREE.Group();
    chamberGroup.name = 'chamber';
    chamberGroup.position.set(0, 0, -42);

    // Monumental Obsidian Obelisk Sanctuary
    const obeliskGeo = new THREE.CylinderGeometry(0.8, 1.8, 16, 4);
    const obsidianMat = new THREE.MeshStandardMaterial({
      color: 0x09090b,
      metalness: 0.85,
      roughness: 0.15,
    });
    const obelisk1 = new THREE.Mesh(obeliskGeo, obsidianMat);
    obelisk1.position.set(-8, 8, 0);
    const obelisk2 = new THREE.Mesh(obeliskGeo, obsidianMat);
    obelisk2.position.set(8, 8, 0);
    chamberGroup.add(obelisk1);
    chamberGroup.add(obelisk2);

    // Golden Sun Disc Gateway
    const discGeo = new THREE.TorusGeometry(5, 0.4, 16, 32);
    const disc = new THREE.Mesh(discGeo, goldMat);
    disc.position.set(0, 8, 0);
    chamberGroup.add(disc);

    // Holographic Star Alignment Core
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: true,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.position.set(0, 8, 0);
    chamberGroup.add(core);

    scene.add(chamberGroup);
    interactiveObjects.current.push(chamberGroup);

    // ==========================================
    // PROCEDURAL MODEL 7: KHEPRI - ROBOTIC SCARAB DRONE
    // ==========================================
    const scarabGroup = new THREE.Group();
    // Shell body
    const scarabBodyGeo = new THREE.SphereGeometry(0.7, 16, 16);
    scarabBodyGeo.scale(1, 0.5, 1.3);
    const scarabBody = new THREE.Mesh(scarabBodyGeo, goldMat);
    scarabGroup.add(scarabBody);

    // Carapace wings
    const wingGeo = new THREE.BoxGeometry(0.8, 0.05, 1.1);
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    });
    const wingL = new THREE.Mesh(wingGeo, wingMat);
    wingL.position.set(-0.55, 0.2, 0);
    wingL.rotation.z = 0.2;
    const wingR = new THREE.Mesh(wingGeo, wingMat);
    wingR.position.set(0.55, 0.2, 0);
    wingR.rotation.z = -0.2;
    scarabGroup.add(wingL);
    scarabGroup.add(wingR);

    // Eye sensor light
    const sensorLight = new THREE.PointLight(0x06b6d4, 1.8, 6);
    sensorLight.position.set(0, 0.2, 0.8);
    scarabGroup.add(sensorLight);

    scarabGroup.position.set(-8, 14, 10);
    scarabCompanion.current = scarabGroup;
    scene.add(scarabGroup);

    // ==========================================
    // FLOATING ATMOSPHERIC DESERT PARTICLES
    // ==========================================
    const pCount = isSoftwareGl ? 200 : 700;
    const pGeo = new THREE.BufferGeometry();
    const pPositions = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 180;
      pPositions[i * 3 + 1] = Math.random() * 45;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 180;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.35,
      transparent: true,
      opacity: 0.5,
    });
    const pSystem = new THREE.Points(pGeo, pMat);
    particles.current = pSystem;
    scene.add(pSystem);

    // ==========================================
    // RAYCASTER & INTERACTION
    // ==========================================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects.current, true);

      if (intersects.length > 0) {
        let rootGroup: THREE.Object3D | null = intersects[0].object;
        while (rootGroup && rootGroup.parent && rootGroup.parent !== scene) {
          rootGroup = rootGroup.parent;
        }
        if (rootGroup && rootGroup.name) {
          container.style.cursor = 'pointer';
          setHoveredLandmark(rootGroup.name);
          return;
        }
      }
      container.style.cursor = 'grab';
      setHoveredLandmark(null);
    };

    const handleClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects.current, true);

      if (intersects.length > 0) {
        let rootGroup: THREE.Object3D | null = intersects[0].object;
        while (rootGroup && rootGroup.parent && rootGroup.parent !== scene) {
          rootGroup = rootGroup.parent;
        }
        if (rootGroup && rootGroup.name) {
          const locId = rootGroup.name as LocationId;
          sound.playClick();
          onSelectLocation(locId);
        }
      }
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('click', handleClick);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // RENDER LOOP WITH DAMPING & SOFTWARE GL SYNC
    // ==========================================
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      // Camera smooth exponential damping to target position and lookAt
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 3.5, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 3.5, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 3.5, delta);

      currentLookAt.current.x = THREE.MathUtils.damp(currentLookAt.current.x, targetLookAt.current.x, 4.0, delta);
      currentLookAt.current.y = THREE.MathUtils.damp(currentLookAt.current.y, targetLookAt.current.y, 4.0, delta);
      currentLookAt.current.z = THREE.MathUtils.damp(currentLookAt.current.z, targetLookAt.current.z, 4.0, delta);
      camera.lookAt(currentLookAt.current);

      // Animate Khepri companion (hovering sinus motion)
      if (scarabCompanion.current) {
        const targetScarabY = currentLookAt.current.y + 4 + Math.sin(elapsed * 2.8) * 0.6;
        scarabCompanion.current.position.y = THREE.MathUtils.damp(scarabCompanion.current.position.y, targetScarabY, 4, delta);
        scarabCompanion.current.position.x = THREE.MathUtils.damp(scarabCompanion.current.position.x, currentLookAt.current.x + 3.5, 3, delta);
        scarabCompanion.current.position.z = THREE.MathUtils.damp(scarabCompanion.current.position.z, currentLookAt.current.z + 4.5, 3, delta);
        scarabCompanion.current.rotation.y = elapsed * 0.8;
      }

      // Animate floating dust particles
      if (particles.current) {
        particles.current.rotation.y = elapsed * 0.02;
      }

      // Animate water subtle wave texture if present
      if (waterMesh.current) {
        waterMesh.current.position.y = 0.2 + Math.sin(elapsed * 1.5) * 0.04;
      }

      // Animate torch brazier light intensities
      firePoint1.intensity = 2.2 + Math.sin(elapsed * 12) * 0.5;
      firePoint2.intensity = 2.2 + Math.cos(elapsed * 10) * 0.5;

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('click', handleClick);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update target camera positions when activeLocation changes
  useEffect(() => {
    if (activeLocation && locationCameraTargets[activeLocation]) {
      const target = locationCameraTargets[activeLocation];
      targetCamPos.current.copy(target.pos);
      targetLookAt.current.copy(target.lookAt);
      setCameraView('monument');
    } else {
      targetCamPos.current.set(0, 35, 65);
      targetLookAt.current.set(0, 4, 0);
      setCameraView('overview');
    }
  }, [activeLocation]);

  const handleResetCamera = () => {
    sound.playClick();
    targetCamPos.current.set(0, 35, 65);
    targetLookAt.current.set(0, 4, 0);
    setCameraView('overview');
  };

  const handleZoom = (inwards: boolean) => {
    sound.playClick();
    const factor = inwards ? 0.75 : 1.35;
    targetCamPos.current.multiplyScalar(factor);
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Holographic Archaeological Scanner Overlay Grid (when active) */}
      {scannerMode && (
        <div className="absolute inset-0 scanline-overlay pointer-events-none">
          {/* Futuristic HUD crosshair and telemetry */}
          <div className="absolute top-6 left-6 font-tech text-xs text-cyan-400 bg-black/60 px-3 py-2 border border-cyan-500/40 rounded flex flex-col gap-1 backdrop-blur-none">
            <span className="flex items-center gap-1.5 text-cyan-300 font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Ground Radar Lidar Active
            </span>
            <span>Freq: 1420.4 MHz • Density: 2.84 g/cm³</span>
            <span>Sub-surface Anomaly Scan: LOCKED</span>
          </div>

          {/* Golden Center Target Reticle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-400/30 rounded-full pointer-events-none flex items-center justify-center">
            <div className="w-2 h-2 bg-cyan-400 rounded-full" />
            <div className="absolute w-full h-0.5 bg-cyan-500/20" />
            <div className="absolute h-full w-0.5 bg-cyan-500/20" />
          </div>
        </div>
      )}

      {/* Hovered Landmark Floating Spec Badge (Top-Center) */}
      {hoveredLandmark && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/85 border border-amber-500/60 text-amber-200 px-5 py-2.5 rounded-lg shadow-xl font-tech tracking-wide flex items-center gap-3 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
          <Eye className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-xs uppercase text-amber-400/80 font-bold">Landmark Detected</div>
            <div className="text-base font-egyptian font-bold text-amber-100">
              {locationCameraTargets[hoveredLandmark as LocationId]?.name || hoveredLandmark}
            </div>
          </div>
          <span className="text-[10px] uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
            Click to Enter
          </span>
        </div>
      )}

      {/* Unified Bottom Control Dock (Following Three.js Skill Directives) */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 transition-all duration-300 ${
          isCinemaMode ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="flex items-center gap-2 bg-[#12141a]/95 border border-amber-500/40 rounded-xl px-4 py-2.5 shadow-2xl text-xs font-tech text-amber-200">
          <span className="font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mr-2">
            <Compass className="w-4 h-4" /> 3D Viewport
          </span>

          {/* Quick Monument Jump Buttons */}
          <div className="flex items-center gap-1 border-r border-amber-500/30 pr-3 mr-1">
            <button
              onClick={() => onSelectLocation('pyramid')}
              className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-800/80 border border-amber-600/40 text-amber-300 transition-colors"
            >
              Pyramid
            </button>
            <button
              onClick={() => onSelectLocation('hieroglyphs')}
              className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-800/80 border border-amber-600/40 text-amber-300 transition-colors"
            >
              Temple
            </button>
            <button
              onClick={() => onSelectLocation('tomb')}
              className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-800/80 border border-amber-600/40 text-amber-300 transition-colors"
            >
              Tomb
            </button>
            <button
              onClick={() => onSelectLocation('nile')}
              className="px-2.5 py-1 rounded bg-amber-950/60 hover:bg-amber-800/80 border border-amber-600/40 text-amber-300 transition-colors"
            >
              Nile River
            </button>
          </div>

          {/* Camera Controls */}
          <button
            onClick={() => handleZoom(true)}
            title="Zoom In"
            className="p-1.5 rounded hover:bg-amber-500/20 text-amber-300"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(false)}
            title="Zoom Out"
            className="p-1.5 rounded hover:bg-amber-500/20 text-amber-300"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetCamera}
            title="Reset to Overview"
            className="p-1.5 rounded hover:bg-amber-500/20 text-amber-300 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Cam</span>
          </button>
        </div>
      </div>

      {/* Collapsible Cinema / Zen Mode Toggle */}
      <button
        onClick={() => setIsCinemaMode(!isCinemaMode)}
        className="absolute bottom-2 right-4 z-20 text-[11px] font-tech text-amber-400/80 hover:text-amber-200 bg-black/60 px-3 py-1 rounded-md border border-amber-500/30"
      >
        {isCinemaMode ? '▴ Show Viewport Dock' : '▾ Hide Controls (H)'}
      </button>
    </div>
  );
};
