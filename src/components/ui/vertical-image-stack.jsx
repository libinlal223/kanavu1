"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { motion } from "framer-motion"


const images = [
  {
    id: 1,
    src: "https://i.ibb.co/4ZWcP129/1.png",
    alt: "Elegant Invitation",
  },
  {
    id: 2,
    src: "https://i.ibb.co/TMbhBRcL/2.png",
    alt: "Modern Design",
  },
  {
    id: 3,
    src: "https://i.ibb.co/spXBFdSm/3.png",
    alt: "Vintage Style",
  },
  {
    id: 4,
    src: "https://i.ibb.co/N2TCN0bC/4.png",
    alt: "Minimalist",
  },
  {
    id: 5,
    src: "https://i.ibb.co/jZkh6q1M/5.png",
    alt: "Floral Design",
  },
  {
    id: 6,
    src: "https://i.ibb.co/6cc7mksr/6.png",
    alt: "Geometric",
  },
]

export function VerticalImageStack() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const lastNavigationTime = useRef(0)
  const containerRef = useRef(null)
  const navigationCooldown = 250 // ms between navigations

  const navigate = useCallback((newDirection) => {
    const now = Date.now()
    if (now - lastNavigationTime.current < navigationCooldown) return

    setCurrentIndex((prev) => {
      if (newDirection > 0 && prev < images.length - 1) {
        lastNavigationTime.current = now
        return prev + 1
      }
      if (newDirection < 0 && prev > 0) {
        lastNavigationTime.current = now
        return prev - 1
      }
      return prev
    })
  }, [])

  const handleDragEnd = (_, info) => {
    const threshold = 50
    if (info.offset.y < -threshold) {
      navigate(1)
    } else if (info.offset.y > threshold) {
      navigate(-1)
    }
  }

  // Scoped wheel handler — only triggers when pointer is over the component
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e) => {
      if (Math.abs(e.deltaY) > 30) {
        const direction = e.deltaY > 0 ? 1 : -1
        
        // Let the page scroll if we reach the end or start
        if (direction > 0 && currentIndex === images.length - 1) return
        if (direction < 0 && currentIndex === 0) return

        e.preventDefault()
        e.stopPropagation()
        navigate(direction)
      }
    }

    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [navigate, currentIndex])

  const getCardStyle = (index) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total

    if (diff === 0) {
      return { y: 0, scale: 1, opacity: 1, zIndex: 5, rotateX: 0 }
    } else if (diff === -1) {
      return { y: -110, scale: 0.85, opacity: 0.8, zIndex: 4, rotateX: 8 }
    } else if (diff === -2) {
      return { y: -190, scale: 0.7, opacity: 0.4, zIndex: 3, rotateX: 15 }
    } else if (diff === 1) {
      return { y: 110, scale: 0.85, opacity: 0.8, zIndex: 4, rotateX: -8 }
    } else if (diff === 2) {
      return { y: 190, scale: 0.7, opacity: 0.4, zIndex: 3, rotateX: -15 }
    } else {
      return { y: diff > 0 ? 280 : -280, scale: 0.5, opacity: 0, zIndex: 0, rotateX: diff > 0 ? -20 : 20 }
    }
  }

  const isVisible = (index) => {
    const total = images.length
    let diff = index - currentIndex
    if (diff > total / 2) diff -= total
    if (diff < -total / 2) diff += total
    return Math.abs(diff) <= 2
  }

  return (
    <div
      ref={containerRef}
      className="relative flex h-screen min-h-[750px] w-full flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="w-full text-center z-10 font-montserrat mb-4">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-white drop-shadow-md leading-none">
          Our Works
        </h2>
      </div>

      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "rgba(109, 40, 217, 0.06)" }}
        />
      </div>

      {/* Card Stack */}
      <div className="relative flex h-[640px] w-[320px] items-center justify-center" style={{ perspective: "1200px" }}>
        {images.map((image, index) => {
          if (!isVisible(index)) return null
          const style = getCardStyle(index)
          const isCurrent = index === currentIndex

          return (
            <motion.div
              key={image.id}
              className="absolute cursor-grab active:cursor-grabbing"
              animate={{
                y: style.y,
                scale: style.scale,
                opacity: style.opacity,
                rotateX: style.rotateX,
                zIndex: style.zIndex,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1,
              }}
              drag={isCurrent ? "y" : false}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{
                transformStyle: "preserve-3d",
                zIndex: style.zIndex,
              }}
            >
              <div
                className="relative h-[420px] w-[280px] overflow-hidden rounded-3xl"
                style={{
                  background: "#0d0520",
                  boxShadow: isCurrent
                    ? "0 25px 50px -12px rgba(167, 139, 250, 0.25), 0 0 0 1px rgba(167, 139, 250, 0.1)"
                    : "0 10px 30px -10px rgba(0, 0, 0, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Card inner glow */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ background: "linear-gradient(to bottom, rgba(167, 139, 250, 0.1), transparent, transparent)" }}
                />

                <img
                  src={image.src}
                  alt={image.alt}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                  loading={isCurrent ? "eager" : "lazy"}
                />

                {/* Bottom gradient overlay */}
                <div
                  className="absolute inset-x-0 bottom-0 h-32"
                  style={{ background: "linear-gradient(to top, var(--background), transparent)" }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute right-8 top-1/2 flex -translate-y-1/2 flex-col gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (index !== currentIndex) {
                setCurrentIndex(index)
              }
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: "0.5rem",
              height: index === currentIndex ? "1.5rem" : "0.5rem",
              background: index === currentIndex
                ? "var(--foreground)"
                : "rgba(240, 240, 240, 0.3)",
            }}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Instruction hint */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        <div className="flex flex-col items-center gap-2" style={{ color: "rgba(240, 240, 240, 0.4)" }}>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12l7-7 7 7" />
            </svg>
          </motion.div>
          <span className="text-xs font-medium tracking-widest uppercase">Scroll or drag</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M19 12l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.div>

    </div>
  )
}
