"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MeshReflectorMaterial, Text, Html, Line, Clouds, Cloud, useVideoTexture } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

/* ── Tuneable layout ── */
const NUM_FRAMES = 21; // Extended to allow extra tunnel frames after the 5 zigzag boxes
const FRAME_WIDTH = 12;
const FRAME_HEIGHT = 7;
const FLOOR_Y = -FRAME_HEIGHT / 2; // Floor surface perfectly aligns with the bottom of the box frames
const START_Z = -5;
const END_Z = -80;
const PASS_FADE_DISTANCE = 4;
const GLOW_COLOR = "#7cacf8"; // Soft blue-white neon

/* ────────────────────────────────────────────────────────────────────────── */
/*  Holographic wireframe outline                                            */
/* ────────────────────────────────────────────────────────────────────────── */
function TunnelFrame({ z }) {
  const groupRef = useRef();
  const { camera } = useThree();

  // Only an arch: bottom-left -> top-left -> top-right -> bottom-right
  const archPoints = useMemo(() => {
    const hw = FRAME_WIDTH / 2;
    const hh = FRAME_HEIGHT / 2;
    return [
      [-hw, -hh, 0], // Bottom left
      [-hw, hh, 0],  // Top left
      [hw, hh, 0],   // Top right
      [hw, -hh, 0],  // Bottom right
    ];
  }, []);

  // Fade out frames as camera passes them
  useFrame(() => {
    if (!groupRef.current) return;
    const distToCamera = camera.position.z - z;

    let opacity = 0;

    if (distToCamera > 0) {
      // Fade out far away frames for a realistic depth effect
      const FADE_START = 15;
      const FADE_END = 55;
      
      if (distToCamera < FADE_START) {
        opacity = 1;
      } else if (distToCamera < FADE_END) {
        opacity = 1 - ((distToCamera - FADE_START) / (FADE_END - FADE_START));
      } else {
        // Minimal visibility for frames that are very far away
        opacity = 0.05;
      }
      
      groupRef.current.scale.setScalar(1); // Keep unscaled
    } else if (distToCamera <= 0 && distToCamera > -PASS_FADE_DISTANCE) {
      const passProgress = Math.abs(distToCamera) / PASS_FADE_DISTANCE;
      opacity = 1 - passProgress;
      // Do not scale the box as it passes, to maintain perfect floor alignment
      groupRef.current.scale.setScalar(1);
    }

    groupRef.current.traverse((child) => {
      if (child.material) {
        child.material.opacity = Math.max(0, opacity);
      }
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, z]}>
      {/* Main arch outline — thick neon */}
      <Line
        points={archPoints}
        color={GLOW_COLOR}
        lineWidth={3.5}
        transparent
        opacity={1}
      />
      {/* Inner glow pass for bloom */}
      <Line
        points={archPoints}
        color="#ffffff"
        lineWidth={1.5}
        transparent
        opacity={1}
      />
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Dynamic Video Portal                                                     */
/* ────────────────────────────────────────────────────────────────────────── */
function VideoPortal({ z, portalIndex, texture }) {
  const groupRef = useRef();
  const planeGroupRef = useRef();
  const { camera } = useThree();

  // Zigzag position: Perfect Left/Right alternation using pure even/odd logic
  const targetX = portalIndex % 2 === 0 ? -3.5 : 3.5;

  useFrame(() => {
    if (!groupRef.current || !planeGroupRef.current) return;
    const distToCamera = camera.position.z - z;

    let isVisible = false;
    let planeScale = 1;

    if (distToCamera > 11.0) {
      isVisible = false;
    } else if (distToCamera > 6.5 && distToCamera <= 11.0) {
      isVisible = true;
      groupRef.current.position.x = targetX;
      const scaleProgress = 1 - ((distToCamera - 6.5) / 4.5);
      planeScale = scaleProgress * scaleProgress;
    } else if (distToCamera > 0 && distToCamera <= 6.5) {
      isVisible = true;
      groupRef.current.position.x = targetX;
      planeScale = 1;
    } else if (distToCamera <= 0 && distToCamera > -PASS_FADE_DISTANCE) {
      const passProgress = Math.abs(distToCamera) / PASS_FADE_DISTANCE;
      isVisible = true;
      planeScale = 1 + passProgress * 5; 
      groupRef.current.position.x = THREE.MathUtils.lerp(targetX, 0, passProgress);
    } else {
      isVisible = false;
    }

    groupRef.current.visible = isVisible;
    planeGroupRef.current.scale.setScalar(Math.max(0.001, planeScale));

    // Lock opacity strictly to 1.0. This prevents ANY background leaking while scaling through the camera.
    planeGroupRef.current.traverse((child) => {
      if (child.material) {
        child.material.opacity = 1;
        child.material.transparent = true;
      }
    });
  });

  const vw = 4.8;
  const vh = 2.7; // 16:9 aspect
  const hw = vw / 2;
  const hh = vh / 2;
  const radius = 0.15; // Curved edge radius

  // Generate curved shape and curved border outline
  const { roundedRectShape, curvedBorderPoints } = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-hw + radius, -hh);
    shape.lineTo(hw - radius, -hh);
    shape.quadraticCurveTo(hw, -hh, hw, -hh + radius);
    shape.lineTo(hw, hh - radius);
    shape.quadraticCurveTo(hw, hh, hw - radius, hh);
    shape.lineTo(-hw + radius, hh);
    shape.quadraticCurveTo(-hw, hh, -hw, hh - radius);
    shape.lineTo(-hw, -hh + radius);
    shape.quadraticCurveTo(-hw, -hh, -hw + radius, -hh);
    
    // Extract points and close the loop for the Line component
    const pts = shape.getPoints(10).map(p => [p.x, p.y, 0]);
    pts.push(pts[0]);
    
    return { roundedRectShape: shape, curvedBorderPoints: pts };
  }, [hw, hh]);

  return (
    <group ref={groupRef} position={[targetX, 0, z + 0.5]}>
      {/* Target inner group allows clean scaling around local origin */}
      <group ref={planeGroupRef}>
        
        {/* Full Black Backdrop: solid rock behind image */}
        <mesh name="backdrop" position={[0, 0, -0.01]} renderOrder={996}>
          <shapeGeometry args={[roundedRectShape]} />
          <meshBasicMaterial 
            color="#000000" 
            transparent={true} 
            opacity={1} 
            fog={false} 
            depthTest={false} 
          />
        </mesh>

        {/* Video Plane rendering exactly over the black backdrop */}
        <mesh name="videoMesh" renderOrder={997}>
          <shapeGeometry args={[roundedRectShape]} />
          <meshBasicMaterial 
            map={texture} 
            color="#ffffff" 
            transparent={true}
            opacity={1}
            toneMapped={false}
            fog={false} 
            depthTest={false}
          />
        </mesh>

        {/* Crisp Inner Border */}
        <Line
          name="borderLine"
          points={curvedBorderPoints}
          color="#a78bfa"
          lineWidth={1.5}
          transparent={true}
          opacity={1}
          depthTest={false}
          renderOrder={999}
        />
      </group>
    </group>
  );
}



