"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

const v = (o: Record<string, string | number>) => o as CSSProperties;

/* QR cells — pola deterministik dari logika asli */
const QR_CELLS = (() => {
  const cells: Array<{ x: number; y: number; d: number }> = [];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      if ((x * 7 + y * 3) % 5 < 2) continue;
      cells.push({
        x: 156 + x * 15,
        y: 56 + y * 15,
        d: ((x * 3 + y * 5) % 10) * 0.2,
      });
    }
  }
  return cells;
})();

/* Titik data SVM — seeded RNG yang sama dengan script asli (seed=7) */
const SVM_POINTS = (() => {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  return Array.from({ length: 34 }, (_, i) => {
    const A = i % 2 === 0;
    return {
      A,
      cx: A ? 40 + rnd() * 130 : 230 + rnd() * 130,
      cy: 15 + rnd() * 170,
      dl: rnd() * 2.6,
    };
  });
})();

const STACK = [
  "Node.js", "TypeScript", "Go", "PostgreSQL", "Flutter", "Laravel",
  "Python", "Docker", "MySQL", "Express.js",
];

function GithubLinks({ links }: { links: Array<{ label: string; href: string }> }) {
  return (
    <div className="ghs">
      {links.map((l) => (
        <a key={l.href} className="gh" href={l.href} rel="noopener">
          <svg viewBox="0 0 24 24">
            <use href="#gh" />
          </svg>
          {l.label}
        </a>
      ))}
    </div>
  );
}

const GH = {
  orderBackend: { label: "Backend", href: "https://github.com/Salman-artz/order-processing-system_backend" },
  orderFrontend: { label: "Frontend", href: "https://github.com/Salman-artz/order-processing-system_frontend" },
  absensiBackend: { label: "Backend API", href: "https://github.com/Salman-artz/absensi-dosen-backend" },
  absensiMobile: { label: "Aplikasi Mobile", href: "https://github.com/Salman-artz/absensi-dosen-mobile" },
  taskApi: { label: "API", href: "https://github.com/Salman-artz/task-project-management-api" },
  taskFrontend: { label: "Frontend (TaskFlow)", href: "https://github.com/Salman-artz/task-project-management-frontend" },
  ecommerceBackend: { label: "Backend", href: "https://github.com/Salman-artz/e-commerce_backend" },
  ecommerceFrontend: { label: "Frontend", href: "https://github.com/Salman-artz/e-commerce_frontend" },
  libraryApi: { label: "API", href: "https://github.com/Salman-artz/library-asset-management-api" },
  libraryFrontend: { label: "Frontend", href: "https://github.com/Salman-artz/Library-Asset-Management-Frontend" },
  profil: { label: "Buka di GitHub", href: "https://github.com/Salman-artz" },
} as const;

