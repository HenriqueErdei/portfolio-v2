import type { Profile } from "./types"

/**
 * Preenchido a partir do perfil público e do portfólio anterior
 * (github.com/HenriqueErdei/Portfolio).
 */
export const profile: Profile = {
  name: "Henrique Erdei",
  handle: "@HenriqueErdei",

  role: {
    pt: "Engenheiro Full-Stack & Especialista em Dados",
    en: "Full-Stack Engineer & Data Specialist",
    es: "Ingeniero Full-Stack & Especialista en Datos",
  },

  location: "Santo André, SP, Brasil",
  timezone: "America/Sao_Paulo",

  email: "henriqueerdeijob@gmail.com",

  headline: {
    pt: ["Eu transformo", "dado bruto", "em decisão."],
    en: ["I turn", "raw data", "into decisions."],
    es: ["Convierto", "datos crudos", "en decisiones."],
  },

  bio: {
    pt: [
      "Trabalho nas duas pontas do mesmo problema: construo o sistema que coleta e organiza o dado, e construo a interface que faz alguém entender o que ele está dizendo. Na prática isso vai de um back-end em Python e Flask até um painel que um gestor abre na segunda-feira e sabe o que fazer.",
      "Gosto de projeto que termina em decisão, não em gráfico bonito. Por isso a maior parte do que eu construo nasce de uma pergunta de negócio — quanto está entrando, onde está travando, o que precisa de atenção esta semana — e só depois vira arquitetura, modelo de dados e tela.",
    ],
    en: [
      "I work on both ends of the same problem: I build the system that collects and organises the data, and I build the interface that makes someone understand what it is saying. In practice that runs from a Python and Flask back-end to a dashboard a manager opens on Monday and knows what to do next.",
      "I like projects that end in a decision, not in a pretty chart. Most of what I build starts from a business question — what is coming in, where it is stuck, what needs attention this week — and only then becomes architecture, a data model and a screen.",
    ],
    es: [
      "Trabajo en los dos extremos del mismo problema: construyo el sistema que recoge y organiza el dato, y construyo la interfaz que hace que alguien entienda lo que está diciendo. En la práctica eso va de un back-end en Python y Flask hasta un panel que un gestor abre el lunes y ya sabe qué hacer.",
      "Me gustan los proyectos que terminan en una decisión, no en un gráfico bonito. Casi todo lo que construyo nace de una pregunta de negocio — cuánto está entrando, dónde se traba, qué necesita atención esta semana — y solo después se vuelve arquitectura, modelo de datos y pantalla.",
    ],
  },

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
