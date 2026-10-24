import type { CSSProperties } from "react";

function GithubIcon() {
  return (
    <svg className="ic fill" viewBox="0 0 24 24">
      <use href="#gh" />
    </svg>
  );
}

const CONTACTS: Array<{
  href: string;
  name: string;
  value: string;
  d: string;
  icon: React.ReactNode;
}> = [
  {
    href: "https://instagram.com/putra_artzz",
    name: "Instagram",
    value: "@putra_artzz",
    d: "100ms",
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5v.01" />
      </svg>
    ),
  },
  {
    href: "https://wa.me/6282142296293",
    name: "WhatsApp",
    value: "0821 4229 6293",
    d: "160ms",
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M3 21l1.65-4.95A9 9 0 1 1 8 19.4L3 21z" />
        <path d="M9 9.5c.6 2.4 2.6 4.4 5 5l1.3-1.3-1.8-.9-.9.7a4.5 4.5 0 0 1-1.9-1.9l.7-.9-.9-1.8L9 9.5z" />
      </svg>
    ),
  },
  {
    href: "mailto:salmanmsayp123@gmail.com",
    name: "Email",
    value: "salmanmsayp123@gmail.com",
    d: "220ms",
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M3.5 7.5L12 13.5l8.5-6" />
      </svg>
    ),
  },
  {
    href: "https://www.linkedin.com/in/msalmanayp",
    name: "LinkedIn",
    value: "linkedin.com/in/msalmanayp",
    d: "280ms",
    icon: (
      <svg className="ic" viewBox="0 0 24 24">
        <path d="M6 10v8M6 6v.01M11 18v-8M11 13.5a3.5 3.5 0 0 1 7 0V18" />
        <rect x="3" y="3" width="18" height="18" rx="4" />
      </svg>
    ),
  },
  {
    href: "https://github.com/Salman-artz",
    name: "GitHub",
    value: "github.com/Salman-artz",
    d: "340ms",
    icon: <GithubIcon />,
  },
  {
    href: "https://www.tiktok.com/@arrrtttzzz31",
    name: "TikTok",
    value: "@arrrtttzzz31",
    d: "400ms",
    icon: (
      <svg className="ic" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.4 2.6 2.1 4.2 5 4.5" />
      </svg>
    ),
  },
];

const v = (o: Record<string, string | number>) => o as CSSProperties;

export default function Footer() {
  return (
    <footer id="kontak">
      <div className="flogo rv">
        <svg viewBox="0 0 420 420" aria-hidden="true">
          <use href="#logo" />
        </svg>
      </div>
      <h2 className="rv">Mari terhubung.</h2>
      <p className="rv" style={v({ "--d": "100ms" })}>
        Saya mencari peran software engineer tingkat menengah hingga senior.
        Hubungi saya lewat kanal mana pun di bawah ini.
      </p>
      <div className="contacts">
        {CONTACTS.map((c) => (
          <a
            key={c.name}
            className="ct rv"
            style={v({ "--d": c.d })}
            href={c.href}
            target="_blank"
            rel="noopener"
          >
            {c.icon}
            <span>
              <b>{c.name}</b>
              <small>{c.value}</small>
            </span>
          </a>
        ))}
      </div>
      <p style={{ marginTop: "3rem", fontSize: ".85rem" }}>
        © 2026 Muhammad Salman Alfarizy Yonda Putra
      </p>
    </footer>
  );
}
