import type { Subsystem, SubsystemGroup } from "./types"

/**
 * Stack alinhada ao foco atual (full-stack). BI/Python ficam no repertório,
 * com nível honesto, mas não lideram a lista.
 *
 * React e React Native compartilham o slug Simple Icons `react` (mesmo logo);
 * a UI usa `name` como chave.
 */
export const subsystems: readonly Subsystem[] = [
  // Linguagens / guidance
  { name: "TypeScript", slug: "typescript", color: "#3178C6", level: 4, since: 2023, group: "guidance" },
  { name: "JavaScript", slug: "javascript", color: "#F7DF1E", level: 4, since: 2022, group: "guidance" },
  { name: "SQL", slug: "postgresql", color: "#4169E1", level: 4, since: 2024, group: "guidance" },
  { name: "Python", slug: "python", color: "#3776AB", level: 4, since: 2024, group: "guidance" },

  // Back-end / structure
  { name: "Node.js", slug: "nodedotjs", color: "#5FA04E", level: 4, since: 2023, group: "structure" },
  { name: "PostgreSQL", slug: "postgresql", color: "#4169E1", level: 4, since: 2024, group: "structure" },
  { name: "MySQL", slug: "mysql", color: "#4479A1", level: 3, since: 2024, group: "structure" },
  { name: "SQLite", slug: "sqlite", color: "#003B57", level: 3, since: 2025, group: "structure" },
  { name: "Flask", slug: "flask", color: "#6B7280", level: 3, since: 2025, group: "structure" },
  { name: "Power BI", slug: "powerbi", color: "#F2C811", level: 4, since: 2023, group: "structure" },

  // Interface / propulsion
  { name: "React", slug: "react", color: "#61DAFB", level: 4, since: 2025, group: "propulsion" },
  { name: "React Native", slug: "react", color: "#61DAFB", level: 3, since: 2025, group: "propulsion" },
  { name: "Next.js", slug: "nextdotjs", color: "#000000", level: 3, since: 2025, group: "propulsion" },
  { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4", level: 4, since: 2025, group: "propulsion" },
  { name: "shadcn/ui", slug: "shadcnui", color: "#FFFFFF", level: 3, since: 2025, group: "propulsion" },
  { name: "HTML5", slug: "html5", color: "#E34F26", level: 4, since: 2022, group: "propulsion" },
  { name: "CSS", slug: "css", color: "#663399", level: 4, since: 2022, group: "propulsion" },

  // Integrações / comms
  { name: "REST", slug: "openapiinitiative", color: "#6BA539", level: 4, since: 2025, group: "comms" },
  { name: "n8n", slug: "n8n", color: "#EA4B71", level: 3, since: 2025, group: "comms" },

  // Ferramental / ground
  { name: "Git", slug: "git", color: "#F05032", level: 4, since: 2022, group: "ground" },
  { name: "Vite", slug: "vite", color: "#646CFF", level: 4, since: 2025, group: "ground" },
  { name: "Docker", slug: "docker", color: "#2496ED", level: 3, since: 2024, group: "ground" },
  { name: "Nginx", slug: "nginx", color: "#009639", level: 3, since: 2024, group: "ground" },
  { name: "PM2", slug: "pm2", color: "#68217A", level: 3, since: 2024, group: "ground" },
  { name: "AWS", slug: "amazonaws", color: "#FF9900", level: 3, since: 2024, group: "ground" },
  { name: "Jira", slug: "jira", color: "#0052CC", level: 4, since: 2023, group: "ground" },
]

/** Rótulos dos grupos ficam no i18n; isto só fixa a ordem de exibição. */
export const SUBSYSTEM_ORDER: readonly SubsystemGroup[] = [
  "guidance",
  "structure",
  "propulsion",
  "comms",
  "ground",
]
