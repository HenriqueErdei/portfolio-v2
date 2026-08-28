import type { TrajectoryEntry } from "./types"

/**
 * Experiência recortada para posicionamento full-stack.
 * Helpdesk, CFTV e papéis só de BI ficam no LinkedIn/currículo — não aqui.
 * Cursos avulsos também: a UI aponta para o LinkedIn, sem card por certificado.
 */
export const trajectory: readonly TrajectoryEntry[] = [
  {
    id: "sondotecnica",
    kind: "work",
    period: "2025 —",
    org: "Sondotécnica Engenharia",
    title: {
      pt: "Desenvolvedor Full-Stack",
      en: "Full-Stack Developer",
      es: "Desarrollador Full-Stack",
    },
    notes: {
      pt: [
        "Desenvolvimento e manutenção de aplicações web e mobile em TypeScript — React, Vite, React Native — da interface à API.",
        "Serviços em Node.js, modelagem PostgreSQL, autenticação e regras de negócio; tempo real com Socket.IO e arquivos no Azure Blob Storage.",
        "UI com React Hooks, shadcn/ui e Tailwind CSS v4; correção de bugs, performance e qualidade de código em time.",
      ],
      en: [
        "Build and maintain web and mobile apps in TypeScript — React, Vite, React Native — from UI through the API.",
        "Node.js services, PostgreSQL modeling, auth and business logic; real-time with Socket.IO and file storage on Azure Blob Storage.",
        "UI with React Hooks, shadcn/ui and Tailwind CSS v4; bug fixes, performance and code quality in a team setting.",
      ],
      es: [
        "Desarrollo y mantenimiento de apps web y mobile en TypeScript — React, Vite, React Native — de la interfaz a la API.",
        "Servicios en Node.js, modelado PostgreSQL, autenticación y reglas de negocio; tiempo real con Socket.IO y archivos en Azure Blob Storage.",
        "UI con React Hooks, shadcn/ui y Tailwind CSS v4; corrección de bugs, performance y calidad de código en equipo.",
      ],
    },
  },

  {
    id: "sba",
    kind: "work",
    period: "2023 – 2026",
    org: "SBA Tecnologia",
    title: {
      pt: "DevOps Engineer · Especialista de Dados",
      en: "DevOps Engineer · Data Specialist",
      es: "DevOps Engineer · Especialista de Datos",
    },
    notes: {
      pt: [
        "Automações na AWS (Lambdas e serviços associados) para o sistema de consignado do Banco Pagol; monitoramento e alertas em CloudWatch e Grafana.",
        "ETL e modelagem relacional em PostgreSQL, MariaDB e SQL Server; automações de análise e limpeza com Python (Pandas, NumPy, PySpark).",
        "Evolução no mesmo time: analista júnior → DevOps → especialista de dados, sempre perto da camada de serviço e de banco.",
      ],
      en: [
        "AWS automations (Lambdas and related services) for Banco Pagol’s consigned-credit system; monitoring and alerts in CloudWatch and Grafana.",
        "ETL and relational modeling on PostgreSQL, MariaDB and SQL Server; analysis and cleanup automations in Python (Pandas, NumPy, PySpark).",
        "Progression on the same team: junior analyst → DevOps → data specialist, always close to the service and database layer.",
      ],
      es: [
        "Automatizaciones en AWS (Lambdas y servicios asociados) para el sistema de consignado del Banco Pagol; monitoreo y alertas en CloudWatch y Grafana.",
        "ETL y modelado relacional en PostgreSQL, MariaDB y SQL Server; automatizaciones de análisis y limpieza con Python (Pandas, NumPy, PySpark).",
        "Evolución en el mismo equipo: analista junior → DevOps → especialista de datos, siempre cerca de la capa de servicio y de base.",
      ],
    },
  },

  {
    id: "spa",
    kind: "work",
    period: "2023",
    org: "S.P.A Silva e Pelaquim Associados",
    title: {
      pt: "Desenvolvedor Full-Stack (estágio)",
      en: "Full-Stack Developer (intern)",
      es: "Desarrollador Full-Stack (prácticas)",
    },
    notes: {
      pt: [
        "Software interno em TypeScript (React e Node.js) para automação de processos e análise de dados.",
        "Integração com APIs REST e bancos PostgreSQL/MongoDB; aplicações web e desktop tipadas para operação interna.",
      ],
      en: [
        "Internal TypeScript software (React and Node.js) for process automation and data analysis.",
        "REST API and PostgreSQL/MongoDB integration; typed web and desktop apps for internal operations.",
      ],
      es: [
        "Software interno en TypeScript (React y Node.js) para automatización de procesos y análisis de datos.",
        "Integración con APIs REST y bases PostgreSQL/MongoDB; apps web y desktop tipadas para operación interna.",
      ],
    },
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
]
