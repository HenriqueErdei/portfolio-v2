import type { Profile } from "./types"

/**
 * Positioning: senior full-stack engineer for US / remote hiring.
 * Data science and BI stay in trajectory and skills — not the headline.
 */
export const profile: Profile = {
  name: "Henrique Erdei",
  handle: "@HenriqueErdei",

  role: {
    pt: "Engenheiro Full-Stack Sênior",
    en: "Senior Full-Stack Engineer",
    es: "Ingeniero Full-Stack Senior",
  },

  location: "São Paulo, Brazil",
  timezone: "America/Sao_Paulo",

  email: "henriqueerdeijob@gmail.com",
  phone: "11925815808",

  headline: {
    pt: ["Produtos web", "prontos para produção,", "de ponta a ponta."],
    en: ["Production-ready", "web products,", "owned end to end."],
    es: ["Productos web", "listos para producción,", "de punta a punta."],
  },

  bio: {
    pt: [
      "Engenheiro full-stack com foco em TypeScript, React, Node.js e PostgreSQL — da modelagem de dados à interface, com contratos de API claros e código que aguenta revisão em time sênior.",
      "Background em Data Science e BI (Power BI, Python, modelagem). Isso entra como repertório: decisões de produto, métricas e arquitetura saem mais maduras quando dado e UX são tratados como um sistema.",
    ],
    en: [
      "Full-stack engineer focused on TypeScript, React, Node.js and PostgreSQL — from data modeling and API design through polished UI, with code that holds up in senior team review.",
      "Background in Data Science and BI (Power BI, Python, modeling). That shows up as stronger product judgment: metrics, contracts and architecture land better when data and UX are treated as one system.",
    ],
    es: [
      "Ingeniero full-stack enfocado en TypeScript, React, Node.js y PostgreSQL — del modelado de datos y diseño de API a una UI pulida, con código que aguanta revisión en equipos senior.",
      "Formación en Data Science y BI (Power BI, Python, modelado). Eso suma criterio de producto: métricas, contratos y arquitectura mejoran cuando dato y UX se tratan como un solo sistema.",
    ],
  },

  focusStack: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"],

  available: true,

  resumeUrl: "/curriculo.pdf",

  socials: [
    { label: "GitHub", handle: "HenriqueErdei", url: "https://github.com/HenriqueErdei", icon: "github" },
    {
      label: "LinkedIn",
      handle: "/in/henrique-erdei-442b09200",
      url: "https://www.linkedin.com/in/henrique-erdei-442b09200/",
      icon: "linkedin",
    },
    {
      label: "Email",
      handle: "henriqueerdeijob@gmail.com",
      url: "mailto:henriqueerdeijob@gmail.com",
      icon: "mail",
    },
  ],
}