export default function Projects() {
  const railRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  /* infinite carousel: klon kartu + normalisasi scroll + drag mouse */
  useEffect(() => {
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
    const rail = railRef.current;
    const pv = prevRef.current;
    const nx = nextRef.current;
    if (!rail || !pv || !nx) return;

    const orig = Array.from(rail.querySelectorAll<HTMLElement>(".card"));
    const N = orig.length;

    const mk = (c: HTMLElement) => {
      const k = c.cloneNode(true) as HTMLElement;
      k.setAttribute("aria-hidden", "true");
      k.querySelectorAll("[id]").forEach((e) => e.removeAttribute("id"));
      k.querySelectorAll("a").forEach((a) => {
        (a as HTMLAnchorElement).tabIndex = -1;
      });
      return k;
    };

    const pre: HTMLElement[] = [];
    const post: HTMLElement[] = [];
    orig.map(mk).forEach((k) => {
      pre.push(k);
      rail.insertBefore(k, orig[0]);
    });
    orig.map(mk).forEach((k) => {
      post.push(k);
      rail.appendChild(k);
    });

    const stp = () => orig[1].offsetLeft - orig[0].offsetLeft;
    const pad = () => parseFloat(getComputedStyle(rail).scrollPaddingLeft || "20") || 20;
    const home = () => orig[0].offsetLeft - pad();
    const jump = (val: number) => {
      rail.style.scrollSnapType = "none";
      rail.scrollLeft = val;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          rail.style.scrollSnapType = "";
        });
      });
    };
    const norm = () => {
      const w = N * stp();
      const k = Math.round((rail.scrollLeft - home()) / w);
      if (k !== 0) jump(rail.scrollLeft - k * w);
    };
    const move = (n: number) =>
      rail.scrollBy({ left: n * stp(), behavior: rm ? "auto" : "smooth" });

    const onPrev = () => move(-1);
    const onNext = () => move(1);
    pv.addEventListener("click", onPrev);
    nx.addEventListener("click", onNext);

    let idle: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(idle);
      idle = setTimeout(norm, 140);
    };
    rail.addEventListener("scroll", onScroll, { passive: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        move(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        move(-1);
      }
    };
    rail.addEventListener("keydown", onKey);

    const onDragStart = (e: DragEvent) => e.preventDefault();
    rail.addEventListener("dragstart", onDragStart);

    let dn = false, sx0 = 0, sl0 = 0, mv = 0;
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      dn = true;
      mv = 0;
      sx0 = e.clientX;
      sl0 = rail.scrollLeft;
    };
    const onMove = (e: PointerEvent) => {
      if (!dn) return;
      const dx = e.clientX - sx0;
      if (Math.abs(dx) > 5) {
        mv = 1;
        rail.classList.add("drag");
      }
      if (mv) rail.scrollLeft = sl0 - dx;
    };
    const onUp = () => {
      if (!dn) return;
      dn = false;
      if (mv) {
        rail.classList.remove("drag");
        const st = stp();
        const h = home();
        rail.scrollTo({
          left: h + Math.round((rail.scrollLeft - h) / st) * st,
          behavior: rm ? "auto" : "smooth",
        });
      }
    };
    const onClickCapture = (e: MouseEvent) => {
      if (mv) {
        e.preventDefault();
        e.stopPropagation();
        mv = 0;
      }
    };
    rail.addEventListener("pointerdown", onDown);
    addEventListener("pointermove", onMove);
    addEventListener("pointerup", onUp);
    rail.addEventListener("click", onClickCapture, true);

    const onResize = () => norm();
    const onLoad = () => jump(home());
    addEventListener("resize", onResize);
    addEventListener("load", onLoad);
    jump(home());

    return () => {
      clearTimeout(idle);
      pv.removeEventListener("click", onPrev);
      nx.removeEventListener("click", onNext);
      rail.removeEventListener("scroll", onScroll);
      rail.removeEventListener("keydown", onKey);
      rail.removeEventListener("dragstart", onDragStart);
      rail.removeEventListener("pointerdown", onDown);
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerup", onUp);
      rail.removeEventListener("click", onClickCapture, true);
      removeEventListener("resize", onResize);
      removeEventListener("load", onLoad);
      pre.concat(post).forEach((n) => n.remove());
    };
  }, []);

  return (
    <section className="p" id="proyek">
      <h2 className="rv">Proyek di GitHub</h2>
      <p className="lead rv" style={v({ "--d": "100ms" })}>
        Geser atau seret kartu ke samping untuk melihat semua proyek.
      </p>
      <div
        className="carousel"
        role="group"
        aria-roledescription="carousel"
        aria-label="Daftar proyek"
      >
        <div
          className="rail rv"
          id="rail"
          ref={railRef}
          tabIndex={0}
          aria-label="Geser untuk melihat proyek"
        >
          {/* Order Processing System */}
          <article className="card">
            <div className="art">
              <svg
                viewBox="0 0 400 200"
                role="img"
                aria-label="Animasi pesan mengalir antar layanan Order, Inventory, Payment, Notification"
              >
                <rect className="nd" x="15" y="55" width="80" height="50" rx="10" />
                <rect className="nd n2" x="110" y="55" width="80" height="50" rx="10" />
                <rect className="nd n3" x="205" y="55" width="80" height="50" rx="10" />
                <rect className="nd n4" x="300" y="55" width="80" height="50" rx="10" />
                <text className="lbl" x="55" y="84">Order</text>
                <text className="lbl" x="150" y="84">Inventory</text>
                <text className="lbl" x="245" y="84">Payment</text>
                <text className="lbl" x="340" y="84">Notify</text>
                <circle className="pulse" cx="55" cy="130" r="7" />
                <line className="bus" x1="15" y1="130" x2="385" y2="130" />
                <text className="t" x="200" y="165" textAnchor="middle">NATS JetStream</text>
              </svg>
            </div>
            <div className="body">
              <h3>Order Processing System</h3>
              <p>
                Sistem pesanan event-driven dengan empat microservices dan Saga
                choreography. Tiap layanan punya database sendiri.
              </p>
              <ul className="tags">
                <li>Go</li><li>NATS</li><li>gRPC</li><li>PostgreSQL</li><li>Docker</li>
              </ul>
              <GithubLinks links={[GH.orderBackend, GH.orderFrontend]} />
            </div>
          </article>

          {/* Sistem Absensi */}
          <article className="card">
            <div className="art">
              <svg
                viewBox="0 0 400 200"
                role="img"
                aria-label="Animasi ponsel memindai QR code untuk absensi"
              >
                <rect x="140" y="10" width="120" height="180" rx="18" className="win" />
                <g id="qr">
                  {QR_CELLS.map((c, i) => (
                    <rect
                      key={i}
                      className="q"
                      x={c.x}
                      y={c.y}
                      width="11"
                      height="11"
                      rx="2"
                      style={v({ animationDelay: c.d + "s" })}
                    />
                  ))}
                </g>
                <rect className="scan" x="156" y="46" width="88" height="4" rx="2" />
                <circle className="ok" cx="200" cy="168" r="11" />
                <path
                  d="M194 168l4 4 8-8"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text className="t" x="300" y="100">QR Absensi</text>
                <text className="t" x="55" y="100" textAnchor="middle">16 pertemuan</text>
              </svg>
            </div>
            <div className="body">
              <h3>Sistem Absensi Dosen &amp; Presensi Mahasiswa</h3>
              <p>
                Absensi berbasis QR dengan JWT RBAC, notifikasi terjadwal,
                laporan PDF, dan aplikasi Flutter.
              </p>
              <ul className="tags">
                <li>Express.js</li><li>TypeScript</li><li>Prisma</li>
                <li>Flutter</li><li>Riverpod</li>
              </ul>
              <GithubLinks links={[GH.absensiBackend, GH.absensiMobile]} />
            </div>
          </article>

          {/* Klasifikasi SVM */}
          <article className="card">
            <div className="art">
              <svg
                viewBox="0 0 400 200"
                role="img"
                aria-label="Animasi titik data dipisahkan oleh batas keputusan SVM"
              >
                <g id="pts">
                  {SVM_POINTS.map((p, i) => (
                    <circle
                      key={i}
                      className={p.A ? "dA" : "dB"}
                      cx={p.cx}
                      cy={p.cy}
                      r="5"
                      style={v({ animationDelay: p.dl + "s" })}
                    />
                  ))}
                </g>
                <path className="bd" d="M150 10 C230 60 150 120 250 190" />
              </svg>
            </div>
            <div className="body">
              <h3>Klasifikasi Status Gizi Balita</h3>
              <p>
                Skripsi SVM Multiple Kernel Learning pada data IFLS-5 dengan
                akurasi hingga 99,3%, dalam aplikasi web Flask.
              </p>
              <ul className="tags">
                <li>Python</li><li>Flask</li><li>MySQL</li><li>SVM-MKL</li>
              </ul>
              <GithubLinks links={[GH.profil]} />
            </div>
          </article>

          {/* Task & Project Management API */}
          <article className="card">
            <div className="art">
              <svg
                viewBox="0 0 400 200"
                role="img"
                aria-label="Animasi kartu tugas berpindah dari To do ke Doing lalu Done"
              >
                <rect className="win" x="20" y="20" width="110" height="160" rx="10" />
                <rect className="win" x="145" y="20" width="110" height="160" rx="10" />
                <rect className="win" x="270" y="20" width="110" height="160" rx="10" />
                <text className="t" x="32" y="42">To do</text>
                <text className="t" x="157" y="42">Doing</text>
                <text className="t" x="282" y="42">Done</text>
                <rect className="tk" x="32" y="94" width="86" height="22" rx="6" />
                <rect className="tk" x="157" y="94" width="86" height="22" rx="6" />
                <rect className="tk" x="282" y="58" width="86" height="22" rx="6" />
                <rect className="tk" x="282" y="90" width="86" height="22" rx="6" />
                <rect className="mvk" x="32" y="58" width="86" height="22" rx="6" />
              </svg>
            </div>
            <div className="body">
              <h3>Task &amp; Project Management API</h3>
              <p>
                API manajemen tugas dan proyek dengan pembaruan real-time lewat
                Socket.io.
              </p>
              <ul className="tags">
                <li>Node.js</li><li>TypeScript</li><li>PostgreSQL</li><li>Socket.io</li>
              </ul>
              <GithubLinks links={[GH.taskApi, GH.taskFrontend]} />
            </div>
          </article>

          {/* E-Commerce API */}
          <article className="card">
            <div className="art">
              <svg
                viewBox="0 0 400 200"
                role="img"
                aria-label="Animasi produk dan bilah pembayaran yang selesai"
              >
                <rect className="pr" x="40" y="28" width="100" height="70" rx="10" />
                <rect
                  className="pr"
                  style={v({ animationDelay: ".4s" })}
                  x="150" y="28" width="100" height="70" rx="10"
                />
                <rect
                  className="pr"
                  style={v({ animationDelay: ".8s" })}
                  x="260" y="28" width="100" height="70" rx="10"
                />
                <rect className="win" x="40" y="126" width="290" height="16" rx="8" />
                <rect className="ln l2" x="40" y="126" width="290" height="16" rx="8" />
                <circle className="ok" cx="356" cy="134" r="12" />
                <path
                  d="M350 134l4 4 8-8"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <text className="t" x="40" y="170">Midtrans &amp; Xendit</text>
              </svg>
            </div>
            <div className="body">
              <h3>E-Commerce API</h3>
              <p>
                API toko online dengan alur pembayaran terintegrasi Midtrans dan
                Xendit.
              </p>
              <ul className="tags">
                <li>Node.js</li><li>TypeScript</li><li>PostgreSQL</li>
                <li>Midtrans</li><li>Xendit</li>
              </ul>
              <GithubLinks links={[GH.ecommerceBackend, GH.ecommerceFrontend]} />
            </div>
          </article>

          {/* Library & Asset Management API */}
          <article className="card">
            <div className="art">
              <svg
                viewBox="0 0 400 200"
                role="img"
                aria-label="Animasi buku terangkat saat dipindai"
              >
                <line
                  x1="30" y1="152" x2="370" y2="152"
                  stroke="var(--line)" strokeWidth="3"
                />
                <rect className="bk" style={v({ "--k": 0, fill: "var(--a1)" })} x="50" y="60" width="38" height="90" rx="4" />
                <rect className="bk" style={v({ "--k": 1, fill: "var(--a2)" })} x="98" y="40" width="38" height="110" rx="4" />
                <rect className="bk" style={v({ "--k": 2, fill: "var(--a3)" })} x="146" y="70" width="38" height="80" rx="4" />
                <rect className="bk" style={v({ "--k": 3, fill: "var(--a1)" })} x="194" y="50" width="38" height="100" rx="4" />
                <rect className="bk" style={v({ "--k": 4, fill: "var(--a2)" })} x="242" y="55" width="38" height="95" rx="4" />
                <rect className="bk" style={v({ "--k": 5, fill: "var(--a3)" })} x="290" y="65" width="38" height="85" rx="4" />
                <rect className="hs" x="30" y="30" width="3" height="125" />
                <text className="t" x="30" y="180">Laravel &amp; MySQL</text>
              </svg>
            </div>
            <div className="body">
              <h3>Library &amp; Asset Management API</h3>
              <p>
                API pengelolaan perpustakaan dan aset berbasis Laravel dengan
                database MySQL.
              </p>
              <ul className="tags">
                <li>PHP</li><li>Laravel</li><li>MySQL</li>
              </ul>
              <GithubLinks links={[GH.libraryApi, GH.libraryFrontend]} />
            </div>
          </article>
        </div>

        <button
          className="cbtn prev"
          ref={prevRef}
          type="button"
          aria-label="Proyek sebelumnya"
        >
          <svg viewBox="0 0 24 24">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <button
          className="cbtn next"
          ref={nextRef}
          type="button"
          aria-label="Proyek berikutnya"
        >
          <svg viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="marq" id="stack" aria-label="Teknologi yang saya gunakan">
        <div className="track">
          {[0, 1].map((k) =>
            STACK.map((s, i) => (
              <span key={`${k}-${i}`}>{s}</span>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
