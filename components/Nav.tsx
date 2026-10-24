"use client";

import { useEffect, useRef } from "react";

const LINKS = [
  { href: "#proyek", label: "Proyek" },
  { href: "#keahlian", label: "Keahlian" },
  { href: "#perjalanan", label: "Perjalanan" },
  { href: "#kontak", label: "Kontak" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nv = navRef.current;
    if (!nv) return;
    const ind = nv.querySelector<HTMLElement>(".nvi");
    const nls = Array.from(
      nv.querySelectorAll<HTMLAnchorElement>("a:not(.logo)")
    );
    const nsec = nls.map((a) =>
      document.querySelector<HTMLElement>(a.getAttribute("href") || "")
    );
    let ncur: HTMLAnchorElement | null = null;

    const nto = (a: HTMLAnchorElement | null) => {
      if (!ind) return;
      if (!a) {
        ind.style.opacity = "0";
        return;
      }
      ind.style.opacity = "1";
      ind.style.width = a.offsetWidth + "px";
      ind.style.transform = "translateX(" + a.offsetLeft + "px)";
    };

    nls.forEach((a) => {
      a.addEventListener("pointerenter", () => nto(a));
      a.addEventListener("focus", () => nto(a));
      a.addEventListener("blur", () => nto(ncur));
    });
    nv.addEventListener("pointerleave", () => nto(ncur));

    const spy = () => {
      const y = innerHeight * 0.4;
      let c: HTMLAnchorElement | null = null;
      nsec.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top < y) c = nls[i];
      });
      if (c !== ncur) {
        ncur = c;
        nls.forEach((a) => a.classList.toggle("act", a === ncur));
        nto(ncur);
      }
      nv.classList.toggle("sc", scrollY > 40);
    };

    const onResize = () => nto(ncur);
    addEventListener("scroll", spy, { passive: true });
    addEventListener("resize", onResize);
    spy();

    return () => {
      removeEventListener("scroll", spy);
      removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <nav id="nav" ref={navRef} aria-label="Navigasi utama">
      <a className="logo" href="#top" aria-label="Beranda">
        <svg viewBox="0 0 420 420" aria-hidden="true">
          <use href="#logo" />
        </svg>
      </a>
      <span className="nvi" aria-hidden="true" />
      {LINKS.map((l) => (
        <a key={l.href} href={l.href}>
          {l.label}
        </a>
      ))}
    </nav>
  );
}
