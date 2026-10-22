import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { sound } from '../../utils/audio';
import { RotateCw, ZoomIn, ZoomOut, Sparkles, X, Volume2, ShieldCheck } from 'lucide-react';

interface ArtifactInspector3DProps {
  artifactType: 'sarcophagus' | 'canopic' | 'rosetta' | 'ankh' | 'pyramid' | 'boat' | 'eye' | 'sphinx' | 'khopesh' | 'senet';
  title: string;
  era: string;
  summary: string;
  significance: string;
  audioTranscript?: string;
  onClose: () => void;
}

export const ArtifactInspector3D: React.FC<ArtifactInspector3DProps> = ({
  artifactType,
  title,
  era,
  summary,
  significance,
  audioTranscript,
  onClose,
}) => {
  const canvasMountRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const modelGroupRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  useEffect(() => {
    const container = canvasMountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 2, 7.5);
    cameraRef.current = camera;

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio lighting rig
    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.5);
    keyLight.position.set(5, 8, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    fillLight.position.set(-5, 2, -5);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Build procedural 3D model for this artifact
    const artifactGroup = new THREE.Group();
    modelGroupRef.current = artifactGroup;

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.95,
      roughness: 0.18,
    });
    const stoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.85,
      metalness: 0.1,
    });
    const alabasterMaterial = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.3,
      metalness: 0.15,
      transparent: true,
      opacity: 0.92,
    });

    switch (artifactType) {
      case 'sarcophagus': {
        // Pharaonic Golden Coffin
        const bodyGeo = new THREE.BoxGeometry(2.2, 5, 1.2);
        const bodyMesh = new THREE.Mesh(bodyGeo, goldMaterial);
        artifactGroup.add(bodyMesh);

        // Nemes Headdress Head
        const headGeo = new THREE.SphereGeometry(1, 16, 16);
        const headMesh = new THREE.Mesh(headGeo, goldMaterial);
        headMesh.position.set(0, 2.8, 0.3);
        artifactGroup.add(headMesh);

        // Crossed Crook & Flail
        const crookGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.2, 8);
        const crook = new THREE.Mesh(crookGeo, stoneMaterial);
        crook.position.set(0, 1.2, 0.7);
        crook.rotation.z = Math.PI / 4;
        const flail = new THREE.Mesh(crookGeo, stoneMaterial);
        flail.position.set(0, 1.2, 0.7);
        flail.rotation.z = -Math.PI / 4;
        artifactGroup.add(crook);
        artifactGroup.add(flail);
        break;
      }

      case 'canopic': {
        // Alabaster Jar
        const jarGeo = new THREE.CylinderGeometry(1.2, 0.9, 3.2, 24);
        const jar = new THREE.Mesh(jarGeo, alabasterMaterial);
        artifactGroup.add(jar);

        // Jackal Head Stopper (Duamutef)
        const headGeo = new THREE.ConeGeometry(0.9, 1.6, 16);
        const stopper = new THREE.Mesh(headGeo, alabasterMaterial);
        stopper.position.set(0, 2.4, 0);
        artifactGroup.add(stopper);

        // Hieroglyphic Inscription band
        const bandGeo = new THREE.TorusGeometry(1.22, 0.08, 8, 32);
        const band = new THREE.Mesh(bandGeo, goldMaterial);
        band.position.set(0, 0.5, 0);
        band.rotation.x = Math.PI / 2;
        artifactGroup.add(band);
        break;
      }

      case 'rosetta': {
        // Dark Granodiorite Stele Tablet
        const slabGeo = new THREE.BoxGeometry(2.8, 4.2, 0.4);
        const slab = new THREE.Mesh(slabGeo, stoneMaterial);
        artifactGroup.add(slab);

        // 3 bands of inscription lines
        for (let b = 0; b < 12; b++) {
          const lineGeo = new THREE.BoxGeometry(2.3, 0.04, 0.42);
          const lineMat = new THREE.MeshBasicMaterial({ color: 0x94a3b8 });
          const line = new THREE.Mesh(lineGeo, lineMat);
          line.position.set(0, 1.5 - b * 0.28, 0);
          artifactGroup.add(line);
        }
        break;
      }

      case 'ankh': {
        // Golden Key of Life
        const stemGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.8, 16);
        const stem = new THREE.Mesh(stemGeo, goldMaterial);
        stem.position.y = -0.5;
        artifactGroup.add(stem);

        const crossGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 16);
        const cross = new THREE.Mesh(crossGeo, goldMaterial);
        cross.rotation.z = Math.PI / 2;
        cross.position.y = 0.5;
        artifactGroup.add(cross);

        const loopGeo = new THREE.TorusGeometry(0.9, 0.18, 16, 32);
        const loop = new THREE.Mesh(loopGeo, goldMaterial);
        loop.position.y = 1.6;
        artifactGroup.add(loop);
        break;
      }

      case 'pyramid': {
        // Gilded Pyramidion Capstone
        const pyrGeo = new THREE.ConeGeometry(2.6, 3.4, 4);
        const pyr = new THREE.Mesh(pyrGeo, goldMaterial);
        pyr.rotation.y = Math.PI / 4;
        artifactGroup.add(pyr);
        break;
      }

      case 'boat': {
        // Papyrus Solar Barge
        const hullGeo = new THREE.CylinderGeometry(0.6, 0.2, 5, 8);
        const boatMat = new THREE.MeshStandardMaterial({ color: 0xca8a04, roughness: 0.7 });
        const boatHull = new THREE.Mesh(hullGeo, boatMat);
        boatHull.rotation.z = Math.PI / 2;
        artifactGroup.add(boatHull);

        const mastGeo = new THREE.CylinderGeometry(0.08, 0.08, 3, 8);
        const mast = new THREE.Mesh(mastGeo, boatMat);
        mast.position.y = 1.5;
        artifactGroup.add(mast);
        break;
      }

      case 'eye': {
        // Eye of Horus (Wedjat)
        const eyeFrameGeo = new THREE.TorusGeometry(1.6, 0.2, 16, 32);
        const eyeFrame = new THREE.Mesh(eyeFrameGeo, goldMaterial);
        artifactGroup.add(eyeFrame);

        const pupilGeo = new THREE.SphereGeometry(0.6, 16, 16);
        const pupilMat = new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.1, metalness: 0.8 });
        const pupil = new THREE.Mesh(pupilGeo, pupilMat);
        artifactGroup.add(pupil);
        break;
      }

      default: {
        // Pharaonic Relic Core
        const defaultGeo = new THREE.DodecahedronGeometry(1.8);
        const defaultMesh = new THREE.Mesh(defaultGeo, goldMaterial);
        artifactGroup.add(defaultMesh);
        break;
      }
    }

    scene.add(artifactGroup);

    // Mouse drag rotation controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerMove = (e: MouseEvent) => {
      if (!isDragging || !modelGroupRef.current) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      modelGroupRef.current.rotation.y += dx * 0.01;
      modelGroupRef.current.rotation.x += dy * 0.01;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    function renderLoop() {
      const delta = clock.getDelta();
      if (autoRotate && modelGroupRef.current && !isDragging) {
        modelGroupRef.current.rotation.y += delta * 0.6;
      }
      renderer.render(scene, camera);
      animId = requestAnimationFrame(renderLoop);
    }
    renderLoop();

    // Trigger scanner sound
    sound.playScanBeep();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      renderer.dispose();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [artifactType, autoRotate]);

  const handleSpeak = () => {
    sound.playClick();
    if (isSpeaking) {
      sound.stopSpeaking();
      setIsSpeaking(false);
    } else {
      const textToRead = audioTranscript || `${title}. Era: ${era}. ${summary} ${significance}`;
      sound.speak(textToRead, () => setIsSpeaking(false));
      setIsSpeaking(true);
    }
  };

  const handleZoom = (inwards: boolean) => {
    sound.playClick();
    if (cameraRef.current) {
      const fovChange = inwards ? -5 : 5;
      cameraRef.current.fov = Math.max(25, Math.min(65, cameraRef.current.fov + fovChange));
      cameraRef.current.updateProjectionMatrix();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#12141a] border border-amber-500/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Top Header / Close button */}
        <button
          onClick={() => {
            sound.stopSpeaking();
            onClose();
          }}
          className="absolute top-4 right-4 z-30 p-2 text-amber-400 hover:text-white bg-black/60 rounded-full border border-amber-500/40 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 3D Viewport Column */}
        <div className="relative w-full md:w-1/2 h-72 md:h-auto min-h-[350px] bg-gradient-to-b from-[#181a24] to-[#0c0d12] flex items-center justify-center border-b md:border-b-0 md:border-r border-amber-500/30">
          <div ref={canvasMountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Scanner Grid Lines Overlay */}
          {isScanning && (
            <div className="absolute inset-0 scanline-overlay pointer-events-none flex flex-col justify-between p-3 font-tech text-[10px] text-cyan-400">
              <div className="flex justify-between items-center bg-black/40 px-2 py-1 rounded border border-cyan-500/30">
                <span className="flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> ULTRA-SPECTRAL 3D SCAN
                </span>
                <span>POLYGON RES: 4.8K</span>
              </div>
              <div className="flex justify-between items-center bg-black/40 px-2 py-1 rounded border border-cyan-500/30">
                <span>MAT: PBR GILDED GOLD & ALABASTER</span>
                <span>INTERACTIVE: DRAG TO ROTATE</span>
              </div>
            </div>
          )}

          {/* 3D Controls overlay */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 border border-amber-500/40 rounded-lg px-3 py-1 font-tech text-xs text-amber-200">
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto Rotation"
              className={`p-1 rounded ${autoRotate ? 'text-amber-400 bg-amber-500/20' : 'text-zinc-400'}`}
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(true)}
              title="Zoom In"
              className="p-1 rounded hover:bg-amber-500/20 text-amber-300"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleZoom(false)}
              title="Zoom Out"
              className="p-1 rounded hover:bg-amber-500/20 text-amber-300"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Educational Content Column */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center gap-2 text-xs font-tech text-amber-400 tracking-wider uppercase mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>AUTHENTICATED ARTIFACT FILE</span>
              <span className="text-zinc-500">•</span>
              <span className="text-cyan-400">{era}</span>
            </div>

            <h2 className="text-2xl font-egyptian font-bold text-amber-100 mb-3">
              {title}
            </h2>

            <p className="text-zinc-300 text-sm leading-relaxed mb-4">
              {summary}
            </p>

            <div className="bg-amber-950/40 border border-amber-600/40 rounded-xl p-4 mb-4">
              <h4 className="font-tech text-xs uppercase tracking-wider text-amber-300 font-bold mb-1">
                Historical Significance
              </h4>
              <p className="text-xs text-amber-100/90 leading-relaxed">
                {significance}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-3 border-t border-amber-500/20">
            <button
              onClick={handleSpeak}
              className={`flex-1 py-2.5 px-4 rounded-xl font-tech text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                isSpeaking
                  ? 'bg-amber-500 text-black border-amber-400'
                  : 'bg-amber-950/80 hover:bg-amber-900 border-amber-600/60 text-amber-200'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isSpeaking ? 'Stop Audio Narration' : 'Listen to Audio Tour'}</span>
            </button>

            <button
              onClick={() => {
                sound.playScanBeep();
                setIsScanning(!isScanning);
              }}
              className="py-2.5 px-3 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/50 text-cyan-300 font-tech text-xs font-bold"
            >
              {isScanning ? 'Scanner Grid: ON' : 'Scanner Grid: OFF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
