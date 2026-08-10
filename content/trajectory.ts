import type { TrajectoryEntry } from "./types"

/**
 * Formação e cursos complementares (resumo do LinkedIn — ~40 credenciais
 * agrupadas por tema, sem listar cada certificado).
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
    id: "cursos-dev",
    kind: "credential",
    period: "2022 – 2023",
    org: "Alura · Rocketseat",
    title: {
      pt: "Cursos — desenvolvimento web e back-end",
      en: "Courses — web and back-end development",
      es: "Cursos — desarrollo web y back-end",
    },
    notes: {
      pt: [
        "Front-end: HTML5/CSS3, JavaScript (DOM, armazenamento no navegador), layouts responsivos.",
        "Back-end e base: Python 3 (introdução, orientação a objetos, I/O), SQL Server, Git/GitHub, Linux (terminal e pacotes).",
        "Rocketseat — Trilha Conectar (2023).",
      ],
      en: [
        "Front-end: HTML5/CSS3, JavaScript (DOM, browser storage), responsive layouts.",
        "Back-end and data layer: Python 3 (introduction, OOP, I/O), SQL Server, Git/GitHub, Linux (terminal and packages).",
        "Rocketseat — Trilha Conectar track (2023).",
      ],
      es: [
        "Front-end: HTML5/CSS3, JavaScript (DOM, almacenamiento en el navegador), layouts responsivos.",
        "Back-end y capa de datos: Python 3 (introducción, POO, I/O), SQL Server, Git/GitHub, Linux (terminal y paquetes).",
        "Rocketseat — Trilha Conectar (2023).",
      ],
    },
    url: "https://www.linkedin.com/in/henrique-erdei-442b09200/details/certifications/",
  },

  {
    id: "cursos-dados-cloud",
    kind: "credential",
    period: "2020 – 2024",
    org: "ENAP · Mackenzie · AWS · Fundação Bradesco · outros",
    title: {
      pt: "Cursos — dados, cloud e gestão",
      en: "Courses — data, cloud and management",
      es: "Cursos — datos, cloud y gestión",
    },
    notes: {
      pt: [
        "Power BI e modelagem: ENAP, Noble Work, Alura e Fundação Bradesco (modelagem e administração de bancos de dados).",
        "Cloud e infra: AWS (IoT, development tools), Cisco Linux, Oracle Foundations, Acronis (cloud e cybersecurity).",
        "Gestão: Mackenzie — Agile, projetos, decisão por dados, IA aplicada e pipeline DevOps (iniciante).",
      ],
      en: [
        "Power BI and modelling: ENAP, Noble Work, Alura and Fundação Bradesco (data modelling and database administration).",
        "Cloud and infra: AWS (IoT, development tools), Cisco Linux, Oracle Foundations, Acronis (cloud and cybersecurity).",
        "Management: Mackenzie — Agile, projects, data-driven decisions, applied AI and DevOps pipeline (beginner).",
      ],
      es: [
        "Power BI y modelado: ENAP, Noble Work, Alura y Fundação Bradesco (modelado de datos y administración de bases).",
        "Cloud e infra: AWS (IoT, development tools), Cisco Linux, Oracle Foundations, Acronis (cloud y ciberseguridad).",
        "Gestión: Mackenzie — Agile, proyectos, decisión por datos, IA aplicada y pipeline DevOps (principiante).",
      ],
    },
    url: "https://www.linkedin.com/in/henrique-erdei-442b09200/details/certifications/",
  },
]
