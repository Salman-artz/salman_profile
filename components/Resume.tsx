"use client";

import { useRef, useState } from "react";

const CV_DATA = {
  id: {
    file: "/CV_MuhammadSalmanAlfarizyYondaPutra_ID.pdf",
    lead: "Ringkasan pengalaman, proyek, dan pendidikan saya dalam satu dokumen.",
    title: "CV Muhammad Salman Alfarizy Yonda Putra",
    points: [
      "Backend Engineer, PT. cmlabs Indonesia Digital",
      "S1 Teknik Informatika UIN Malang, IPK 3.84",
      "8 proyek portofolio dan 6 semester asisten praktikum",
      "Go, TypeScript, Laravel, Next.js, dan Flutter",
    ],
    downloadLabel: "Unduh CV (PDF)",
    emailLabel: "Minta lewat email",
  },
  en: {
    file: "/CV_MuhammadSalmanAlfarizyYondaPutra_EN.pdf",
    lead: "A concise summary of my background, projects, and education in one document.",
    title: "CV Muhammad Salman Alfarizy Yonda Putra",
    points: [
      "Backend Engineer, PT. cmlabs Indonesia Digital",
      "B.Sc. in Informatics Engineering, UIN Malang, GPA 3.84",
      "8 portfolio projects and 6 teaching assistant terms",
      "Go, TypeScript, Laravel, Next.js, and Flutter",
    ],
    downloadLabel: "Download CV (PDF)",
    emailLabel: "Request by email",
  },
} as const;

type Language = keyof typeof CV_DATA;

export default function Resume() {
  const [language, setLanguage] = useState<Language>("id");
  const paperRef = useRef<HTMLDivElement>(null);
  const ptRef = useRef<HTMLDivElement>(null);

  const cv = CV_DATA[language];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!paperRef.current || !ptRef.current) return;
    const rect = paperRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    ptRef.current.style.setProperty("--ty", `${x * 22}deg`);
    ptRef.current.style.setProperty("--tx", `${-y * 22}deg`);
  };

  const handlePointerLeave = () => {
    if (!ptRef.current) return;
    ptRef.current.style.setProperty("--tx", "0deg");
    ptRef.current.style.setProperty("--ty", "0deg");
  };

  return (
    <section className="p resume" id="resume">
      <h2 className="rv">Resume / CV</h2>
      <p className="lead rv" style={{ "--d": "100ms" } as React.CSSProperties}>
        {cv.lead}
      </p>
      <div className="rsm">
        <div
          className="paper rv"
          id="paper"
          ref={paperRef}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <div className="pt" id="cvpt" ref={ptRef}>
            <div className="sheet s3" aria-hidden="true" />
            <div className="sheet s2" aria-hidden="true" />
            <div className="sheet s1">
              <img
                className={`pv ${language === "id" ? "on" : ""}`}
                id="pvid"
                src="/cv-preview-id.jpg"
                alt="Preview of the Indonesian CV"
                width={579}
                height={819}
              />
              <img
                className={`pv ${language === "en" ? "on" : ""}`}
                id="pven"
                src="/cv-preview-en.jpg"
                alt="Preview of the English CV"
                width={579}
                height={819}
              />
              <div className="scanl" aria-hidden="true" />
            </div>
          </div>
        </div>

        <div className="rinfo rv" style={{ "--d": "150ms" } as React.CSSProperties}>
          <div className={`lsw ${language === "en" ? "en" : ""}`} role="group" aria-label="Bahasa CV">
            <span className="th" style={{ transform: language === "en" ? "translateX(100%)" : undefined }} />
            <button
              type="button"
              aria-pressed={language === "id"}
              onClick={() => setLanguage("id")}
            >
              Indonesia
            </button>
            <button
              type="button"
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
          </div>

          <h3>{cv.title}</h3>

          <ul className="hl">
            {cv.points.map((point, i) => (
              <li key={point} style={{ "--i": i } as React.CSSProperties}>
                {point}
              </li>
            ))}
          </ul>

          <div className="btns">
            <a className="btn main" id="cvdl" href={cv.file} download>
              <svg className="dlic" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v11m0 0l-4-4m4 4l4-4M5 20h14" />
              </svg>
              <span>{cv.downloadLabel}</span>
            </a>
            <a className="btn" href="mailto:salmanmsayp123@gmail.com?subject=CV%20Request">
              {cv.emailLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
