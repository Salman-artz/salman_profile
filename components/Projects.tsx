"use client";

import type { CSSProperties } from "react";
import { useEffect, useRef, useState, useCallback } from "react";

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

interface ProjectItem {
  id: number;
  title: string;
  modalTitle: string;
  subtitle: string;
  shortDesc: string;
  modalDesc: string;
  tags: string[];
  features: string[];
  mobile?: boolean;
  links: Array<{ label: string; href: string }>;
  screenshots: Array<{ src: string; alt: string; w: number; h: number }>;
  art: React.ReactNode;
}

const PROJECTS: ProjectItem[] = [
  {
    id: 0,
    title: "Order Processing System",
    modalTitle: "Order Processing System — Microservices Terdistribusi",
    subtitle: "Backend & Microservices · Event-Driven",
    shortDesc:
      "Platform pemrosesan pesanan throughput tinggi berbasis 4 microservices mandiri dengan Saga Choreography, NATS JetStream, gRPC, PostgreSQL terisolasi, dan dashboard Next.js real-time via WebSocket.",
    modalDesc:
      "Platform pemrosesan pesanan terdistribusi dengan throughput tinggi yang dirancang menggunakan arsitektur microservices berbasis event (event-driven). Terdiri dari 4 domain services mandiri (Order, Inventory, Payment, dan Notification Service) dengan database PostgreSQL terisolasi pada masing-masing layanan (Database-per-Service pattern).",
    tags: ["Go (Golang)", "Fiber", "PostgreSQL", "NATS JetStream", "gRPC", "Protocol Buffers", "Next.js", "Docker", "WebSocket"],
    features: [
      "Dekomposisi 4 Microservices: Layanan Order, Inventory, Payment, dan Notification independen dengan Go dan Fiber",
      "Distributed Saga Choreography: Menjaga konsistensi data lintas layanan dengan transaksi kompensasi otomatis saat pembayaran atau alokasi stok gagal",
      "Event Streaming NATS JetStream: Pub/Sub pesan asinkron terjamin dengan persistent stream dan consumer acknowledgement",
      "Komunikasi Sinkron gRPC: Pertukaran data antar-service berkecepatan tinggi dengan Protobuf binary serialization",
      "Database PostgreSQL Terisolasi: Isolasi data penuh per-service dengan transaksi ACID untuk integritas pesanan",
      "Saga Timeline & Real-Time Cockpit: Frontend Next.js dengan visualisasi status alur Saga dan monitoring via WebSocket",
    ],
    links: [
      { label: "Backend Go", href: "https://github.com/Salman-artz/order-processing-system_backend" },
      { label: "Frontend Next.js", href: "https://github.com/Salman-artz/order-processing-system_frontend" },
    ],
    screenshots: [
      { src: "/projects/order-processing/foto1_customer_storefront_order.png", alt: "Customer storefront dan pemesanan produk", w: 2732, h: 1536 },
      { src: "/projects/order-processing/foto2_saga_execution_timeline_ui.png", alt: "Saga execution timeline dan status kompensasi rollback", w: 2732, h: 1536 },
      { src: "/projects/order-processing/foto3_realtime_order_monitoring_dashboard.png", alt: "Real-time order monitoring dashboard & JetStream metrics", w: 2732, h: 1536 },
      { src: "/projects/order-processing/foto4_inventory_reservation_rollback.png", alt: "Inventory stock reservation ledger dan rollback UI", w: 2732, h: 1536 },
    ],
    art: (
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
    ),
  },
  {
    id: 1,
    title: "Sistem Absensi Dosen & Mahasiswa",
    modalTitle: "Sistem Absensi Akademik Mobile QR Code (Dosen & Mahasiswa)",
    subtitle: "Mobile & API · Flutter & Express",
    shortDesc:
      "Solusi presensi perkuliahan berbasis mobile Flutter dan REST API Express dengan scan QR Code dinamis terenkripsi, manajemen 16 pertemuan, pengajuan izin, dan ekspor laporan PDF/Excel.",
    modalDesc:
      "Solusi absensi perkuliahan berbasis mobile lintas platform untuk memodernisasi pencatatan kehadiran mahasiswa dan dosen di lingkungan kampus perguruan tinggi, mencakup 16 pertemuan perkuliahan per semester dengan validasi waktu nyata.",
    tags: ["Flutter", "Dart", "Riverpod", "Express.js", "TypeScript", "PostgreSQL", "Prisma ORM", "Scalar / OpenAPI", "Jest"],
    mobile: true,
    features: [
      "Verifikasi QR Code Dinamis: Scan kode QR terenkripsi yang disegarkan berkala untuk mencegah manipulasi kehadiran dan titip absen",
      "Arsitektur Mobile Flutter: State management Riverpod, penyimpanan cache lokal, dan notifikasi jadwal kuliah",
      "Autentikasi JWT & RBAC: Hak akses berjenjang untuk Dosen (buka kelas & verifikasi), Mahasiswa (scan & izin), dan Admin",
      "Manajemen Izin & Cuti: Pengajuan surat izin/sakit dengan unggah dokumen bukti serta kalkulasi otomatis persentase kehadiran",
      "Portal Rekapitulasi Admin: Impor massal data mahasiswa via format Excel dan ekspor rekap presensi dalam format PDF resmi",
      "Dokumentasi API Scalar/OpenAPI: Spesifikasi kontrak API modern untuk sinkronisasi lancar antara mobile client dan backend",
    ],
    links: [
      { label: "Backend API", href: "https://github.com/Salman-artz/absensi-dosen-backend" },
      { label: "Aplikasi Mobile", href: "https://github.com/Salman-artz/absensi-dosen-mobile" },
    ],
    screenshots: [
      { src: "/projects/absensi/foto1_jadwal_kuliah_presensi_nordic.png", alt: "Jadwal kuliah dan riwayat presensi mobile", w: 412, h: 900 },
      { src: "/projects/absensi/foto2_presensi_pertemuan_bulk.png", alt: "Presensi pertemuan dosen dan mahasiswa per kelas", w: 412, h: 900 },
      { src: "/projects/absensi/foto3_ekspor_modal_pdf_excel.png", alt: "Modal ekspor laporan presensi PDF dan Excel", w: 412, h: 900 },
      { src: "/projects/absensi/foto4_login_autentikasi_nordic.png", alt: "Layar login autentikasi aplikasi mobile presensi", w: 412, h: 900 },
    ],
    art: (
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
    ),
  },
  {
    id: 2,
    title: "Apotek Digital",
    modalTitle: "Apotek Digital — Platform SaaS Multi-Tenant Manajemen Apotek",
    subtitle: "Full-Stack · SaaS Multi-Tenant",
    shortDesc:
      "Platform SaaS multi-tenant apotek: POS kasir FEFO, row-locking SELECT FOR UPDATE, manajemen stok batch, akuntansi, integrasi SatuSehat Kemenkes (HL7 FHIR), dan AI Asisten Gemini.",
    modalDesc:
      "Platform SaaS multi-tenant yang dirancang menyeluruh untuk digitalisasi operasional apotek, manajemen stok obat, akuntansi, dan kepatuhan regulasi kesehatan dengan isolasi data ketat pada level database untuk privasi antar tenant.",
    tags: ["Next.js 14", "Hono.js", "TypeScript", "Drizzle ORM", "PostgreSQL", "Tailwind CSS", "Google Gemini API", "SatuSehat HL7 FHIR"],
    features: [
      "Arsitektur Multi-Tenancy: Isolasi data ketat antar-apotek tenant dengan skema database tersegregasi",
      "POS Kasir & Mesin Stok FEFO: Pengurangan stok berbasis First Expired First Out dengan database ACID transactions",
      "Pessimistic Row-Locking: Menggunakan SELECT FOR UPDATE untuk mencegah race condition (overselling) saat transaksi kasir simultan",
      "Integrasi SatuSehat Kemenkes: Implementasi standar HL7 FHIR untuk pelaporan resep elektronik dan rekam medis kefarmasian",
      "Keamanan Berlapis: 6 level RBAC, autentikasi stateless JWT HttpOnly cookie, CORS strict whitelist, dan rate limiting",
      "AI Smart Assistant Gemini: Integrasi Google Gemini API untuk rekomendasi restock otomatis dan analisis tren kadaluarsa",
      "Frontend Next.js 14 App Router: 31 halaman produksi siap pakai dengan dashboard analitik dan ekspor laporan keuangan",
    ],
    links: [
      { label: "Backend API", href: "https://github.com/Salman-artz/SaasApotek_API" },
      { label: "Frontend Web", href: "https://github.com/Salman-artz/SaasApotek_Frontend" },
    ],
    screenshots: [
      { src: "/projects/apotek/foto1_pos_kasir_fefo.png", alt: "Point of Sales FEFO kasir apotek", w: 2880, h: 1800 },
      { src: "/projects/apotek/foto2_inventaris_batch_obat.png", alt: "Inventaris obat dan monitoring tanggal kadaluarsa", w: 2880, h: 1800 },
      { src: "/projects/apotek/foto3_satusehat_kemenkes.png", alt: "Integrasi SatuSehat API Kemenkes HL7 FHIR", w: 2880, h: 1800 },
      { src: "/projects/apotek/foto4_ai_assistant_gemini.png", alt: "AI Asisten Farmasi bertenaga Google Gemini", w: 2880, h: 1800 },
    ],
    art: (
      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label="Animasi kapsul obat, palang apotek, dan grafik stok"
      >
        <path
          className="ok"
          d="M72 62h16v22h22v16H88v22H72v-22H50V84h22z"
        />
        <g className="cap">
          <rect x="110" y="128" width="64" height="28" rx="14" fill="var(--a1)" />
          <rect x="142" y="128" width="32" height="28" rx="14" fill="var(--a3)" />
        </g>
        <rect className="bar" x="215" y="60" width="24" height="90" rx="5" />
        <rect
          className="bar"
          style={v({ animationDelay: ".4s" })}
          x="250" y="60" width="24" height="90" rx="5"
        />
        <rect
          className="bar"
          style={v({ animationDelay: ".8s" })}
          x="285" y="60" width="24" height="90" rx="5"
        />
        <rect
          className="bar"
          style={v({ animationDelay: "1.2s" })}
          x="320" y="60" width="24" height="90" rx="5"
        />
        <line x1="205" y1="152" x2="355" y2="152" stroke="var(--line)" strokeWidth="3" />
        <text className="t" x="205" y="180">POS FEFO &amp; SatuSehat</text>
      </svg>
    ),
  },
  {
    id: 3,
    title: "Administrasi Teh Baling Indonesia",
    modalTitle: "Administrasi Teh Baling — ERP Operasional Jaringan Booth Minuman",
    subtitle: "Full-Stack · ERP Operasional Booth",
    shortDesc:
      "ERP operasional franchise multi-outlet: presensi geofencing GPS (Haversine 200m), audit stok bahan baku & cup harian, shift kasir, dashboard visual Recharts, dan ekspor ExcelJS.",
    modalDesc:
      "Sistem ERP operasional end-to-end yang dibangun untuk jaringan franchise minuman guna mengelola pergantian shift harian, pelacakan stok cup, dan rekapitulasi penjualan multi-outlet secara terpusat dan akurat.",
    tags: ["Next.js 14", "Hono.js", "TypeScript", "Drizzle ORM", "PostgreSQL", "Leaflet", "Recharts", "ExcelJS", "Tailwind CSS"],
    features: [
      "Presensi Geofencing GPS: Validasi kehadiran penjaga booth berbasis formula Haversine dengan radius presisi 200 meter dari titik booth",
      "Peta Sebaran Booth Leaflet: Visualisasi interaktif lokasi seluruh booth outlet pada peta OpenStreetMap",
      "Audit & Pengawasan Stok Cup: Pelacakan real-time penggunaan bahan baku dan cup terhadap transaksi untuk mencegah kebocoran stok",
      "Dashboard Analitik Recharts: Grafik tren penjualan harian, jam sibuk outlet, dan perbandingan performa kasir",
      "Ekspor Laporan ExcelJS: Generator laporan keuangan dan rekap penjualan otomatis ke file Excel (.xlsx) dengan proteksi formula injection",
      "Keamanan & RBAC: 3 level hak akses (Super Admin, Tim Produksi, Penjaga Booth) dan middleware audit log untuk mencatat aktivitas sistem",
    ],
    links: [
      { label: "Backend API", href: "https://github.com/Salman-artz/teh-baling-backend" },
      { label: "Frontend Web", href: "https://github.com/Salman-artz/teh-baling-frontend" },
    ],
    screenshots: [
      { src: "/projects/teh-baling/foto1_peta_booth_leaflet.png", alt: "Peta pemantauan sebaran booth dengan Leaflet", w: 1895, h: 905 },
      { src: "/projects/teh-baling/foto2_presensi_geofencing_gps.png", alt: "Presensi pegawai geofencing GPS radius 200m", w: 3200, h: 2000 },
      { src: "/projects/teh-baling/foto3_dashboard_analitik_recharts.png", alt: "Dashboard analitik penjualan outlet dengan Recharts", w: 3200, h: 2000 },
      { src: "/projects/teh-baling/foto4_audit_stok_cup.png", alt: "Audit stok cup dan bahan baku harian", w: 1899, h: 918 },
    ],
    art: (
      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label="Animasi geofence 200 meter dengan pin dan pegawai yang bergerak"
      >
        <path
          d="M20 60H380M20 140H380M90 20V180M230 20V180M320 20V180"
          stroke="var(--line)" strokeWidth="6" fill="none"
        />
        <circle className="bus" cx="200" cy="100" r="62" fill="none" />
        <circle className="rg" cx="200" cy="100" r="20" />
        <path
          d="M200 120c-10-14-16-22-16-32a16 16 0 0 1 32 0c0 10-6 18-16 32z"
          fill="var(--a3)"
        />
        <circle cx="200" cy="88" r="5" fill="#fff" />
        <circle className="wk" cx="110" cy="100" r="6" fill="var(--a1)" />
        <text className="t" x="20" y="192">Geofence 200 m, Haversine</text>
      </svg>
    ),
  },
  {
    id: 4,
    title: "Pustaka Sentral",
    modalTitle: "Pustaka Sentral — Sistem Informasi Perpustakaan & Sirkulasi Koleksi",
    subtitle: "Full-Stack · Sistem Informasi Perpustakaan",
    shortDesc:
      "Platform sirkulasi buku modern: peminjaman kilat, kalkulator denda Rp 3.000/hari, scanner ISBN/barcode, grafik analitik terpopuler, dan penerbitan Surat Bebas Pustaka QR Code.",
    modalDesc:
      "Platform sistem informasi perpustakaan terpadu berbasis web untuk otomatisasi sirkulasi buku, pelacakan keterlambatan, kas denda presisi, analitik koleksi terpopuler, dan penerbitan surat bebas pustaka resmi berstandar yudisium.",
    tags: ["PHP 8.3", "Laravel 13", "MySQL", "React 18", "Vite 5", "Tailwind CSS", "Laravel Sanctum", "Clean Architecture", "Lucide Icons"],
    features: [
      "Meja Sirkulasi Cepat: Fast check-in dan check-out dengan durasi adaptif 7, 14, atau 30 hari serta antrean reservasi buku",
      "Kalkulator Denda Presisi: Perhitungan otomatis denda keterlambatan (Rp 3.000 per hari) saat pengembalian dan pencatatan kas denda",
      "Barcode & ISBN Scanner: Pencarian instan kode ISBN/barcode serta modal pencetakan stiker thermal label barcode standar perpustakaan",
      "Grafik Analitik Koleksi: Horizontal bar chart interaktif untuk peringkat buku terpopuler dan persentase utilisasi kategori literatur",
      "Surat Bebas Pustaka Resmi: Penerbitan Surat Keterangan Bebas Perpustakaan (SKBP) dengan QR Code verifikasi digital dan tanda tangan resmi",
      "Clean Architecture: Penerapan Repository-Service pattern memisahkan domain logic, transaksi database ACID, dan Laravel Sanctum RBAC",
    ],
    links: [
      { label: "Backend API", href: "https://github.com/Salman-artz/library-asset-management-api" },
      { label: "Frontend Web", href: "https://github.com/Salman-artz/Library-Asset-Management-Frontend" },
    ],
    screenshots: [
      { src: "/projects/pustaka-sentral/40_admin_dashboard_view.png", alt: "Dashboard administrator dan meja sirkulasi perpustakaan", w: 1366, h: 768 },
      { src: "/projects/pustaka-sentral/41_staff_sirkulasi_view.png", alt: "Meja sirkulasi staff, peminjaman kilat dan barcode scanner", w: 1366, h: 768 },
      { src: "/projects/pustaka-sentral/42_member_portal_view.png", alt: "Portal anggota peminjaman koleksi dan riwayat denda", w: 1366, h: 768 },
      { src: "/projects/pustaka-sentral/12_surat_bebas_pustaka_official.png", alt: "Penerbitan Surat Bebas Pustaka resmi dengan QR code", w: 958, h: 888 },
    ],
    art: (
      <svg
        viewBox="0 0 400 200"
        role="img"
        aria-label="Animasi grafik buku terpopuler dan pemindai barcode"
      >
        <rect className="hb" style={v({ fill: "var(--a1)" })} x="30" y="36" width="190" height="18" rx="5" />
        <rect className="hb" style={v({ fill: "var(--a2)", animationDelay: ".3s" })} x="30" y="68" width="150" height="18" rx="5" />
        <rect className="hb" style={v({ fill: "var(--a3)", animationDelay: ".6s" })} x="30" y="100" width="110" height="18" rx="5" />
        <rect className="hb" style={v({ fill: "var(--a1)", animationDelay: ".9s" })} x="30" y="132" width="70" height="18" rx="5" />
        <rect x="262" y="40" width="6" height="60" fill="var(--ink)" />
        <rect x="270" y="40" width="4" height="60" fill="var(--ink)" />
        <rect x="276" y="40" width="8" height="60" fill="var(--ink)" />
        <rect x="286" y="40" width="4" height="60" fill="var(--ink)" />
        <rect x="296" y="40" width="2" height="60" fill="var(--ink)" />
        <rect x="302" y="40" width="2" height="60" fill="var(--ink)" />
        <rect x="310" y="40" width="4" height="60" fill="var(--ink)" />
        <rect x="316" y="40" width="8" height="60" fill="var(--ink)" />
        <rect x="326" y="40" width="4" height="60" fill="var(--ink)" />
        <rect className="bs" x="258" y="32" width="3" height="76" rx="1.5" />
        <text className="t" x="30" y="180">Sirkulasi, ISBN, SKBP</text>
      </svg>
    ),
  },
  {
    id: 5,
    title: "Task & Project Management",
    modalTitle: "Platform Manajemen Proyek & Tugas Berbasis Real-Time Workspace",
    subtitle: "Full-Stack · Kolaborasi Tim Real-Time",
    shortDesc:
      "Platform manajemen sprint tim multi-workspace dengan papan Kanban interaktif, kolaborasi komentar real-time via Socket.io, upload Cloudinary, dan dokumentasi API Swagger.",
    modalDesc:
      "Aplikasi manajemen kerja kolaboratif berbasis multi-workspace yang dirancang untuk membantu tim mengelola sprint proyek, penugasan tugas, dan berkolaborasi secara real-time tanpa delay.",
    tags: ["Node.js", "Express.js", "TypeScript", "MySQL", "Sequelize ORM", "Socket.io", "Next.js", "Tailwind CSS", "Swagger UI"],
    features: [
      "Papan Kanban Fleksibel: Visualisasi alur kerja tim (To-Do, In-Progress, Review, Done) dengan kartu tugas interaktif",
      "RBAC Multi-Workspace: Struktur ruang kerja fleksibel dengan izin berjenjang (Owner, Admin, Member, dan Viewer) menjaga privasi proyek",
      "Sinkronisasi Real-Time: Integrasi Socket.io untuk pembaruan status tugas, penugasan anggota, dan aktivitas komentar instan",
      "Pengelolaan Media Cloudinary: Unggah dan optimasi berkas dokumen/gambar lampiran task dengan validasi ekstensi dan batas ukuran",
      "Arsitektur Layered MVC: Backend Express.js & TypeScript terstruktur dengan Sequelize ORM dan database MySQL",
      "Dokumentasi API Swagger: Spesifikasi REST API interaktif berstandar OpenAPI 3.0 untuk mempermudah integrasi frontend Next.js",
    ],
    links: [
      { label: "Backend API", href: "https://github.com/Salman-artz/task-project-management-api" },
      { label: "Frontend Web", href: "https://github.com/Salman-artz/task-project-management-frontend" },
    ],
    screenshots: [
      { src: "/projects/task-management/foto1_kanban_board_proyek.png", alt: "Kanban board sprint proyek tim", w: 2880, h: 1800 },
      { src: "/projects/task-management/foto2_detail_task_live_komentar.png", alt: "Detail task dan live komentar Socket.io", w: 2880, h: 1800 },
      { src: "/projects/task-management/foto3_manajemen_ruang_kerja_rbac.png", alt: "Pengaturan ruang kerja multi-workspace dan RBAC", w: 2880, h: 1800 },
      { src: "/projects/task-management/foto4_dokumentasi_api_swagger.png", alt: "Dokumentasi REST API Swagger UI", w: 2880, h: 1800 },
    ],
    art: (
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
    ),
  },
  {
    id: 6,
    title: "E-Commerce Full-Stack",
    modalTitle: "Platform E-Commerce Modern & Admin Backoffice",
    subtitle: "Full-Stack · Toko Online & Backoffice",
    shortDesc:
      "Sistem toko online full-stack: transaksi atomik aman dari race condition stok, auto-cancel order kadaluarsa, webhook Midtrans/Xendit, dan frontend Nuxt 4 + Vue 3 SSR.",
    modalDesc:
      "Sistem e-commerce full-stack yang andal untuk menangani alur transaksi penjualan online mulai dari katalog produk, keranjang belanja, hingga pembayaran otomatis dengan perlindungan race condition stok.",
    tags: ["Node.js", "Express.js", "TypeScript", "Prisma ORM", "MySQL", "Nuxt 4", "Vue 3", "Midtrans", "Xendit", "Tailwind CSS"],
    features: [
      "Transaksi Checkout Atomik: Transaksi database untuk menjamin validasi stok tidak mengalami double-spending saat lonjakan transaksi simultan",
      "Otomasi Siklus Pesanan: Penjadwal otomatis pembatalan pesanan tertunda (pending) yang melewati batas waktu pembayaran",
      "Integrasi Payment Gateway: Dukungan webhook aman untuk Midtrans Snap dan Xendit dengan validasi signature verifikasi status lunas",
      "Autentikasi Dual-Token JWT: Access token berdurasi singkat dipadu refresh token rotation di database untuk keamanan sesi pengguna",
      "Frontend Nuxt 4 & Vue 3: Dukungan Server-Side Rendering (SSR) untuk SEO, keranjang belanja persisten, dan admin backoffice pesanan",
      "Manajemen Backoffice: Dashboard pengelola toko untuk update status pengiriman, manajemen variasi produk, dan rekapitulasi omset",
    ],
    links: [
      { label: "Backend API", href: "https://github.com/Salman-artz/e-commerce_backend" },
      { label: "Frontend Storefront", href: "https://github.com/Salman-artz/e-commerce_frontend" },
    ],
    screenshots: [
      { src: "/projects/ecommerce/foto1_storefront_katalog_produk.png", alt: "Storefront katalog produk fashion modern", w: 2160, h: 1350 },
      { src: "/projects/ecommerce/foto2_keranjang_halaman_checkout.png", alt: "Halaman keranjang dan form checkout transaksi", w: 2160, h: 1350 },
      { src: "/projects/ecommerce/foto3_integrasi_pembayaran_midtrans.png", alt: "Integrasi payment gateway Midtrans dan Xendit", w: 2160, h: 1350 },
      { src: "/projects/ecommerce/foto4_admin_order_backoffice.png", alt: "Dashboard admin order dan manajemen pesanan", w: 2160, h: 1350 },
    ],
    art: (
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
    ),
  },
  {
    id: 7,
    title: "Klasifikasi Status Gizi Balita",
    modalTitle: "Sistem Klasifikasi Status Gizi Balita (Stunting) — SVM & MKL",
    subtitle: "Machine Learning · Penelitian Skripsi",
    shortDesc:
      "Skripsi: klasifikasi stunting dengan SVM dan Multiple Kernel Learning (Linear + RBF) pada data IFLS-5 dengan akurasi 99,3%, diimplementasikan ke aplikasi web Flask & MySQL.",
    modalDesc:
      "Penelitian skripsi untuk mendeteksi dan mengklasifikasikan status gizi serta risiko stunting pada balita menggunakan Support Vector Machine (SVM) dengan Multiple Kernel Learning (MKL) menggabungkan kernel Linear dan RBF pada dataset IFLS-5.",
    tags: ["Python", "Flask", "MySQL", "Support Vector Machine (SVM)", "Multiple Kernel Learning (MKL)", "Scikit-Learn", "Pandas", "NumPy"],
    features: [
      "Multiple Kernel Learning (MKL): Pembobotan adaptif gabungan kernel Linear dan RBF untuk memaksimalkan margin pemisah data non-linear",
      "Dataset Longitudinal IFLS-5: Normalisasi z-score standar antropometri baku WHO (TB/U, BB/U, BB/TB) dengan data balita Indonesia",
      "Akurasi Tinggi 99,3%: Evaluasi matriks konfusi komprehensif (Akurasi 99,3%, Precision, Recall, dan F1-Score optimal)",
      "Aplikasi Web Flask & MySQL: Form input 9 parameter balita dengan kalkulasi hasil prediksi instan dan visualisasi status",
      "Interpretasi Medis & Solusi: Panduan rekomendasi gizi pencegahan stunting dan saran tindak lanjut kesehatan anak",
      "Riwayat Skrining Balita: Penyimpanan rekam medis skrining posyandu dengan fitur pencarian, filter status, dan navigasi halaman",
    ],
    links: [
      { label: "Buka di GitHub", href: "https://github.com/Salman-artz" },
    ],
    screenshots: [
      { src: "/projects/svm-stunting/foto1_form_klasifikasi_stunting.png", alt: "Form klasifikasi stunting dengan data balita terisi", w: 2880, h: 1900 },
      { src: "/projects/svm-stunting/foto2_hasil_klasifikasi_stunting.png", alt: "Hasil klasifikasi Normal beserta interpretasi dan saran pencegahan stunting", w: 2880, h: 1900 },
      { src: "/projects/svm-stunting/foto3_riwayat_skrining_balita.png", alt: "Riwayat hasil klasifikasi balita dalam tabel dengan navigasi halaman", w: 2880, h: 1900 },
    ],
    art: (
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
    ),
  },
];

