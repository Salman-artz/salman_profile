# Portfolio — Salman Alfarizy

Portofolio pribadi Muhammad Salman Alfarizy Yonda Putra (Software & Fullstack Developer). Port dari halaman HTML statis ke **Next.js (App Router)**.

## Menjalankan lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

Build produksi:

```bash
npm run build
npm start
```

## Struktur

- `app/` — layout (`next/font`: Sora & Manrope, dark mode otomatis), halaman utama, `icon.svg/png` (logo)
- `components/` — `Hero` (canvas network, tilt 3D, typewriter), `Nav` (scrollspy), `Projects` (carousel tak berujung + link repo Backend/Frontend), `Footer`, `Cursor`, `ScrollProgressBar`, `Reveal`, `SvgSymbols`
- `app/globals.css` — seluruh styling + animasi
- `public/portrait.jpg` — foto profil

## Edit konten

- Link repo per proyek (Backend/Frontend/Mobile): objek `GH` di `components/Projects.tsx`
- Kontak (IG/WA/Email/LinkedIn/GitHub/TikTok): array `CONTACTS` di `components/Footer.tsx`
- Teks & data kartu: komponen `Projects.tsx`
