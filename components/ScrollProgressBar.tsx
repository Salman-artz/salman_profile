"use client";

import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const de = document.documentElement;
      const m = de.scrollHeight - window.innerHeight;
      if (ref.current) {
        ref.current.style.transform = `scaleX(${m > 0 ? window.scrollY / m : 0})`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return <div id="bar" ref={ref} />;
}
