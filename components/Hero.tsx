"use client";

import type { CSSProperties } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

const ROLES = ["Software Developer", "Fullstack Developer"];
const NAME_WORDS = "Muhammad Salman Alfarizy Yonda Putra".split(" ");
const GLYPHS = [
  "{ }", "</>", "=>", "01", "( )", "[ ]", "#", "fn", "&&", "git", "async", "SQL",
];

const PHOTOS = [
  { src: "/stack-1.jpg", alt: "Foto Putra di puncak bukit" },
  { src: "/stack-2.jpg", alt: "Foto Putra berpose dengan tangan bersilang" },
  { src: "/stack-3.jpg", alt: "Foto Putra saat menjadi pembicara" },
  { src: "/stack-4.jpg", alt: "Foto Putra di taman kampus" },
];

let _gi = 0;
const NAME_LETTERS = NAME_WORDS.map((w) =>
  [...w].map((c) => ({ c, i: _gi++ }))
);

const CHIPS: Array<{
  z: string;
  dl: string;
  label: string;
  color: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}> = [
  { z: "110px", top: "6%", left: "-14%", dl: "0s", color: "#00add8", label: "Go" },
  { z: "150px", top: "20%", right: "-16%", dl: ".6s", color: "#3178c6", label: "TypeScript" },
  { z: "90px", top: "52%", left: "-20%", dl: "1.1s", color: "#54c5f8", label: "Flutter" },
  { z: "130px", bottom: "14%", right: "-12%", dl: "1.7s", color: "#68a063", label: "Node.js" },
  { z: "100px", bottom: "-3%", left: "8%", dl: "2.2s", color: "#336791", label: "PostgreSQL" },
  { z: "125px", top: "-5%", right: "10%", dl: "2.8s", color: "#ff2d20", label: "Laravel" },
];

type Sym = {
  text: string;
  left: string;
  top: string;
  fontSize: string;
  t: number;
  dl: number;
};