const STACK = [
  "Go", "TypeScript", "Node.js", "Laravel", "Next.js", "Hono.js", "PostgreSQL",
  "MySQL", "Flutter", "Prisma", "Drizzle ORM", "gRPC", "NATS", "Docker", "Python",
];

export default function Projects() {
  const railRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  // Modal state
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const [isProgressRunning, setIsProgressRunning] = useState(false);
  const modalCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  const activeProject = activeProjectIndex !== null ? PROJECTS[activeProjectIndex] : null;
  const currentScreenshots = activeProject?.screenshots || [];
  const slideCount = currentScreenshots.length;

  // Open modal
  const openModal = useCallback((index: number) => {
    if (modalCloseTimerRef.current) {
      clearTimeout(modalCloseTimerRef.current);
      modalCloseTimerRef.current = null;
    }
    lastFocusedElementRef.current = document.activeElement as HTMLElement | null;
    setActiveProjectIndex(index);
    setSlideIndex(0);
    setIsModalVisible(true);
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      setIsModalOpen(true);
      setIsProgressRunning(true);
    });
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsProgressRunning(false);
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
      autoplayTimerRef.current = null;
    }
    modalCloseTimerRef.current = setTimeout(() => {
      setIsModalVisible(false);
      setActiveProjectIndex(null);
      document.body.style.overflow = "";
      if (lastFocusedElementRef.current) {
        lastFocusedElementRef.current.focus({ preventScroll: true });
      }
    }, 450);
  }, []);

  // Slide navigation
  const goToSlide = useCallback((idx: number) => {
    if (slideCount <= 0) return;
    const nextIdx = (idx + slideCount) % slideCount;
    setSlideIndex(nextIdx);
    setIsProgressRunning(false);
    requestAnimationFrame(() => {
      setIsProgressRunning(true);
    });
  }, [slideCount]);

  const prevSlide = useCallback(() => goToSlide(slideIndex - 1), [goToSlide, slideIndex]);
  const nextSlide = useCallback(() => goToSlide(slideIndex + 1), [goToSlide, slideIndex]);

  // Autoplay
  useEffect(() => {
    if (!isModalOpen || slideCount <= 1) return;
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % slideCount);
    }, 4500);
    autoplayTimerRef.current = interval;
    return () => clearInterval(interval);
  }, [isModalOpen, slideCount, slideIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!isModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      } else if (e.key === "ArrowLeft" && slideCount > 1) {
        prevSlide();
      } else if (e.key === "ArrowRight" && slideCount > 1) {
        nextSlide();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isModalOpen, slideCount, prevSlide, nextSlide, closeModal]);

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

    // Delegated click handler on rail to open modal for both original and cloned cards
    const onRailCardClick = (e: MouseEvent) => {
      if (mv) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest("a")) return; // Let links click directly
      const card = target?.closest<HTMLElement>(".card");
      if (card && card.dataset.p !== undefined) {
        openModal(Number(card.dataset.p));
      }
    };
    rail.addEventListener("click", onRailCardClick);

    // Delegated keydown Enter on card
    const onRailCardKeydown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        const target = e.target as HTMLElement | null;
        if (target?.closest("a")) return;
        const card = target?.closest<HTMLElement>(".card");
        if (card && card.dataset.p !== undefined) {
          e.preventDefault();
          openModal(Number(card.dataset.p));
        }
      }
    };
    rail.addEventListener("keydown", onRailCardKeydown);

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
      rail.removeEventListener("click", onRailCardClick);
      rail.removeEventListener("keydown", onRailCardKeydown);
      removeEventListener("resize", onResize);
      removeEventListener("load", onLoad);
      pre.concat(post).forEach((n) => n.remove());
    };
  }, [openModal]);

  return (
    <section className="p" id="proyek">
      <h2 className="rv">Proyek saya</h2>
      <p className="lead rv" style={v({ "--d": "100ms" })}>
        Delapan proyek rekayasa perangkat lunak terbaru saya. Klik kartu untuk melihat detail arsitektur, fitur utama &amp; galeri tangkapan layar sistem.
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
          {PROJECTS.map((proj, idx) => (
            <article
              key={proj.id}
              className="card"
              tabIndex={0}
              data-p={idx}
              role="button"
              aria-label={`Lihat detail ${proj.title}`}
            >
              <div className="art">
                {proj.art}
              </div>
              <div className="body">
                <h3>{proj.title}</h3>
                <p>{proj.shortDesc}</p>
                <ul className="tags">
                  {proj.tags.slice(0, 5).map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <div className="card-footer">
                  <div className="ghs">
                    {proj.links.map((l) => (
                      <a
                        key={l.href}
                        className="gh"
                        href={l.href}
                        target="_blank"
                        rel="noopener"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg viewBox="0 0 24 24">
                          <use href="#gh" />
                        </svg>
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
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

      <div className="marq" aria-label="Teknologi yang saya gunakan">
        <div className="track">
          {[0, 1].map((k) =>
            STACK.map((s, i) => (
              <span key={`${k}-${i}`}>{s}</span>
            ))
          )}
        </div>
      </div>

      {/* Detail Project Modal */}
      {isModalVisible && activeProject && (
        <div
          className={`mdl on ${isModalOpen ? "open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="mbg" onClick={closeModal} />
          <div className="mbox" onClick={(e) => e.stopPropagation()}>
            <button
              className="mx"
              type="button"
              aria-label="Tutup detail proyek"
              onClick={closeModal}
            >
              <svg viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* Gallery / Screenshot carousel */}
            <div
              className={`mg ${slideCount > 1 ? "multi" : ""}`}
              onMouseEnter={() => {
                if (autoplayTimerRef.current) {
                  clearInterval(autoplayTimerRef.current);
                  autoplayTimerRef.current = null;
                }
                setIsProgressRunning(false);
              }}
              onMouseLeave={() => {
                if (isModalOpen && slideCount > 1 && !autoplayTimerRef.current) {
                  setIsProgressRunning(true);
                  autoplayTimerRef.current = setInterval(() => {
                    setSlideIndex((prev) => (prev + 1) % slideCount);
                  }, 4500);
                }
              }}
            >
              {slideCount > 1 && (
                <div className={`mprog ${isProgressRunning ? "run" : ""}`} />
              )}

              <div
                className="mslides"
                style={{
                  transform: `translateX(-${slideIndex * 100}%)`,
                }}
              >
                {currentScreenshots.map((shot, sIdx) => (
                  <div
                    key={sIdx}
                    className={`mslide shot ${sIdx === slideIndex ? "on" : ""}`}
                  >
                    {activeProject.mobile ? (
                      <div className="phone">
                        <div className="shotbox">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={shot.src}
                            alt={shot.alt || activeProject.title}
                            decoding="async"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="bwin">
                        <div className="bbar">
                          <i />
                          <i />
                          <i />
                          <span>{activeProject.title}</span>
                        </div>
                        <div
                          className="shotbox"
                          style={{
                            aspectRatio: `${shot.w || 1280} / ${shot.h || 800}`,
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={shot.src}
                            alt={shot.alt || activeProject.title}
                            decoding="async"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {slideCount > 1 && (
                <>
                  <button
                    className="mnav mp"
                    type="button"
                    aria-label="Gambar sebelumnya"
                    onClick={prevSlide}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M15 5l-7 7 7 7" />
                    </svg>
                  </button>
                  <button
                    className="mnav mn"
                    type="button"
                    aria-label="Gambar berikutnya"
                    onClick={nextSlide}
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  <div className="mdots">
                    {currentScreenshots.map((shot, n) => (
                      <button
                        key={n}
                        type="button"
                        className={`th ${n === slideIndex ? "on" : ""}`}
                        aria-label={`Screenshot ${n + 1}`}
                        onClick={() => goToSlide(n)}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={shot.src} alt="" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Project Details Panel */}
            <div className="mi">
              <p className="mk" style={v({ "--k": 0 })}>
                {activeProject.subtitle}
              </p>
              <h3 id="modal-title" style={v({ "--k": 1 })}>
                {activeProject.modalTitle || activeProject.title}
              </h3>
              <p className="md" style={v({ "--k": 2 })}>
                {activeProject.modalDesc}
              </p>
              <div className="mact" style={v({ "--k": 3 })}>
                {activeProject.links.map((link) => (
                  <a
                    key={link.href}
                    className="btn main"
                    href={link.href}
                    target="_blank"
                    rel="noopener"
                  >
                    <svg viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                      <use href="#gh" />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
              <h4 style={v({ "--k": 4 })}>Fitur utama &amp; Arsitektur</h4>
              <ul className="mf" style={v({ "--k": 5 })}>
                {activeProject.features.map((feature, j) => (
                  <li key={j} style={v({ "--j": j })}>
                    {feature}
                  </li>
                ))}
              </ul>
              <h4 style={v({ "--k": 6 })}>Teknologi</h4>
              <ul className="tags mtg" style={v({ "--k": 7 })}>
                {activeProject.tags.map((tag, j) => (
                  <li key={tag} style={v({ "--j": j })}>
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