/* ────────────────────────────────────────────────────────────────────────── */
/*  Reflective Floor                                                         */
/* ────────────────────────────────────────────────────────────────────────── */
/* ────────────────────────────────────────────────────────────────────────── */
/*  Reflective Floor                                                         */
/* ────────────────────────────────────────────────────────────────────────── */
function TunnelFloor({ isMobile }) {
  const { viewport } = useThree();
  
  // Generate a wet/imperfect roughness pattern
  const roughnessTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#111"; // Very low roughness base for high reflectivity
    ctx.fillRect(0, 0, size, size);

    // subtle streaks/imperfections
    for (let i = 0; i < 3000; i++) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`;
      const w = Math.random() * 10;
      const h = Math.random() * 3 + 1;
      ctx.fillRect(Math.random() * size, Math.random() * size, w, h);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(12, 12);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Pre-blurred fallback for mobile
  const mobileTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const size = 512;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, size, 0, 0); // Bottom to top
    gradient.addColorStop(0, "#1a0b2e");
    gradient.addColorStop(0.5, "#4c1d95"); // Fake blurred reflection glow
    gradient.addColorStop(1, "#05000a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  const floorY = FLOOR_Y;

  // Mobile optimization: save battery, no planar reflections
  if (isMobile) {
    return (
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, floorY, -50]}>
        <planeGeometry args={[100, 200]} />
        <meshBasicMaterial map={mobileTex} fog={true} />
      </mesh>
    );
  }

  return (
    <group position={[0, floorY, -50]}>
      {/* 1. Reflective mirror floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[120, 200]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={1024}
          mixBlur={1.5}
          mixStrength={50}
          roughness={0.15}
          roughnessMap={roughnessTex}
          depthScale={1.2}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#1a0b2e"
          metalness={0.8}
          mirror={1}
        />
      </mesh>
    </group>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Nested Tunnel (Replaces VideoFrames)                                     */
/* ────────────────────────────────────────────────────────────────────────── */
export default function VideoFrames({ isMobile }) {
  const groupRef = useRef();
  const scrollProgress = useRef(0);

  // Shared image texture to replace video placeholders
  const sharedImageTexture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load("/img2.jpg");
    tex.colorSpace = THREE.SRGBColorSpace;
    
    // Fix ShapeGeometry's default world-space UV mapping.
    // This perfectly projects the image so it spans 100% width and height of our 4.8 x 2.7 shape.
    const vw = 4.8;
    const vh = 2.7;
    tex.repeat.set(1 / vw, 1 / vh);
    tex.offset.set(0.5, 0.5);
    
    return tex;
  }, []);

  // Sync scroll fade-in (same as before, starts visible when nebulas would have appeared)
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

  useFrame(() => {
    if (!groupRef.current) return;
    const p = scrollProgress.current;
    
    // Hide totally during initial section 1 zoom
    const globalFade = p < 0.7 ? 0 : (p - 0.7) / 0.3;
    
    if (globalFade <= 0) {
      groupRef.current.visible = false;
      return;
    }
    
    groupRef.current.visible = true;
    
    // The "opacity" of the entire tunnel fading in (globalFade) is tricky mapped 
    // to all children but here we simply rely on the dark fog. To snap it off perfectly:
    // We could apply globalFade to opacity, but since it's deep in fog, visibility check usually suffices.
  });

  // Calculate positions for frames
  const frameZs = useMemo(() => {
    const zs = [];
    const step = (END_Z - START_Z) / (NUM_FRAMES - 1);
    for (let i = 0; i < NUM_FRAMES; i++) {
      zs.push(START_Z + step * i);
    }
    return zs;
  }, []);

  return (
    <group ref={groupRef}>
      {/* 1. Reflective Polished Floor */}
      <TunnelFloor isMobile={isMobile} />

      {/* 2. Concentric Neon Wireframes (Excluding the last one) */}
      {frameZs.slice(0, -1).map((z, i) => (
        <TunnelFrame key={i} z={z} />
      ))}

      {/* 2.5 Dynamic Video Portals placed at every 3rd frame (max 5) */}
      {frameZs.map((z, i) => {
        if (i !== 0 && i !== frameZs.length - 1 && i % 3 === 0 && i <= 15) {
          const portalIdx = i / 3; // 1, 2, 3...
          return <VideoPortal key={`vp_${i}`} z={z} portalIndex={portalIdx} texture={sharedImageTexture} />;
        }
        return null;
      })}



      {/* 4. Deep Volumetric Smog System */}
      <Clouds limit={60}>
        <Cloud
          seed={1}
          position={[0, 0, END_Z - 2]}
          color="#ffffff"
          opacity={0.05} // Kept low because bloom is very high
          speed={0.2}
          volume={15}
          segments={20}
          bounds={[20, 8, 4]}
          fade={20}
        />
        {/* Ambient moving fog along the tunnel walls */}
        {frameZs.map((z, i) => {
          if (i % 2 === 0 && i < frameZs.length - 1) {
            return (
              <group key={`ambient_fog_${i}`}>
                {/* Left wall fog */}
                <Cloud
                  seed={i * 10}
                  position={[-7, 0, z]}
                  color="#1e0a3d" // Extremely dark rich violet
                  opacity={0.15}
                  speed={0.6} // Actively moving
                  volume={10}
                  segments={10}
                  bounds={[4, 10, 10]}
                  fade={20}
                />
                {/* Right wall fog */}
                <Cloud
                  seed={i * 10 + 1}
                  position={[7, 0, z]}
                  color="#1e0a3d"
                  opacity={0.15}
                  speed={0.6}
                  volume={10}
                  segments={10}
                  bounds={[4, 10, 10]}
                  fade={20}
                />
              </group>
            );
          }
          return null;
        })}

        {/* Dynamic thick smog enveloping each image portal (max 5) */}
        {frameZs.map((z, i) => {
          if (i !== 0 && i !== frameZs.length - 1 && i % 3 === 0 && i <= 15) {
            const portalIdx = i / 3;
            // Perfect alternation for the smog wrapping
            const targetX = portalIdx % 2 === 0 ? -3.5 : 3.5;

            return (
              <Cloud
                key={`smog_${i}`}
                seed={i + 100}
                position={[targetX, 0, z - 1.5]}
                color="#0f0724" // Extremely dark deep purple smog to create the "dark shade" immersion
                opacity={0.35} // Reduced volume opacity so the image burns through clearly
                speed={0.4}
                volume={6}
                segments={15}
                bounds={[8, 6, 4]}
                fade={15}
              />
            );
          }
          return null;
        })}
      </Clouds>
    </group>
  );
}
