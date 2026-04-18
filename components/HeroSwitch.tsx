"use client";

import { useEffect, useState } from "react";
import ShoeScroll from "@/components/ShoeScroll";
import ScrollProgressBar from "@/components/ScrollProgressBar";
import ScrollOverlays from "@/components/ScrollOverlays";
import HeroMobile from "@/components/HeroMobile";

const DESKTOP_BREAKPOINT = "(min-width: 768px)";

export default function HeroSwitch() {
  const [mounted, setMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_BREAKPOINT);
    const update = () => setIsDesktop(mediaQuery.matches);

    update();
    setMounted(true);

    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  if (!mounted) {
    return <div className="h-[100svh] w-full bg-white" aria-hidden />;
  }

  if (!isDesktop) {
    return <HeroMobile />;
  }

  return (
    <ShoeScroll>
      <ScrollProgressBar />
      <ScrollOverlays />
    </ShoeScroll>
  );
}
