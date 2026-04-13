"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Clouds, Cloud } from "@react-three/drei";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

gsap.registerPlugin(ScrollTrigger);

/**
 * NebulaClouds — volumetric cloud field using drei's Cloud component.
 *
 * 12 cloud instances are distributed along the Z-axis (-5 to -55)
 * so the camera flies through them on scroll during Section 2.
 * They are completely hidden during Section 1 (hero/logo zoom) and
 * only fade in during the final 30% of the transition.
 */

const CLOUD_COUNT = 12;
const Z_START = -5; // Start deeper, past the logo end Z (-2)
const Z_END = -55;

// Pre-compute cloud configurations with deterministic seed-based variation
function generateCloudConfigs(count) {
  const configs = [];
  const step = (Z_END - Z_START) / (count - 1);

  // Simple seeded pseudo-random for deterministic layout
  const seededRandom = (seed) => {
    const x = Math.sin(seed * 9301 + 49297) * 49297;
    return x - Math.floor(x);
  };

  for (let i = 0; i < count; i++) {
    const z = Z_START + step * i;
    // Alternate between purple and pink tints with some variety
    const colorPool = ["#8b5cf6", "#a855f7", "#ec4899", "#d946ef", "#7c3aed"];
    const color = colorPool[i % colorPool.length];
    // Vary target opacity — keep it LOW for wispy translucent look
    const targetOpacity = 0.15 + seededRandom(i * 7 + 3) * 0.25; // 0.15–0.40
    const speed = 0.05 + seededRandom(i * 11 + 5) * 0.15;  // 0.05–0.20
    // Smaller volume for wispy nebula feel, not solid blocks
    const volume = 3 + seededRandom(i * 13 + 1) * 4;       // 3–7
    // Scatter off-center, some above/below for depth
    const x = (seededRandom(i * 17 + 2) - 0.5) * 16;
    const y = (seededRandom(i * 19 + 7) - 0.5) * 8;
    const seed = i * 13 + 42;

    configs.push({ x, y, z, color, targetOpacity, speed, volume, seed });
  }

  return configs;
}

export default function NebulaClouds() {
  const groupRef = useRef(null);
  const scrollProgress = useRef(0);
  const configs = useMemo(() => generateCloudConfigs(CLOUD_COUNT), []);

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

      if (groupRef.current) groupRef.current.__st = trigger;
    });

    return () => {
      cancelAnimationFrame(rafId);
      groupRef.current?.__st?.kill?.();
    };
  }, []);

  // Slow ambient rotation AND fade-in animation based on logo scroll
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    groupRef.current.rotation.y += delta * 0.005;

    // Fade multiplier: 0 until progress 0.7, then linear to 1.0 at progress 1.0
    const p = scrollProgress.current;
    const fadeMultiplier = p < 0.7 ? 0 : (p - 0.7) / 0.3;

    // Apply the fade multiplier to all cloud children materials
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        // Find the matching config index for this cloud.
        // In @react-three/drei's Clouds, child might be an InstancedMesh or individual Meshes.
        // We set the base material's opacity which scales the total opacity of the instanced mesh.
        child.material.transparent = true;
        child.material.opacity = fadeMultiplier;
      }
    });
  });

  return (
    <group ref={groupRef}>
      <Clouds limit={300} material={undefined}>
        {configs.map((cfg, i) => (
          <Cloud
            key={i}
            seed={cfg.seed}
            position={[cfg.x, cfg.y, cfg.z]}
            color={cfg.color}
            // we pass targetOpacity directly, the material scale will multiply it over all clouds
            opacity={cfg.targetOpacity}
            speed={cfg.speed}
            volume={cfg.volume}
            bounds={[20, 6, 3]}
            segments={15}
            growth={6}
            fade={30}
            concentrate="random"
          />
        ))}
      </Clouds>
    </group>
  );
}
