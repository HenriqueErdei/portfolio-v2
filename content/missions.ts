import type { Mission } from "./types"

/**
 * Projetos migrados do portfólio anterior (HenriqueErdei/Portfolio), com
 * curadoria híbrida: painéis Power BI agrupados; Flask+Gemini e Protheus
 * como missões próprias.
 *
 * Onde não havia número real, não inventei métrica.
 */
export const missions: readonly Mission[] = [
  {
    id: "this-portfolio",
    code: "01",
    name: "Este portfólio",
    year: 2026,
    status: "ascent",
    summary: {
      pt: "Este site. Um fundo WebGL em que um foguete se desfaz numa cascata de geometria, tudo dirigido por um único número: quanto da página você já rolou.",
      en: "This site. A WebGL background where a rocket breaks apart into a cascade of geometry, all driven by a single number: how far down the page you have read.",
      es: "Este sitio. Un fondo WebGL donde un cohete se deshace en una cascada de geometría, todo dirigido por un solo número: cuánto de la página has recorrido.",
    },
    briefing: {
      pt: [
        "A decisão técnica central foi tirar a posição de scroll do estado do React. Ela vive num store de módulo com três saídas — uma variável CSS, uma inscrição imperativa para a cena 3D, e um hook que quantiza o valor para o React só re-renderizar quando um dígito visível mudaria.",
        "A sequência inteira do fundo é uma única chamada de desenho instanciada. Cada um dos mil e duzentos estilhaços guarda três coisas: onde ele ficava na pele do foguete, para onde foi arremessado, e qual é o lugar dele na cascata. O vertex shader interpola entre as três, então o foguete, a explosão e a coluna são a mesma geometria do começo ao fim.",
        "Os shaders são escritos à mão: wireframe por coordenadas baricêntricas, que mantém a espessura constante em tela; grade em perspectiva antialiasada contra a derivada de tela, que não vira moiré no horizonte; e o clarão da explosão, cuja função real é esconder os três frames em que o casco desaparece e os estilhaços assumem o lugar dele.",
      ],
      en: [
        "The central technical decision was taking scroll position out of React state. It lives in a module store with three outlets — a CSS variable, an imperative subscription for the 3D scene, and a hook that quantises the value so React only re-renders when a visible digit would change.",
        "The entire background sequence is one instanced draw call. Each of the twelve hundred shards carries three things: where it sat on the rocket's skin, the direction it was thrown, and its home in the cascade. The vertex shader blends between them, so the rocket, the explosion and the column are the same geometry throughout.",
        "The shaders are hand-written: a barycentric wireframe that holds a constant width on screen, a perspective grid antialiased against the screen-space derivative so it never turns into moiré at the horizon, and a blast flash whose real job is hiding the three frames where the hull disappears and the shards take its place.",
      ],
      es: [
        "La decisión técnica central fue sacar la posición del scroll del estado de React. Vive en un store de módulo con tres salidas — una variable CSS, una suscripción imperativa para la escena 3D, y un hook que cuantiza el valor para que React solo se re-renderice cuando cambiaría un dígito visible.",
        "Toda la secuencia del fondo es una sola llamada de dibujo instanciada. Cada uno de los mil doscientos fragmentos guarda tres cosas: dónde estaba en la piel del cohete, hacia dónde fue lanzado, y cuál es su lugar en la cascada. El vertex shader interpola entre las tres, así que el cohete, la explosión y la columna son la misma geometría de principio a fin.",
        "Los shaders están escritos a mano: wireframe por coordenadas baricéntricas, que mantiene un grosor constante en pantalla; rejilla en perspectiva antialiasada contra la derivada de pantalla, que nunca se vuelve moiré en el horizonte; y el destello de la explosión, cuyo trabajo real es esconder los tres frames en que el casco desaparece y los fragmentos ocupan su lugar.",
      ],
    },
    stack: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "three.js", "GLSL", "Vitest"],
    links: {
      repo: "https://github.com/HenriqueErdei/portfolio-v2",
    },
    imageAlt: {
      pt: "Fundo do portfólio: um foguete em neon se desfazendo numa cascata de estilhaços geométricos.",
      en: "The portfolio's background: a neon rocket breaking apart into a cascade of geometric shards.",
      es: "Fondo del portafolio: un cohete de neón deshaciéndose en una cascada de fragmentos geométricos.",
    },
  },

  {
    id: "data-flask-system",
    code: "02",
    name: "Data Flask System",
    year: 2025,
    status: "orbital",
    summary: {
      pt: "Sistema web em Python, Flask e SQLite com controle de usuários, permissões por módulo e Gemini integrado para apoiar tomadas de decisão.",
      en: "A web system in Python, Flask and SQLite with user control, module permissions and Gemini integrated to support decision-making.",
      es: "Sistema web en Python, Flask y SQLite con control de usuarios, permisos por módulo y Gemini integrado para apoyar la toma de decisiones.",
    },
    briefing: {
      pt: [
        "A aplicação une autenticação, autorização por módulo e relatórios servidos direto pelo Flask. O dado fica em SQLite; a interface HTML/CSS entrega o fluxo operacional sem depender de um BI externo.",
        "O Gemini entra como apoio à decisão: o usuário consulta o sistema e recebe sugestões a partir do contexto dos dados já modelados — útil quando a pergunta não cabe num gráfico fixo.",
        "Demo pública disponível; para entrar como usuário: user / 123.",
      ],
      en: [
        "The app joins authentication, per-module authorization and reports served straight from Flask. Data lives in SQLite; the HTML/CSS interface covers the operational flow without an external BI tool.",
        "Gemini supports decisions: the user queries the system and gets suggestions from the already modelled data — useful when the question does not fit a fixed chart.",
        "Public demo available; sign in as user: user / 123.",
      ],
      es: [
        "La aplicación une autenticación, autorización por módulo e informes servidos directamente por Flask. Los datos viven en SQLite; la interfaz HTML/CSS cubre el flujo operativo sin depender de un BI externo.",
        "Gemini apoya la decisión: el usuario consulta el sistema y recibe sugerencias a partir del contexto de los datos ya modelados — útil cuando la pregunta no cabe en un gráfico fijo.",
        "Demo pública disponible; acceso de usuario: user / 123.",
      ],
    },
    stack: ["Python", "Flask", "SQLite", "Gemini", "HTML", "CSS"],
    links: {
      repo: "https://github.com/HenriqueErdei/Data-flask-system",
      demo: "https://data-flask-system.onrender.com",
    },
    image: "/missions/flask-system.png",
    imageAlt: {
      pt: "Tela do Data Flask System com módulos de negócio e área de apoio à decisão.",
      en: "Data Flask System screen showing business modules and the decision-support area.",
      es: "Pantalla del Data Flask System con módulos de negocio y el área de apoyo a la decisión.",
    },
  },

  {
    id: "powerbi-panels",
    code: "03",
    name: "Painéis Power BI",
    year: 2025,
    status: "orbital",
    summary: {
      pt: "Família de painéis Power BI — jurídico, estoque, controle de projetos e outras áreas — cada um modelado a partir da pergunta que o negócio precisava responder.",
      en: "A family of Power BI dashboards — legal, stock, project control and other areas — each modelled from the question the business needed answered.",
      es: "Familia de paneles Power BI — jurídico, inventario, control de proyectos y otras áreas — cada uno modelado desde la pregunta que el negocio necesitaba responder.",
    },
    briefing: {
      pt: [
        "Indicador de processos jurídicos: KPIs de processos e valores gastos, com drill-down. Estoque de eletrônicos: visão de inventário em projeto fictício. Controle de projetos: gastos, lucros, prazos e cargos numa só tela.",
        "O método se repete: tabela fato separada das dimensões, medidas em DAX em vez de coluna calculada onde dá, e hierarquia de tempo de ano até dia. Também há painéis de faturamento/devolução, fluxo de caixa e varejo no mesmo repertório.",
        "Demos públicas: jurídico, estoque e controle de projetos. Os repositórios ficam sob a conta HenriqueErdei com o prefixo PowerBI.",
      ],
      en: [
        "Legal process indicator: KPIs for cases and spend, with drill-down. Electronics stock: inventory view on a fictional project. Project control: spend, profit, deadlines and roles on one screen.",
        "The method repeats: a fact table kept separate from dimensions, DAX measures instead of calculated columns wherever possible, and a time hierarchy from year down to day. Invoicing/returns, cash flow and retail panels sit in the same repertoire.",
        "Public demos: legal, stock and project control. Repositories live under HenriqueErdei with the PowerBI prefix.",
      ],
      es: [
        "Indicador de procesos jurídicos: KPIs de procesos y gasto, con drill-down. Inventario de electrónicos: visión de stock en un proyecto ficticio. Control de proyectos: gastos, beneficios, plazos y cargos en una sola pantalla.",
        "El método se repite: tabla de hechos separada de las dimensiones, medidas en DAX en vez de columna calculada donde se puede, y jerarquía de tiempo de año a día. También hay paneles de facturación/devolución, flujo de caja y retail en el mismo repertorio.",
        "Demos públicas: jurídico, inventario y control de proyectos. Los repositorios están bajo HenriqueErdei con el prefijo PowerBI.",
      ],
    },
    stack: ["Power BI", "DAX", "Power Query", "Modelagem dimensional"],
    links: {
      repo: "https://github.com/HenriqueErdei?tab=repositories&q=PowerBI",
      demo: "https://app.powerbi.com/view?r=eyJrIjoiZDU4NmE4MGQtNDg4MS00Yjc0LThmMjItNWM0MzhhNTFkNmI2IiwidCI6Ijc2N2JmYWQ3LTVjM2MtNDE0MS1hOWQ0LTVhY2RhNTQ5YzkxMCJ9&embedImagePlaceholder=true",
    },
    image: "/missions/juridico.png",
    imageAlt: {
      pt: "Dashboard Power BI de processos jurídicos com KPIs de volume e valores gastos.",
      en: "Power BI dashboard for legal processes with KPIs for volume and spend.",
      es: "Panel Power BI de procesos jurídicos con KPIs de volumen y gasto.",
    },
  },

  {
    id: "protheus-reports",
    code: "04",
    name: "Automação de relatórios Protheus",
    year: 2025,
    status: "orbital",
    summary: {
      pt: "Automação de relatórios personalizados no Protheus, com integração MySQL e Python para extrair e entregar o que o ERP não resolve sozinho.",
      en: "Custom report automation on Protheus, with MySQL and Python integration to extract and deliver what the ERP does not solve alone.",
      es: "Automatización de informes personalizados en Protheus, con integración MySQL y Python para extraer y entregar lo que el ERP no resuelve solo.",
    },
    briefing: {
      pt: [
        "O Protheus concentra o operacional, mas relatórios sob medida pedem outro caminho: consultar o banco, transformar o dado e gerar a saída fora do fluxo padrão do ERP.",
        "O script em Python fala com o MySQL, monta o relatório e reduz o trabalho manual de quem precisava montar a mesma visão toda vez.",
        "Código e documentação no repositório Application-dataBase-relatorys-PROTHEUS.",
      ],
      en: [
        "Protheus holds the operational core, but custom reports need another path: query the database, transform the data and produce the output outside the ERP's default flow.",
        "A Python script talks to MySQL, builds the report and cuts the manual work of assembling the same view every time.",
        "Code and docs live in the Application-dataBase-relatorys-PROTHEUS repository.",
      ],
      es: [
        "Protheus concentra lo operativo, pero los informes a medida piden otro camino: consultar la base, transformar el dato y generar la salida fuera del flujo estándar del ERP.",
        "El script en Python habla con MySQL, arma el informe y reduce el trabajo manual de quien necesitaba montar la misma vista una y otra vez.",
        "Código y documentación en el repositorio Application-dataBase-relatorys-PROTHEUS.",
      ],
    },
    stack: ["Protheus", "MySQL", "Python"],
    links: {
      repo: "https://github.com/HenriqueErdei/Application-dataBase-relatorys-PROTHEUS",
      demo: "https://github.com/HenriqueErdei/Application-dataBase-relatorys-PROTHEUS",
    },
    image: "/missions/protheus.png",
    imageAlt: {
      pt: "Tela ou fluxo da automação de relatórios personalizados no Protheus.",
      en: "Screen or flow of the custom report automation on Protheus.",
      es: "Pantalla o flujo de la automatización de informes personalizados en Protheus.",
    },
  },

  {
    id: "portfolio-2025",
    code: "05",
    name: "Portfólio (2025)",
    year: 2025,
    status: "archived",
    summary: {
      pt: "A versão anterior do portfólio, em Next.js e TypeScript, com i18n e galeria de projetos — publicada na Vercel.",
      en: "The previous portfolio version, in Next.js and TypeScript, with i18n and a project gallery — deployed on Vercel.",
      es: "La versión anterior del portafolio, en Next.js y TypeScript, con i18n y galería de proyectos — publicada en Vercel.",
    },
    briefing: {
      pt: [
        "Serviu para organizar conteúdo, traduções e demos num layout clássico de seções. Foi a base do que migrou para este Mission Control — o conteúdo veio de lá; a apresentação mudou por completo.",
      ],
      en: [
        "It organised content, translations and demos in a classic section layout. That became the source for what migrated into this Mission Control — the content came from there; the presentation changed entirely.",
      ],
      es: [
        "Sirvió para organizar contenido, traducciones y demos en un layout clásico de secciones. Fue la base de lo que migró a este Mission Control — el contenido vino de ahí; la presentación cambió por completo.",
      ],
    },
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
    links: {
      repo: "https://github.com/HenriqueErdei/Portfolio",
      demo: "https://portfolio-teal-seven-cjydnu3awu.vercel.app",
    },
    imageAlt: {
      pt: "Página inicial do portfólio 2025 com hero e navegação por seções.",
      en: "Home page of the 2025 portfolio with hero and section navigation.",
      es: "Página de inicio del portafolio 2025 con hero y navegación por secciones.",
    },
  },

  {
    id: "faker-generator",
    code: "06",
    name: "Faker Business Data Generator",
    year: 2024,
    status: "archived",
    summary: {
      pt: "Gerador de bases CSV sintéticas para projetos fictícios, dimensionável de tabelas pequenas até volume de big data.",
      en: "A synthetic CSV dataset generator for fictional projects, scaling from small tables up to big-data volume.",
      es: "Generador de bases CSV sintéticas para proyectos ficticios, escalable desde tablas pequeñas hasta volumen de big data.",
    },
    briefing: {
      pt: [
        "Todo projeto de dados de estudo trava no mesmo ponto: não existe dado realista para testar. Esta ferramenta resolve isso gerando bases de negócio coerentes — com relação entre tabelas, não colunas aleatórias soltas.",
        "Útil para alimentar painéis e pipelines sem expor dado sensível; o volume alvo depende do caso, de amostras pequenas até bases grandes para stress de ETL.",
      ],
      en: [
        "Every data project you build to learn stalls at the same point: there is no realistic data to test with. This tool fixes that by generating coherent business datasets — with relationships between tables, not loose random columns.",
        "Useful for feeding dashboards and pipelines without exposing sensitive data; target volume depends on the case, from small samples to large bases for ETL stress.",
      ],
      es: [
        "Todo proyecto de datos de estudio se traba en el mismo punto: no hay datos realistas para probar. Esta herramienta lo resuelve generando bases de negocio coherentes — con relación entre tablas, no columnas aleatorias sueltas.",
        "Útil para alimentar paneles y pipelines sin exponer datos sensibles; el volumen depende del caso, desde muestras pequeñas hasta bases grandes para estrés de ETL.",
      ],
    },
    stack: ["Python", "Faker", "Pandas", "CSV"],
    links: {
      repo: "https://github.com/HenriqueErdei/Faker-project-generator-business-bigdata",
    },
    imageAlt: {
      pt: "Amostra de base CSV gerada ou terminal executando o gerador Faker.",
      en: "Sample of a generated CSV dataset, or the terminal running the Faker generator.",
      es: "Muestra de una base CSV generada, o la terminal ejecutando el generador Faker.",
    },
  },

  {
    id: "clean-architecture",
    code: "07",
    name: "Clean Architecture em TypeScript",
    year: 2023,
    status: "archived",
    summary: {
      pt: "Estudo de arquitetura limpa em TypeScript: separar domínio, casos de uso e infraestrutura até a regra de negócio não conhecer o banco.",
      en: "A clean architecture study in TypeScript: separating domain, use cases and infrastructure until the business rule knows nothing about the database.",
      es: "Estudio de arquitectura limpia en TypeScript: separar dominio, casos de uso e infraestructura hasta que la regla de negocio no conozca la base de datos.",
    },
    briefing: {
      pt: [
        "Exercício de camadas e SOLID em Node/TypeScript: domínio no centro, casos de uso no meio, adapters na borda. Serve de referência quando um sistema precisa crescer sem acoplar regra de negócio ao banco ou ao framework.",
      ],
      en: [
        "A layers and SOLID exercise in Node/TypeScript: domain at the centre, use cases in the middle, adapters at the edge. Useful reference when a system needs to grow without coupling business rules to the database or the framework.",
      ],
      es: [
        "Ejercicio de capas y SOLID en Node/TypeScript: dominio en el centro, casos de uso en el medio, adapters en el borde. Sirve de referencia cuando un sistema necesita crecer sin acoplar la regla de negocio a la base o al framework.",
      ],
    },
    stack: ["TypeScript", "Node.js", "Clean Architecture", "SOLID"],
    links: { repo: "https://github.com/HenriqueErdei/Clean-architecture-basic" },
    imageAlt: {
      pt: "Diagrama das camadas de clean architecture no estudo em TypeScript.",
      en: "Diagram of the clean architecture layers in the TypeScript study.",
      es: "Diagrama de las capas de clean architecture en el estudio en TypeScript.",
    },
  },
]
