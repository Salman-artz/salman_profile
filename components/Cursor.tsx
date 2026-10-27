"use client";

import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
    if (!fine || rm) return;

    const cur = document.querySelector<HTMLElement>(".cur");
    const ring = document.querySelector<HTMLElement>(".ring");
    if (!cur || !ring) return;

    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      document.body.classList.add("on");
      cur.style.transform = `translate(${mx}px,${my}px)`;
    };
    const onLeave = () => document.body.classList.remove("on");
    addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    let raf = requestAnimationFrame(function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      raf = requestAnimationFrame(loop);
    });

    const cleanups: Array<() => void> = [];

    const onPointerOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("a, button, .card, .btn, .mx, .mnav, .th, [role='button']")) {
        ring.classList.add("big");
      } else {
        ring.classList.remove("big");
      }
    };
    document.addEventListener("pointerover", onPointerOver);
    cleanups.push(() => {
      document.removeEventListener("pointerover", onPointerOver);
    });

    document.querySelectorAll<HTMLElement>(".card").forEach((c) => {
      const move = (e: PointerEvent) => {
        const b = c.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width;
        const y = (e.clientY - b.top) / b.height;
        c.style.setProperty("--ry", (x - 0.5) * 10 + "deg");
        c.style.setProperty("--rx", (0.5 - y) * 10 + "deg");
        c.style.setProperty("--mx", x * 100 + "%");
        c.style.setProperty("--my", y * 100 + "%");
      };
      const reset = () => {
        c.style.setProperty("--rx", "0deg");
        c.style.setProperty("--ry", "0deg");
      };
      c.addEventListener("pointermove", move);
      c.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        c.removeEventListener("pointermove", move);
        c.removeEventListener("pointerleave", reset);
      });
    });

    document.querySelectorAll<HTMLElement>(".mag").forEach((b) => {
      const move = (e: PointerEvent) => {
        const r = b.getBoundingClientRect();
        b.style.transform =
          "translate(" +
          (e.clientX - r.left - r.width / 2) * 0.25 +
          "px," +
          (e.clientY - r.top - r.height / 2) * 0.35 +
          "px)";
      };
      const reset = () => {
        b.style.transform = "";
      };
      b.addEventListener("pointermove", move);
      b.addEventListener("pointerleave", reset);
      cleanups.push(() => {
        b.removeEventListener("pointermove", move);
        b.removeEventListener("pointerleave", reset);
      });
    });

    return () => {
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
      cleanups.forEach((f) => f());
    };
  }, []);

  return (
    <>
      <div className="cur" />
      <div className="ring" />
    </>
  );
}
