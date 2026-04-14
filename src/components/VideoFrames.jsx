"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Tuneable layout ── */
const FRAME_ASPECT = 9 / 16;
const FRAME_WIDTH = 2.5;
const FRAME_HEIGHT = FRAME_WIDTH / FRAME_ASPECT;
const FRAME_X_OFFSET = 4;         // zigzag left/right distance
const Y_OFFSET = 0.3;            // slight vertical variation
const PASS_FADE_DISTANCE = 3;     // how quickly frame fades after passing
const PASS_SCALE_BOOST = 1.5;     // scale-up factor when passing
const SCANLINE_SPEED = 2.0;       // scanline scroll speed

/* ── Default frame configs ── */
const DEFAULT_FRAMES = [
  { id: 0, src: "/videos/reel-1.mp4",  z: -10, side: "left" },
  { id: 1, src: "/videos/reel-2.mp4",  z: -16, side: "right" },
  { id: 2, src: "/videos/reel-3.mp4",  z: -22, side: "left" },
  { id: 3, src: "/videos/reel-4.mp4",  z: -28, side: "right" },
  { id: 4, src: "/videos/reel-5.mp4",  z: -34, side: "left" },
  { id: 5, src: "/videos/reel-6.mp4",  z: -40, side: "right" },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  Scanline overlay shader                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
const scanlineVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const scanlineFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    // Horizontal scanlines
    float line = sin((vUv.y * 120.0) + uTime * ${SCANLINE_SPEED.toFixed(1)}) * 0.5 + 0.5;
    line = smoothstep(0.3, 0.7, line);

    // Subtle glitch flicker
    float flicker = sin(uTime * 13.7) * sin(uTime * 7.3) * 0.5 + 0.5;
    float glitch = step(0.97, flicker) * 0.15;

    // Edge vignette glow
    float vignette = 1.0 - smoothstep(0.3, 0.5, length(vUv - 0.5));

    float alpha = (line * 0.08 + glitch + vignette * 0.04) * uOpacity;
    gl_FragColor = vec4(0.6, 0.4, 1.0, alpha);
  }
