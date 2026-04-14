"use client";

import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useIsMobile from "@/hooks/useMobile";
import NebulaClouds from "./NebulaClouds";
import NebulaMobileFallback from "./NebulaMobileFallback";
import VideoFrames from "./VideoFrames";

gsap.registerPlugin(ScrollTrigger);

/* ── Tuneable constants ── */
const CAMERA_START_Z = 20;        // Section 1 start
const CAMERA_LOGO_END_Z = -2;    // Section 1 end = Section 2 start
const CAMERA_NEBULA_END_Z = -52;  // Section 2 end (fly through nebula)
const CAMERA_FINALE_Z = -57;      // Section 4 end (camera decelerates to here)
const CAMERA_FINALE_TILT = 0.15;  // Upward tilt in radians at finale
const LOGO_MAX_SCALE = 100;
const FADE_START = 0.6;           // progress value at which logo opacity fade begins
const LOGO_FIT_SIZE = 5;          // normalised size in world units
const EXTRUDE_DEPTH = 2;
const ACCENT = "#a78bfa";

/**
 * If the SVG fill colour is too dark (near-black), swap it
 * for a visible accent so the logo shows up against the dark bg.
 */
function resolveColor(rawFill) {
  if (!rawFill || rawFill.toLowerCase() === "none") return new THREE.Color(ACCENT);
  try {
    const c = new THREE.Color().setStyle(rawFill);
    if (c.r + c.g + c.b < 0.15) return new THREE.Color(ACCENT);
    return c;
  } catch {
    return new THREE.Color(ACCENT);
  }
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  LogoMesh — loads an SVG, builds extruded meshes, animates on scroll     */
/* ────────────────────────────────────────────────────────────────────────── */
function LogoMesh() {
  const svgData = useLoader(SVGLoader, "/logo.svg");
  const wrapperRef = useRef();
  const innerRef = useRef();
  const scrollProgress = useRef(0);
  const baseScale = useRef(1);
  const { camera } = useThree();
  const [ready, setReady] = useState(false);

  /* ── Build Three.js geometries from SVG paths ── */
  const meshData = useMemo(() => {
    const items = [];

    svgData.paths.forEach((path) => {
      const style = path.userData?.style;
      const color = resolveColor(style?.fill);
      const opacity = parseFloat(style?.fillOpacity ?? 1);

      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: EXTRUDE_DEPTH,
          bevelEnabled: true,
          bevelThickness: 0.4,
          bevelSize: 0.2,
          bevelSegments: 2,
        });
        items.push({ geometry, color, opacity });
      });
    });

    return items;
  }, [svgData]);

  /* ── Centre the logo at the origin & normalise its scale ── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || meshData.length === 0) return;

    // Reset to identity so the bounding-box maths is clean
    wrapper.scale.set(1, 1, 1);
    wrapper.position.set(0, 0, 0);
    inner.position.set(0, 0, 0);

    // Raw bounding box in SVG coordinate space
    const box = new THREE.Box3().setFromObject(wrapper);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    // Shift inner group so the logo's centre sits at local origin
    inner.position.set(-center.x, -center.y, -center.z);

    // Flip SVG Y-axis (SVG Y is top-down) + normalise into LOGO_FIT_SIZE
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = LOGO_FIT_SIZE / maxDim;
    wrapper.scale.set(s, -s, s); // -Y = flip
    baseScale.current = s;

    setReady(true);
  }, [meshData]);

  /* ── Wire GSAP ScrollTrigger → progress ref (Section 1 only) ── */
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const heroEl = document.getElementById("hero");
      if (!heroEl) return;

      const trigger = ScrollTrigger.create({
        trigger: heroEl,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      wrapperRef.current?.__st?.kill?.();
      if (wrapperRef.current) wrapperRef.current.__st = trigger;
    });

    return () => {
      cancelAnimationFrame(rafId);
      wrapperRef.current?.__st?.kill?.();
    };
  }, []);

  /* ── Per-frame animation driven by scroll (logo scale + fade) ── */
  useFrame(() => {
    const p = scrollProgress.current;
    const wrapper = wrapperRef.current;
    if (!wrapper || !ready) return;

    // Logo: scale from 1× → LOGO_MAX_SCALE×
    const s = baseScale.current;
    const factor = 1 + p * (LOGO_MAX_SCALE - 1);
    wrapper.scale.set(s * factor, -s * factor, s * factor);

    // Logo: fade opacity once we've passed FADE_START
    const opacity =
      p > FADE_START
        ? THREE.MathUtils.clamp(
            1 - (p - FADE_START) / (1 - FADE_START),
            0,
            1,
          )
        : 1;

    wrapper.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = opacity;
      }
    });
  });

  return (
    <group ref={wrapperRef}>
      <group ref={innerRef}>
        {meshData.map(({ geometry, color, opacity }, i) => (
          <mesh key={i} geometry={geometry}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.2}
              transparent
              opacity={opacity}
              side={THREE.DoubleSide}
              metalness={0.5}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  EndingLogo — smaller logo that reappears fixed in the finale            */
/* ────────────────────────────────────────────────────────────────────────── */
function EndingLogo() {
  const svgData = useLoader(SVGLoader, "/logo.svg");
  const wrapperRef = useRef();
  const innerRef = useRef();
  const baseScale = useRef(1);
  const finaleProgress = useRef(0);
  const [ready, setReady] = useState(false);
  const { camera } = useThree();

  const meshData = useMemo(() => {
    const items = [];
    svgData.paths.forEach((path) => {
      const style = path.userData?.style;
      const color = resolveColor(style?.fill);
      const opacity = parseFloat(style?.fillOpacity ?? 1);
      const shapes = SVGLoader.createShapes(path);
      shapes.forEach((shape) => {
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 1,
          bevelEnabled: true,
          bevelThickness: 0.2,
          bevelSize: 0.1,
          bevelSegments: 2,
        });
        items.push({ geometry, color, opacity });
      });
    });
    return items;
  }, [svgData]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerRef.current;
    if (!wrapper || !inner || meshData.length === 0) return;

    wrapper.scale.set(1, 1, 1);
    wrapper.position.set(0, 0, 0);
    inner.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(wrapper);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    inner.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = (LOGO_FIT_SIZE * 0.35) / maxDim; // 35% of original
    wrapper.scale.set(s, -s, s);
    baseScale.current = s;

    setReady(true);
  }, [meshData]);

  // Track finale scroll progress
  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const finaleEl = document.getElementById("finale");
      if (!finaleEl) return;

      const trigger = ScrollTrigger.create({
        trigger: finaleEl,
        start: "top 60%",
        end: "bottom bottom",
        onUpdate: (self) => {
          finaleProgress.current = self.progress;
        },
      });

      wrapperRef.current?.__st?.kill?.();
      if (wrapperRef.current) wrapperRef.current.__st = trigger;
    });

    return () => {
      cancelAnimationFrame(rafId);
      wrapperRef.current?.__st?.kill?.();
    };
  }, []);

  useFrame((_, delta) => {
    const wrapper = wrapperRef.current;
    if (!wrapper || !ready) return;

    // Position in front of camera at finale
    const targetZ = CAMERA_FINALE_Z - 8;
    wrapper.position.set(0, 0.5, targetZ);

    // Gentle rotation
    wrapper.rotation.y += delta * 0.15;

    // Fade in based on finale progress
    const p = finaleProgress.current;
    const opacity = THREE.MathUtils.clamp(p * 2, 0, 1); // fade in over first 50% of finale

    wrapper.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.opacity = opacity;
        child.material.emissiveIntensity = 0.3 + p * 0.3;
      }
    });
  });

  return (
    <group ref={wrapperRef}>
      <group ref={innerRef}>
        {meshData.map(({ geometry, color, opacity }, i) => (
          <mesh key={i} geometry={geometry}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.3}
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              metalness={0.6}
              roughness={0.2}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  CameraRig — chains Section 1 + Section 2 + Finale camera movement      */
/* ────────────────────────────────────────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  const heroProgress = useRef(0);
  const nebulaProgress = useRef(0);
  const finaleProgress = useRef(0);

  // Smoothed values for damping
  const smoothZ = useRef(CAMERA_START_Z);
  const smoothRotX = useRef(0);

  useEffect(() => {
    const rafId = requestAnimationFrame(() => {
      const heroEl = document.getElementById("hero");
      const nebulaEl = document.getElementById("nebula");
      const finaleEl = document.getElementById("finale");

      const triggers = [];

      if (heroEl) {
        triggers.push(
          ScrollTrigger.create({
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              heroProgress.current = self.progress;
            },
          })
        );
      }

      if (nebulaEl) {
        triggers.push(
          ScrollTrigger.create({
            trigger: nebulaEl,
            start: "top top",
            end: "bottom top",
            onUpdate: (self) => {
              nebulaProgress.current = self.progress;
            },
          })
        );
      }

      if (finaleEl) {
        triggers.push(
          ScrollTrigger.create({
            trigger: finaleEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 2, // Weighted inertia — feels like camera has mass
            onUpdate: (self) => {
              finaleProgress.current = self.progress;
            },
          })
        );
      }

      // Store for cleanup
      camera.__triggers = triggers;
    });

    return () => {
      cancelAnimationFrame(rafId);
      camera.__triggers?.forEach((t) => t.kill());
    };
  }, [camera]);

  useFrame((_, delta) => {
    const hp = heroProgress.current;
    const np = nebulaProgress.current;
    const fp = finaleProgress.current;

    let targetZ = CAMERA_START_Z;
    let targetRotX = 0;

    if (hp < 1) {
      // Section 1: fly through logo
      targetZ = THREE.MathUtils.lerp(CAMERA_START_Z, CAMERA_LOGO_END_Z, hp);
    } else if (np < 1) {
      // Section 2: fly through nebula
      targetZ = THREE.MathUtils.lerp(CAMERA_LOGO_END_Z, CAMERA_NEBULA_END_Z, np);
    } else {
      // Section 4 (Finale): decelerate into open space + tilt up
      // Use easeOutCubic for natural deceleration
      const easedP = 1 - Math.pow(1 - fp, 3);
      targetZ = THREE.MathUtils.lerp(CAMERA_NEBULA_END_Z, CAMERA_FINALE_Z, easedP);
      targetRotX = easedP * CAMERA_FINALE_TILT;
    }

    // Smooth damping for cinematic feel
    const dampFactor = 1 - Math.exp(-6 * delta);
    smoothZ.current = THREE.MathUtils.lerp(smoothZ.current, targetZ, dampFactor);
    smoothRotX.current = THREE.MathUtils.lerp(smoothRotX.current, targetRotX, dampFactor);

    camera.position.z = smoothZ.current;
    camera.rotation.x = smoothRotX.current;
  });

  return null;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Dual Star Layers                                                         */
/* ────────────────────────────────────────────────────────────────────────── */
function StarLayers({ isMobile }) {
  const distantDepth = isMobile ? 30 : 60;
  const sparkleDepth = isMobile ? 25 : 50;

  return (
    <>
      {/* Layer 1 — small, distant stars */}
      <Stars
        radius={300}
        depth={distantDepth}
        count={isMobile ? 4000 : 8000}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Layer 2 — larger, glowing sparkle stars */}
      <Stars
        radius={200}
        depth={sparkleDepth}
        count={isMobile ? 400 : 800}
        factor={8}
        saturation={0.6}
        fade
        speed={0.3}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Post-processing (desktop only)                                           */
/* ────────────────────────────────────────────────────────────────────────── */
function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.4}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Full scene composition                                                   */
/* ────────────────────────────────────────────────────────────────────────── */
function SceneContent() {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} color="#c4b5fd" />
      <pointLight position={[-8, -5, 5]} intensity={0.6} color="#6d28d9" />
      {/* Additional purple point light to illuminate nebula clouds */}
      <pointLight position={[0, 0, -25]} intensity={0.8} color="#8b5cf6" distance={60} />
      {/* Finale area light — illuminates the open space at the end */}
      <pointLight position={[0, 5, -60]} intensity={0.6} color="#a78bfa" distance={40} />

      {/* Fog for depth — extended far plane so finale isn't clipped */}
      <fog attach="fog" args={["#05000a", 30, 100]} />

      {/* Camera rig — handles Section 1 + Section 2 + Finale */}
      <CameraRig />

      {/* Dual star layers */}
      <StarLayers isMobile={isMobile} />

      {/* SVG Logo — wrapped in Suspense while SVGLoader fetches the file */}
      <Suspense fallback={null}>
        <LogoMesh />
      </Suspense>

      {/* Nebula clouds (desktop) or nothing (mobile gets CSS fallback) */}
      {!isMobile && (
        <Suspense fallback={null}>
          <NebulaClouds />
        </Suspense>
      )}

      {/* Video frames floating in the nebula tunnel */}
      <Suspense fallback={null}>
        <VideoFrames isMobile={isMobile} />
      </Suspense>

      {/* Ending logo — reappears at the finale */}
      <Suspense fallback={null}>
        <EndingLogo />
      </Suspense>

      {/* Bloom post-processing (desktop only) — stays active through finale */}
      {!isMobile && <PostProcessing />}
    </>
  );
}

export default function Scene() {
  const isMobile = useIsMobile();

  return (
    <>
      <Canvas
        camera={{
          position: [0, 0, CAMERA_START_Z],
          fov: 50,
          near: 0.01,
          far: 2000,
        }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        style={{ background: "transparent" }}
      >
        <SceneContent />
      </Canvas>

      {/* 2D mobile nebula fallback (outside Canvas) */}
      {isMobile && <NebulaMobileFallback />}
    </>
  );
}
