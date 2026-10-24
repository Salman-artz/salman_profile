"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";

const v = (o: Record<string, string | number>) => o as CSSProperties;

/* Counter animasi .num — port dari script asli (data-to, data-dec, cubic-ease 1.5s) */
function CountNum({ to, dec }: { to: number; dec?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rm = matchMedia("(prefers-reduced-motion:reduce)").matches;
    if (rm) {
      el.textContent = to.toFixed(dec || 0);
      return;
    }
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          cio.unobserve(el);
          let t0: number | null = null;
          const f = (t: number) => {
            if (!t0) t0 = t;
            const pr = Math.min(1, (t - t0) / 1500);
            el.textContent = (to * (1 - Math.pow(1 - pr, 3))).toFixed(dec || 0);
            if (pr < 1) requestAnimationFrame(f);
          };
          requestAnimationFrame(f);
        });
      },
      { threshold: 0.6 }
    );
    cio.observe(el);
    return () => cio.disconnect();
  }, [to, dec]);

  return (
    <span className="num" ref={ref}>
      0
    </span>
  );
}

const STATS = [
  { to: 3.84, dec: 2, prefix: "", suffix: "", label: "IPK dari 4.00", d: "" },
  { to: 1, dec: 0, prefix: "", suffix: " tahun", label: "Backend Engineer", d: "90ms" },
  { to: 8, dec: 0, prefix: "", suffix: "", label: "Proyek portofolio", d: "180ms" },
  { to: 6, dec: 0, prefix: "", suffix: "", label: "Asisten praktikum", d: "270ms" },
];

const COURSES = [
  { period: "Genap 2025/2026", name: "Digital System", d: "0ms" },
  { period: "Genap 2025/2026", name: "Pemrograman Berorientasi Objek", d: "70ms" },
  { period: "Genap 2024/2025", name: "Pemrograman Web", d: "140ms" },
  { period: "Ganjil 2024/2025", name: "Struktur Data", d: "210ms" },
  { period: "Genap 2023/2024", name: "Pemrograman Berorientasi Objek", d: "280ms" },
  { period: "Ganjil 2023/2024", name: "Algoritma & Pemrograman 1", d: "350ms" },
];

const ORGS = [
  {
    role: "Ketua Komunitas Weboender",
    period: "Juli 2024 – Juni 2025",
    text:
      "Memimpin komunitas developer Weboender dan mengoordinasikan kegiatan belajar bersama serta sharing session seputar pengembangan web.",
    d: "400ms",
  },
  {
    role: "Divisi Religi, Himpunan Mahasiswa Teknik Informatika",
    period: "Juli 2024 – Juni 2025",
    text: "Mengorganisasi kegiatan keagamaan untuk mahasiswa Teknik Informatika.",
    d: "750ms",
  },
  {
    role: "Developer & Speaker, Komunitas Weboender",
    period: "Juli 2023 – Juni 2024",
    text:
      "Menjadi pembicara dalam sesi sharing teknis tentang pengembangan aplikasi web dan berkontribusi sebagai developer di proyek komunitas.",
    d: "1100ms",
  },
];

const JOBS = [
  {
    badge: "Juni 2025 – Juni 2026",
    title: "Backend Engineer",
    company: "PT. cmlabs Indonesia Digital",
    points: [
      "Mengembangkan dan memelihara REST API dengan PHP Laravel, Go, dan TypeScript.",
      "Merancang skema database MySQL/PostgreSQL dan mengoptimalkan query untuk meningkatkan performa aplikasi.",
      "Berkolaborasi dengan tim frontend dan QA dalam siklus pengembangan dengan Git/GitHub.",
    ],
  },
];

export default function Journey() {
  return (
    <section className="p" id="perjalanan">
      <h2 className="rv">Perjalanan</h2>
      <p className="lead rv" style={v({ "--d": "100ms" })}>
        Pengalaman kerja, mengajar, berorganisasi, dan pendidikan saya.
      </p>

      <div className="stats">
        {STATS.map((s) => (
          <div key={s.label} className="st rv" style={s.d ? v({ "--d": s.d }) : undefined}>
            <b>
              <CountNum to={s.to} dec={s.dec} />{s.suffix}
            </b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <h3 className="sub rv">Pengalaman kerja</h3>
      {JOBS.map((j) => (
        <article key={j.title} className="job rv">
          <div>
            <span className="bdg">{j.badge}</span>
            <h4>{j.title}</h4> <span className="co">{j.company}</span>
            <ul>
              {j.points.map((p) => (
                <li key={p.slice(0, 24)}>{p}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}

      <h3 className="sub rv">Asisten praktikum dan mengajar</h3>
      <p className="lead rv" style={{ marginBottom: "1.25rem" }}>
        Fakultas Sains dan Teknologi, UIN Maulana Malik Ibrahim Malang. Selain
        itu saya juga mengajar sebagai dosen praktisi di institusi vokasi.
      </p>
      <div className="ta">
        {COURSES.map((c, i) => (
          <div key={`${c.name}-${c.period}-${i}`} className="tc rv" style={v({ "--d": c.d })}>
            <small>{c.period}</small>
            <b>{c.name}</b>
          </div>
        ))}
      </div>

      <h3 className="sub rv">Organisasi dan volunteer</h3>
      <ol className="tlo rv">
        {ORGS.map((o) => (
          <li key={o.role} style={v({ "--d": o.d })}>
            <b>{o.role}</b>
            <small>{o.period}</small>
            <p>{o.text}</p>
          </li>
        ))}
      </ol>

      <h3 className="sub rv">Pendidikan</h3>
      <div className="edu2">
        <div className="ed rv">
          <small>2022 – 2026</small>
          <h4>S1 Teknik Informatika</h4>
          <span className="co">UIN Maulana Malik Ibrahim Malang</span>
          <div className="big gr">
            <CountNum to={3.84} dec={2} />
            <small> / 4.00</small>
          </div>
          <p>
            Skripsi: klasifikasi status gizi (stunting) pada balita dengan
            Support Vector Machine dan Multiple Kernel Learning (kernel Linear
            dan RBF), implementasi web dengan Flask dan MySQL.
          </p>
        </div>
        <div className="ed rv" style={v({ "--d": "120ms" })}>
          <small>2019 – 2022</small>
          <h4>SMK Telkom Malang</h4>
          <span className="co">Rekayasa Perangkat Lunak</span>
          <div className="big gr">
            <CountNum to={85} />
            <small> nilai rata-rata</small>
          </div>
          <p>Sawojajar, Kedungkandang, Kota Malang, Jawa Timur.</p>
        </div>
      </div>

      <h3 className="sub rv">Sertifikasi</h3>
      <div className="edu2">
        <div className="ed rv">
          <small>Udemy, Programmer Zaman Now</small>
          <h4>Pemrograman Go-Lang: Pemula sampai Mahir</h4>
          <span className="co">43 jam</span>
        </div>
        <div className="ed rv" style={v({ "--d": "100ms" })}>
          <small>Udemy, Programmer Zaman Now</small>
          <h4>NodeJS: Pemula sampai Mahir</h4>
          <span className="co">27,5 jam</span>
        </div>
      </div>

      <h3 className="sub rv">Bahasa</h3>
      <div className="edu2">
        <div className="ed rv">
          <small>Native</small>
          <h4>Bahasa Indonesia</h4>
        </div>
        <div className="ed rv" style={v({ "--d": "100ms" })}>
          <small>Profesional</small>
          <h4>Bahasa Inggris</h4>
        </div>
      </div>
    </section>
  );
}