`;

/* ────────────────────────────────────────────────────────────────────────── */
/*  Holographic border glow                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
function FrameBorder({ width, height }) {
  const geometry = useMemo(() => {
    const hw = width / 2;
    const hh = height / 2;
    const pts = [
      new THREE.Vector3(-hw, -hh, 0.01),
      new THREE.Vector3(hw, -hh, 0.01),
      new THREE.Vector3(hw, hh, 0.01),
      new THREE.Vector3(-hw, hh, 0.01),
      new THREE.Vector3(-hw, -hh, 0.01),
    ];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [width, height]);

  return (
    <lineLoop geometry={geometry}>
      <lineBasicMaterial color="#a78bfa" transparent opacity={0.6} />
    </lineLoop>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  useVideoTextureManual — load video without Suspense so missing files     */
/*  don't crash the app                                                      */
/* ────────────────────────────────────────────────────────────────────────── */
function useVideoTextureManual(src) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!src) return;

    const video = document.createElement("video");
    video.src = src;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = false;
    video.preload = "auto";

    const onCanPlay = () => {
      video.play().catch(() => {}); // auto-play might be blocked
      const tex = new THREE.VideoTexture(video);
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.format = THREE.RGBAFormat;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    };

    const onError = () => {
      // Video failed to load — texture stays null, fallback will be used
      setTexture(null);
    };

    video.addEventListener("canplay", onCanPlay, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.load();

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      video.pause();
      video.removeAttribute("src");
      video.load(); // release resources
      if (texture) texture.dispose();
    };
  }, [src]);

  return texture;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Fallback canvas texture                                                  */
/* ────────────────────────────────────────────────────────────────────────── */
function createFallbackTexture(index) {
  const canvas = document.createElement("canvas");
  canvas.width = 180;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");

  // Gradient background with slight color variation per frame
  const hue = 260 + index * 15; // purple range
  const gradient = ctx.createLinearGradient(0, 0, 180, 320);
  gradient.addColorStop(0, `hsl(${hue}, 60%, 8%)`);
  gradient.addColorStop(0.5, `hsl(${hue}, 50%, 15%)`);
  gradient.addColorStop(1, `hsl(${hue + 20}, 60%, 5%)`);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 180, 320);

  // Grid lines for "hologram" feel
  ctx.strokeStyle = `hsla(${hue}, 70%, 60%, 0.1)`;
  ctx.lineWidth = 0.5;
  for (let y = 0; y < 320; y += 6) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(180, y);
    ctx.stroke();
  }

  // Play triangle (centered at 90, 160)
  ctx.fillStyle = `hsla(${hue}, 70%, 70%, 0.3)`;
  ctx.beginPath();
  ctx.moveTo(75, 135);
  ctx.lineTo(75, 185);
  ctx.lineTo(120, 160);
  ctx.closePath();
  ctx.fill();



  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  useImageTextureManual                                                    */
/* ────────────────────────────────────────────────────────────────────────── */
function useImageTextureManual(url) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!url) return;
    let active = true;
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    
    loader.load(
      url,
      (loadedTex) => {
        if (!active) {
          loadedTex.dispose();
          return;
        }
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        setTexture(loadedTex);
      },
      undefined,
      () => {
        if (active) setTexture(null);
      }
    );

    return () => {
      active = false;
    };
  }, [url]);

  return texture;
}

function VideoFrame({ src, index, isMobile }) {
  const scanlineRef = useRef();
  
  // Load a random real image based on the frame index
  const imageUrl = `https://picsum.photos/360/640?random=${index}`;
  const imageTexture = useImageTextureManual(imageUrl);

  const fallbackTexture = useMemo(() => createFallbackTexture(index), [index]);
  const activeTexture = imageTexture || fallbackTexture;

  // Animate scanline time
  useFrame((state) => {
    if (scanlineRef.current?.uniforms) {
      scanlineRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Video plane */}
      <mesh>
        <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
        <meshStandardMaterial
          map={activeTexture}
          emissive="#a78bfa"
          emissiveIntensity={1.5}
          emissiveMap={activeTexture}
          transparent
          opacity={1}
          side={THREE.DoubleSide}
          toneMapped={false}
        />
      </mesh>

      {/* Scanline overlay (desktop only) */}
      {!isMobile && (
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[FRAME_WIDTH, FRAME_HEIGHT]} />
          <shaderMaterial
            ref={scanlineRef}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            uniforms={{
              uTime: { value: 0 },
              uOpacity: { value: 0.15 },
            }}
            vertexShader={scanlineVertexShader}
            fragmentShader={scanlineFragmentShader}
          />
        </mesh>
      )}

      {/* Holographic border glow */}
      <FrameBorder width={FRAME_WIDTH + 0.1} height={FRAME_HEIGHT + 0.1} />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  VideoFrames — manages all frames, scroll visibility, mobile culling      */
/* ────────────────────────────────────────────────────────────────────────── */
export default function VideoFrames({ isMobile, frames = DEFAULT_FRAMES }) {
  const groupRef = useRef();
  const frameRefs = useRef([]);
  const scrollProgress = useRef(0);
  const { camera } = useThree();

  // Track the 2 nearest frame indices for mobile culling
  const [activeIndices, setActiveIndices] = useState(() => new Set([0, 1]));

  // Sync fade-in with the end of the logo zoom (Section 1)
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

  // Per-frame scroll animation: fade in/out + scale based on camera distance
  useFrame(() => {
    const camZ = camera.position.z;

    // Mobile: find the 2 nearest frames and only render those
    if (isMobile) {
      const distances = frames.map((f, i) => ({
        index: i,
        dist: Math.abs(camZ - f.z),
      }));
      distances.sort((a, b) => a.dist - b.dist);
      const nearest = new Set(distances.slice(0, 2).map((d) => d.index));

      setActiveIndices((prev) => {
        if (nearest.size !== prev.size) return nearest;
        for (const v of nearest) {
          if (!prev.has(v)) return nearest;
        }
        return prev;
      });
    }

    // Global fade — completely hidden during Section 1.
    // Becomes visible at the same moment the nebula clouds appear.
    const p = scrollProgress.current;
    const globalFade = p < 0.7 ? 0 : (p - 0.7) / 0.3;

    // Animate each frame ref
    frameRefs.current.forEach((group, i) => {
      if (!group) return;

      // Hard-hide entire group when globalFade is 0
      // This prevents borders, scanlines, and meshes from leaking through
      if (globalFade <= 0) {
        group.visible = false;
        return;
      }
      group.visible = true;

      const frameZ = frames[i].z;
      const distToCamera = camZ - frameZ;

      let opacity = 0;
      let scale = 1;

      if (distToCamera > 0) {
        // Camera is approaching — fully visible (fog handles distant fading)
        opacity = 1;
      } else if (distToCamera <= 0 && distToCamera > -PASS_FADE_DISTANCE) {
        // Camera just passed — scale up and fade out quickly
        const passProgress = Math.abs(distToCamera) / PASS_FADE_DISTANCE;
        opacity = 1 - passProgress;
        scale = 1 + passProgress * (PASS_SCALE_BOOST - 1);
      }

      // Multiply by globalFade so frames fade in sync with nebula
      opacity = THREE.MathUtils.clamp(opacity, 0, 1) * globalFade;
      group.scale.setScalar(scale);

      // Apply opacity to ALL materials (meshes AND line borders)
      group.traverse((child) => {
        if (child.material && child.material.opacity !== undefined) {
          child.material.opacity = opacity;
        }
      });
    });
  });

  // Compute positions (zigzag left/right)
  const framePositions = useMemo(() => {
    return frames.map((f, i) => {
      const x = f.side === "left" ? -FRAME_X_OFFSET : FRAME_X_OFFSET;
      const y = (i % 3 - 1) * Y_OFFSET;
      return [x, y, f.z];
    });
  }, [frames]);

  // Frames angle slightly inward toward center
  const frameRotations = useMemo(() => {
    return frames.map((f) => {
      const yRot = f.side === "left" ? 0.2 : -0.2;
      return [0, yRot, 0];
    });
  }, [frames]);

  return (
    <group ref={groupRef}>
      {frames.map((frame, i) => {
        // Mobile culling: only render nearby frames
        if (isMobile && !activeIndices.has(i)) return null;

        return (
          <group
            key={frame.id}
            ref={(el) => (frameRefs.current[i] = el)}
            position={framePositions[i]}
            rotation={frameRotations[i]}
          >
            <VideoFrame
              src={frame.src}
              index={i}
              isMobile={isMobile}
            />
          </group>
        );
      })}
    </group>
  );
}
