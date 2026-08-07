import type { TrajectoryEntry } from "./types"

/**
 * Formação e certificados migrados do portfólio anterior.
 * A entrada TechLab ainda precisa de cargo, período e entregas reais.
 */
export const trajectory: readonly TrajectoryEntry[] = [
  {
    id: "techlab-sp",
    kind: "work",
    // TODO: período real, no formato "2025 —" se estiver em curso.
    period: "TODO —",
    org: "TechLab SP",
    title: {
      // TODO: seu cargo exato.
      pt: "TODO: seu cargo",
      en: "TODO: your role",
      es: "TODO: tu puesto",
    },
    notes: {
      pt: [
        "TODO: uma entrega concreta, com resultado. O que você construiu e o que mudou por causa disso.",
        "TODO: outra — de preferência de uma área diferente da primeira, para mostrar amplitude.",
      ],
      en: [
        "TODO: one concrete delivery, with an outcome. What you built and what changed because of it.",
        "TODO: another — ideally from a different area than the first, to show range.",
      ],
      es: [
        "TODO: una entrega concreta, con resultado. Qué construiste y qué cambió por eso.",
        "TODO: otra — de preferencia de un área distinta a la primera, para mostrar amplitud.",
      ],
    },
    url: "https://github.com/techlabsp",
  },

  {
    id: "mba-fsa",
    kind: "education",
    period: "2025",
    org: "Centro Universitário Fundação Santo André (FSA)",
    title: {
      pt: "MBA Data Science & Analytics",
      en: "MBA Data Science & Analytics",
      es: "MBA Data Science & Analytics",
    },
    notes: {
      pt: [
        "Especialização em Ciência de Dados com foco em Machine Learning: estatística, análise de dados, big data, inteligência artificial e ferramentas para apoiar decisão estratégica.",
      ],
      en: [
        "Specialization in Data Science with a focus on Machine Learning: statistics, data analysis, big data, artificial intelligence and tools that support strategic decisions.",
      ],
      es: [
        "Especialización en Ciencia de Datos con enfoque en Machine Learning: estadística, análisis de datos, big data, inteligencia artificial y herramientas para apoyar decisiones estratégicas.",
      ],
    },
  },

  {
    id: "gestao-ti-fsa",
    kind: "education",
    period: "2023",
    org: "Centro Universitário Fundação Santo André (FSA)",
    title: {
      pt: "Gestão – Tecnologia da Informação",
      en: "Management – Information Technology",
      es: "Gestión – Tecnología de la Información",
    },
    notes: {
      pt: [
        "Planejamento e controle de recursos de TI: governança, segurança da informação, gestão de projetos, infraestrutura e alinhamento entre tecnologia e negócio.",
      ],
      en: [
        "Planning and control of IT resources: governance, information security, project management, infrastructure and alignment between technology and business.",
      ],
      es: [
        "Planificación y control de recursos de TI: gobernanza, seguridad de la información, gestión de proyectos, infraestructura y alineación entre tecnología y negocio.",
      ],
    },
  },

  {
    id: "cert-powerbi",
    kind: "credential",
    period: "2023",
    org: "Microsoft",
    title: {
      pt: "Microsoft Power BI Data Analyst",
      en: "Microsoft Power BI Data Analyst",
      es: "Microsoft Power BI Data Analyst",
    },
    notes: {
      pt: ["Certificação oficial em análise de dados e modelagem com Power BI."],
      en: ["Official certification in data analysis and modelling with Power BI."],
      es: ["Certificación oficial en análisis de datos y modelado con Power BI."],
    },
  },

  {
    id: "cert-tableau",
    kind: "credential",
    period: "2023",
    org: "Tableau",
    title: {
      pt: "Tableau Desktop Specialist",
      en: "Tableau Desktop Specialist",
      es: "Tableau Desktop Specialist",
    },
    notes: {
      pt: ["Certificação em visualização e exploração de dados com Tableau Desktop."],
      en: ["Certification in data visualisation and exploration with Tableau Desktop."],
      es: ["Certificación en visualización y exploración de datos con Tableau Desktop."],
    },
  },
]
