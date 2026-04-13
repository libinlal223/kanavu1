"use client";

import { useState, useEffect } from "react";

/**
 * useIsMobile — detects mobile/low-power devices.
 * Checks viewport width (<768) and touch capability.
 * Returns false during SSR, then resolves on mount.
 */
export default function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const narrow = window.innerWidth < 768;
      const touch = navigator.maxTouchPoints > 0;
      setIsMobile(narrow && touch);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}
