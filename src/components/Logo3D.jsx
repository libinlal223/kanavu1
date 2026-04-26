"use client";

import { Suspense, useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

/* ── Tuneable constants ── */
const LOGO_FIT_SIZE = 5;
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
/*  Static LogoMesh — loads the SVG, extrudes it, and slowly rotates        */
/* ────────────────────────────────────────────────────────────────────────── */
function LogoMesh() {
  const svgData = useLoader(SVGLoader, "/logo.svg");
  const wrapperRef = useRef();
  const innerRef = useRef();
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

    wrapper.scale.set(1, 1, 1);
    wrapper.position.set(0, 0, 0);
    inner.position.set(0, 0, 0);

    const box = new THREE.Box3().setFromObject(wrapper);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    inner.position.set(-center.x, -center.y, -center.z);

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const s = LOGO_FIT_SIZE / maxDim;
    wrapper.scale.set(s, -s, s); // -Y = flip SVG Y-axis

    setReady(true);
  }, [meshData]);

  /* ── Gentle continuous rotation ── */
  useFrame((_, delta) => {
    if (!wrapperRef.current || !ready) return;
    wrapperRef.current.rotation.y += delta * 0.3;
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
/*  Logo3D — Self-contained canvas with the 3D extruded SVG logo            */
/* ────────────────────────────────────────────────────────────────────────── */
export default function Logo3D({ className, style }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 8],
        fov: 45,
        near: 0.1,
        far: 100,
      }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      style={{ background: "transparent", ...style }}
      className={className}
    >
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.2} color="#c4b5fd" />
      <pointLight position={[-8, -5, 5]} intensity={0.6} color="#6d28d9" />
      <pointLight position={[0, 0, 5]} intensity={0.4} color="#a78bfa" />

      <Suspense fallback={null}>
        <LogoMesh />
      </Suspense>

      {/* Bloom for glow */}
      <EffectComposer>
        <Bloom
          intensity={2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
      </EffectComposer>
    </Canvas>
  );
}