const v = (o: Record<string, string | number>) => o as CSSProperties;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);
  const [syms, setSyms] = useState<Sym[]>([]);

  /* role typewriter */
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const el = roleRef.current;
    if (rm || !el) return;
    let ri = 0, ci = 0, del = false;
    let timer = 0;
    const tick = () => {
      const w = ROLES[ri];
      ci += del ? -1 : 1;
      el.textContent = w.slice(0, ci);
      let wait = del ? 45 : 85;
      if (!del && ci === w.length) {
        del = true;
        wait = 1600;
      } else if (del && ci === 0) {
        del = false;
        ri = (ri + 1) % ROLES.length;
        wait = 350;
      }
      timer = window.setTimeout(tick, wait);
    };
    el.textContent = "";
    timer = window.setTimeout(tick, 1500);
    return () => clearTimeout(timer);
  }, []);

  /* floating code symbols */
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion:reduce)").matches) return;
    const arr: Sym[] = [];
    for (let q = 0; q < 16; q++) {
      arr.push({
        text: GLYPHS[q % GLYPHS.length],
        left: 4 + Math.random() * 90 + "%",
        top: 25 + Math.random() * 65 + "%",
        fontSize: 0.8 + Math.random() * 1.1 + "rem",
        t: 9 + Math.random() * 9,
        dl: -Math.random() * 14,
      });
    }
    setSyms(arr);
  }, []);

  /* spotlight & blob parallax */
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const onSpot = (e: PointerEvent) => {
      const b = hero.getBoundingClientRect();
      const x = e.clientX - b.left;
      const y = e.clientY - b.top;
      hero.style.setProperty("--sx", x + "px");
      hero.style.setProperty("--sy", y + "px");
      hero.style.setProperty("--px", ((x / b.width - 0.5) * 2).toString());
      hero.style.setProperty("--py", ((y / b.height - 0.5) * 2).toString());
    };

    hero.addEventListener("pointermove", onSpot);
    return () => hero.removeEventListener("pointermove", onSpot);
  }, []);

  /* kartu tumpuk foto: klik/seret/keyboard — port dari script HTML v3 */
  useEffect(() => {
    const stg = stackRef.current;
    if (!stg) return;
    const phs = Array.from(stg.children) as HTMLElement[];
    const np = phs.length;
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
    let cu = 0, busy = false, drag = false, moved = false, dx = 0, x0 = 0, tmr = 0;
    let pid: number | null = null;

    const lay = () => {
      phs.forEach((c, i) => c.style.setProperty("--p", String((((i - cu) % np) + np) % np)));
    };

    const nxt = (left?: boolean) => {
      if (busy) return;
      busy = true;
      const f = phs[cu];
      if (rm) { cu = (cu + 1) % np; lay(); busy = false; return; }
      f.classList.add(left ? "outl" : "out");
      window.setTimeout(() => {
        f.style.transition = "none";
        cu = (cu + 1) % np;
        f.classList.remove("out", "outl");
        lay();
        void f.offsetWidth;
        f.style.transition = "";
        busy = false;
      }, 480);
    };

    const prv = () => {
      if (busy) return;
      busy = true;
      const i = (cu - 1 + np) % np;
      const t = phs[i];
      if (rm) { cu = i; lay(); busy = false; return; }
      t.style.transition = "none";
      t.classList.add("outl");
      void t.offsetWidth;
      t.style.transition = "";
      t.classList.remove("outl");
      cu = i;
      lay();
      window.setTimeout(() => { busy = false; }, 520);
    };

    const play = () => {
      clearInterval(tmr);
      if (rm) return;
      tmr = window.setInterval(() => {
        if (!document.hidden && !drag) nxt();
      }, 5500);
    };

    const down = (e: PointerEvent) => {
      if (busy || (e.pointerType === "mouse" && e.button !== 0)) return;
      drag = true;
      moved = false;
      x0 = e.clientX;
      dx = 0;
      pid = e.pointerId;
      clearInterval(tmr);
    };

    const move = (e: PointerEvent) => {
      if (!drag) return;
      dx = e.clientX - x0;
      if (!moved && Math.abs(dx) > 6) {
        moved = true;
        phs[cu].classList.add("drag");
        try {
          if (pid !== null) stg.setPointerCapture(pid);
        } catch {
          /* diabaikan */
        }
      }
      if (moved) {
        phs[cu].style.transform = `translate3d(${dx}px,0,0) rotate(${dx / 16}deg)`;
      }
    };

    const end = () => {
      if (!drag) return;
      drag = false;
      const f = phs[cu];
      if (!moved) {
        /* klik singkat (termasuk klik pada overlay pointer-events:none) → skip foto */
        nxt();
        play();
        return;
      }
      f.classList.remove("drag");
      f.style.transform = "";
      if (dx < -60) nxt(true);
      else if (dx > 60) prv();
      play();
    };

    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prv();
        play();
      } else if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        nxt();
        play();
      }
    };

    const enter = () => clearInterval(tmr);
    const leave = () => {
      if (!drag) play();
    };

    stg.addEventListener("pointerdown", down);
    stg.addEventListener("pointermove", move);
    stg.addEventListener("pointerup", end);
    stg.addEventListener("pointercancel", end);
    stg.addEventListener("keydown", key);
    stg.addEventListener("pointerenter", enter);
    stg.addEventListener("pointerleave", leave);

    lay();
    play();

    return () => {
      clearInterval(tmr);
      stg.removeEventListener("pointerdown", down);
      stg.removeEventListener("pointermove", move);
      stg.removeEventListener("pointerup", end);
      stg.removeEventListener("pointercancel", end);
      stg.removeEventListener("keydown", key);
      stg.removeEventListener("pointerenter", enter);
      stg.removeEventListener("pointerleave", leave);
    };
  }, []);

  /* canvas particle network */
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const cv = canvasRef.current;
    const hero = heroRef.current;
    if (rm || !cv || !hero) return;
    const cx = cv.getContext("2d");
    if (!cx) return;

    let pts: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    let W0 = 0, H0 = 0, mx = -999, my = -999, vis = true, col = "#3dd9ff", fr = 0;

    const rs = () => {
      const r = hero.getBoundingClientRect();
      const dp = Math.min(2, devicePixelRatio || 1);
      W0 = r.width;
      H0 = r.height;
      cv.width = W0 * dp;
      cv.height = H0 * dp;
      cx.setTransform(dp, 0, 0, dp, 0, 0);
      const n = Math.round(Math.min(80, W0 / 16));
      pts = [];
      for (let i = 0; i < n; i++) {
        pts.push({
          x: Math.random() * W0,
          y: Math.random() * H0,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      const b = hero.getBoundingClientRect();
      mx = e.clientX - b.left;
      my = e.clientY - b.top;
    };
    const onLeave = () => {
      mx = -999;
      my = -999;
    };

    rs();
    addEventListener("resize", rs);
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    const io = new IntersectionObserver((es) => {
      vis = es[0].isIntersecting;
    });
    io.observe(hero);

    let raf = requestAnimationFrame(function lp() {
      raf = requestAnimationFrame(lp);
      if (!vis) return;
      if (fr++ % 90 === 0) {
        col = getComputedStyle(document.documentElement).getPropertyValue("--a2").trim() || col;
      }
      cx.clearRect(0, 0, W0, H0);
      cx.fillStyle = col;
      cx.strokeStyle = col;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W0) p.vx *= -1;
        if (p.y < 0 || p.y > H0) p.vy *= -1;
        const dx = mx - p.x, dy = my - p.y, dd = Math.hypot(dx, dy);
        if (dd < 150) {
          p.x -= dx * 0.012;
          p.y -= dy * 0.012;
        }
        cx.globalAlpha = 0.75;
        cx.beginPath();
        cx.arc(p.x, p.y, 1.9, 0, 6.283);
        cx.fill();
        for (let j = i + 1; j < pts.length; j++) {
          const o = pts[j];
          const ex = o.x - p.x, ey = o.y - p.y, ed = Math.hypot(ex, ey);
          if (ed < 120) {
            cx.globalAlpha = (1 - ed / 120) * 0.35;
            cx.beginPath();
            cx.moveTo(p.x, p.y);
            cx.lineTo(o.x, o.y);
            cx.stroke();
          }
        }
        if (dd < 180) {
          cx.globalAlpha = (1 - dd / 180) * 0.6;
          cx.beginPath();
          cx.moveTo(p.x, p.y);
          cx.lineTo(mx, my);
          cx.stroke();
        }
      }
    });

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      removeEventListener("resize", rs);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <header className="hero" id="top" ref={heroRef}>
      <div className="grid-bg" />
      <div className="spot" />
      <canvas id="net" className="net" ref={canvasRef} aria-hidden="true" />
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
      {syms.map((s, i) => (
        <span
          key={i}
          className="sym"
          style={v({
            left: s.left,
            top: s.top,
            fontSize: s.fontSize,
            "--t": s.t + "s",
            "--dl": s.dl + "s",
          })}
        >
          {s.text}
        </span>
      ))}

      <div className="hero-in">
        <div className="copy">
          <h1 id="name" aria-label="Muhammad Salman Alfarizy Yonda Putra">
            {NAME_WORDS.map((_, wi) => (
              <Fragment key={wi}>
                {wi > 0 ? " " : null}
                <span className="word" aria-hidden="true">
                  {NAME_LETTERS[wi].map(({ c, i }) => (
                    <span key={i} className="ch" style={v({ "--i": i })}>
                      {c}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </h1>
          <div className="role" aria-live="polite">
            <span id="role" ref={roleRef}>
              Software Developer
            </span>
            <span className="caret" />
          </div>
          <p className="sub">
            Software developer dan fullstack developer yang merancang backend
            yang tangguh, antarmuka yang rapi, dan aplikasi mobile yang mulus,
            dari database sampai layar pengguna.
          </p>
          <div className="btns">
            <a className="btn main mag" href="#proyek">
              Lihat proyek
            </a>
            <a className="btn mag" href="https://github.com/Salman-artz" rel="noopener">
              GitHub
            </a>
          </div>
        </div>

        <div className="stage" aria-hidden={false}>
          <div className="sway">
            <div className="tilt">
              <div className="halo" />
              <div className="orbit" />
              <div
                className="stack"
                ref={stackRef}
                tabIndex={0}
                role="button"
                aria-label="Ganti foto"
              >
                {PHOTOS.map((p, i) => (
                  <div key={i} className="ph" style={v({ "--p": i })}>
                    <img
                      src={p.src}
                      alt={p.alt}
                      width={640}
                      height={853}
                      decoding="async"
                      fetchPriority={i === 0 ? "high" : undefined}
                    />
                    <div className="gloss" />
                  </div>
                ))}
              </div>
              <div className="badge3d">
                <svg className="rtxt" viewBox="0 0 200 200" aria-hidden="true">
                  <defs>
                    <path
                      id="cp"
                      d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0"
                    />
                  </defs>
                  <text>
                    <textPath href="#cp" textLength="486" lengthAdjust="spacing">
                      fullstack developer • software developer •
                    </textPath>
                  </text>
                </svg>
                <svg className="lg" viewBox="0 0 420 420" aria-hidden="true">
                  <use href="#logo" />
                </svg>
              </div>
              {CHIPS.map((c) => (
                <span
                  key={c.label}
                  className="chip"
                  style={v({
                    "--z": c.z,
                    "--dl": c.dl,
                    ...(c.top !== undefined && { top: c.top }),
                    ...(c.left !== undefined && { left: c.left }),
                    ...(c.right !== undefined && { right: c.right }),
                    ...(c.bottom !== undefined && { bottom: c.bottom }),
                  })}
                >
                  <i style={{ background: c.color }} />
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="scroll" aria-hidden="true" />
    </header>
  );
}
