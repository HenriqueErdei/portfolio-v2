import type { Subsystem, SubsystemGroup } from "./types"

/**
 * Montado a partir do que aparece de fato nos seus repositórios públicos.
 *
 * ⚠️ Os `level` são um chute meu, baseado em quanto de cada coisa aparece no seu
 * GitHub. Ajuste antes de publicar — este é o campo em que exagerar custa mais
 * caro numa entrevista, e um 3 bem colocado passa mais confiança que cinco 5.
 *
 * `since` também é estimativa, tirada da data do repositório mais antigo em que
 * cada tecnologia aparece.
 */
export const subsystems: readonly Subsystem[] = [
  // Linguagens
  { name: "Python", slug: "python", color: "#3776AB", level: 5, since: 2024, group: "guidance" },
  { name: "TypeScript", slug: "typescript", color: "#3178C6", level: 4, since: 2023, group: "guidance" },
  { name: "JavaScript", slug: "javascript", color: "#F7DF1E", level: 4, since: 2022, group: "guidance" },
  { name: "SQL", slug: "postgresql", color: "#4169E1", level: 4, since: 2024, group: "guidance" },

  // Back-end e dados
  { name: "Flask", slug: "flask", color: "#6B7280", level: 4, since: 2025, group: "structure" },
  { name: "SQLite", slug: "sqlite", color: "#003B57", level: 4, since: 2025, group: "structure" },
  { name: "Pandas", slug: "pandas", color: "#8A6FE8", level: 4, since: 2024, group: "structure" },
  { name: "Power BI", slug: "powerbi", color: "#F2C811", level: 5, since: 2023, group: "structure" },
  { name: "Node.js", slug: "nodedotjs", color: "#5FA04E", level: 3, since: 2023, group: "structure" },

  // Interface
  { name: "React", slug: "react", color: "#61DAFB", level: 4, since: 2025, group: "propulsion" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4", level: 4, since: 2025, group: "propulsion" },
  { name: "HTML5", slug: "html5", color: "#E34F26", level: 5, since: 2022, group: "propulsion" },
  { name: "CSS", slug: "css", color: "#663399", level: 4, since: 2022, group: "propulsion" },

  // Integrações
  { name: "REST", slug: "openapiinitiative", color: "#6BA539", level: 4, since: 2025, group: "comms" },

  // Ferramental
  { name: "Git", slug: "git", color: "#F05032", level: 4, since: 2022, group: "ground" },
  { name: "Vite", slug: "vite", color: "#646CFF", level: 3, since: 2025, group: "ground" },
]

/** Rótulos dos grupos ficam no i18n; isto só fixa a ordem de exibição. */
export const SUBSYSTEM_ORDER: readonly SubsystemGroup[] = [
  "guidance",
  "structure",
  "propulsion",
  "comms",
  "ground",
]
