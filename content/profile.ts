import type { Profile } from "./types"

/**
 * Preenchido a partir do perfil público em github.com/HenriqueErdei.
 * O que eu não tinha como saber está marcado com TODO — são poucos campos.
 */
export const profile: Profile = {
  name: "Henrique Erdei",
  handle: "@HenriqueErdei",

  role: {
    pt: "Engenheiro Full-Stack & Especialista em Dados",
    en: "Full-Stack Engineer & Data Specialist",
    es: "Ingeniero Full-Stack & Especialista en Datos",
  },

  location: "São Paulo, Brasil",
  timezone: "America/Sao_Paulo",

  // TODO: seu e-mail. Não é público no GitHub, então não tive como puxar.
  email: "TODO@exemplo.com",

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

  socials: [
    { label: "GitHub", handle: "HenriqueErdei", url: "https://github.com/HenriqueErdei", icon: "github" },
    // TODO: a URL do seu LinkedIn.
    { label: "LinkedIn", handle: "/in/TODO", url: "https://linkedin.com/in/TODO", icon: "linkedin" },
    // TODO: repetir aqui o mesmo e-mail de cima.
    { label: "Email", handle: "TODO@exemplo.com", url: "mailto:TODO@exemplo.com", icon: "mail" },
  ],
}
