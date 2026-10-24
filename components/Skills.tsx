import type { CSSProperties } from "react";

const v = (o: Record<string, string | number>) => o as CSSProperties;

type SkillGroup = {
  title: string;
  desc: string;
  d: string;
  items: string[];
};

const GROUPS: SkillGroup[] = [
  {
    title: "Bahasa Pemrograman",
    desc: "Fondasi yang saya pakai lintas proyek.",
    d: "0ms",
    items: ["JavaScript", "TypeScript", "Go", "Python", "PHP"],
  },
  {
    title: "Backend",
    desc: "API, layanan, dan ORM.",
    d: "90ms",
    items: [
      "Node.js", "Express.js", "Hono.js", "Laravel", "Fiber (Go)",
      "gRPC", "Drizzle ORM", "Prisma", "Sequelize",
    ],
  },
  {
    title: "Frontend",
    desc: "Antarmuka web modern.",
    d: "180ms",
    items: [
      "Next.js", "React", "Vue", "Nuxt", "Vite",
      "HTML5", "CSS3", "Tailwind CSS",
    ],
  },
  {
    title: "Mobile",
    desc: "Aplikasi lintas platform.",
    d: "0ms",
    items: ["Flutter", "Dart", "Riverpod"],
  },
  {
    title: "Database",
    desc: "Skema, query, dan optimasi.",
    d: "90ms",
    items: ["MySQL", "PostgreSQL"],
  },
  {
    title: "Tools",
    desc: "Alur kerja dan dokumentasi.",
    d: "180ms",
    items: [
      "Git/GitHub", "Postman", "Scalar",
      "Swagger/OpenAPI", "Docker", "phpMyAdmin",
    ],
  },
  {
    title: "Arsitektur",
    desc: "Pola yang saya terapkan.",
    d: "0ms",
    items: [
      "Multi-Tenant SaaS", "Microservices", "Saga Pattern", "RBAC",
      "WebSocket", "Clean Architecture", "Repository Pattern",
    ],
  },
];

export default function Skills() {
  return (
    <section className="p" id="keahlian">
      <h2 className="rv">Keahlian</h2>
      <p className="lead rv" style={v({ "--d": "100ms" })}>
        Teknologi yang saya pakai, dikelompokkan menurut perannya.
      </p>
      <div className="skg">
        {GROUPS.map((g) => (
          <div key={g.title} className="sg rv" style={v({ "--d": g.d })}>
            <h3>{g.title}</h3>
            <p>{g.desc}</p>
            <ul className="sk-l">
              {g.items.map((item, i) => (
                <li key={item} style={v({ "--i": i })}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
