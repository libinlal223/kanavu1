"use client"

import dynamic from "next/dynamic"

const VerticalImageStack = dynamic(
  () => import("@/components/ui/vertical-image-stack").then((mod) => mod.VerticalImageStack),
  { ssr: false }
)

export default function VerticalImageStackWrapper() {
  return <VerticalImageStack />
}
