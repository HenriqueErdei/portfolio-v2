import type { Mission } from "./types"

/**
 * Montado a partir dos repositórios públicos em github.com/HenriqueErdei.
 *
 * Duas decisões de curadoria que vale você revisar:
 *  - Os seis repositórios de Power BI viraram UM projeto (05). Seis painéis
 *    como seis cartões separados diluem cada um; juntos eles mostram repertório.
 *  - `Beginner-projects-ALURA` ficou de fora. Está no seu GitHub de qualquer
 *    forma, e num portfólio ele puxa a média para baixo em vez de somar.
 *
 * Onde eu não tinha número real, não inventei métrica. Se você tiver (volume de
 * linhas processadas, tempo que o relatório levava antes, quantas pessoas usam),
 * adicione em `metrics` — é o que separa "fiz um projeto" de "resolvi um problema".
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
      // TODO: crie o repositório e cole a URL aqui.
      repo: "https://github.com/HenriqueErdei/TODO",
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
    status: "archived",
    summary: {
      pt: "Sistema de BI completo em Python, Flask e SQLite: ingestão, modelo de dados e relatórios servidos direto pela aplicação web.",
      en: "A full BI system in Python, Flask and SQLite: ingestion, data model and reports served straight from the web app.",
      es: "Sistema de BI completo en Python, Flask y SQLite: ingesta, modelo de datos e informes servidos directamente por la aplicación web.",
    },
    briefing: {
      pt: [
        "TODO: qual era a dor antes? (relatório feito à mão no Excel, dado espalhado em planilhas, retrabalho toda semana — descreva o cenário real.)",
        "TODO: a decisão técnica de que você mais se orgulha. Por que Flask e SQLite em vez de um BI pronto? O que essa escolha te deu — controle do modelo, custo zero de licença, deploy simples?",
        "TODO: o resultado. Quanto tempo economizou, quantas fontes uniu, quem passou a usar.",
      ],
      en: [
        "TODO: what hurt before? (a report assembled by hand in Excel, data scattered across spreadsheets, rework every week — describe the real situation.)",
        "TODO: the technical decision you are proudest of. Why Flask and SQLite instead of an off-the-shelf BI tool? What did that buy you — control of the model, no licence cost, simple deploys?",
        "TODO: the outcome. How much time it saved, how many sources it joined, who ended up using it.",
      ],
      es: [
        "TODO: ¿qué dolía antes? (un informe hecho a mano en Excel, datos dispersos en hojas de cálculo, retrabajo cada semana — describe la situación real.)",
        "TODO: la decisión técnica de la que estás más orgulloso. ¿Por qué Flask y SQLite en vez de un BI ya hecho? ¿Qué te dio — control del modelo, cero costo de licencia, despliegue simple?",
        "TODO: el resultado. Cuánto tiempo ahorró, cuántas fuentes unió, quién terminó usándolo.",
      ],
    },
    stack: ["Python", "Flask", "SQLite", "SQL", "HTML", "CSS"],
    links: { repo: "https://github.com/HenriqueErdei/Data-flask-system" },
    imageAlt: {
      pt: "TODO: descreva a tela principal do sistema para quem usa leitor de tela.",
      en: "TODO: describe the system's main screen for screen reader users.",
      es: "TODO: describe la pantalla principal del sistema para lectores de pantalla.",
    },
  },

  {
    id: "portfolio-2025",
    code: "03",
    name: "Portfólio (2025)",
    year: 2025,
    status: "orbital",
    summary: {
      pt: "A versão anterior do meu portfólio, em React e TypeScript, publicada na Vercel.",
      en: "The previous version of my portfolio, in React and TypeScript, deployed on Vercel.",
      es: "La versión anterior de mi portafolio, en React y TypeScript, publicada en Vercel.",
    },
    briefing: {
      pt: [
        "TODO: o que essa versão te ensinou, e o que te fez querer reconstruir do zero em 2026.",
      ],
      en: ["TODO: what this version taught you, and what made you want to rebuild from scratch in 2026."],
      es: ["TODO: qué te enseñó esta versión, y qué te hizo querer reconstruirla desde cero en 2026."],
    },
    stack: ["React", "TypeScript", "Vercel"],
    links: {
      repo: "https://github.com/HenriqueErdei/Portfolio",
      demo: "https://portfolio-teal-seven-cjydnu3awu.vercel.app",
    },
    imageAlt: {
      pt: "TODO: descreva a página inicial do portfólio anterior.",
      en: "TODO: describe the home page of the previous portfolio.",
      es: "TODO: describe la página de inicio del portafolio anterior.",
    },
  },

  {
    id: "faker-generator",
    code: "04",
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
        "TODO: até que volume você chegou a gerar, e o que precisou mudar para o script não estourar a memória nesse tamanho? Essa é a parte interessante da história.",
      ],
      en: [
        "Every data project you build to learn stalls at the same point: there is no realistic data to test with. This tool fixes that by generating coherent business datasets — with relationships between tables, not loose random columns.",
        "TODO: what volume did you actually generate, and what had to change so the script would not blow past memory at that size? That is the interesting half of the story.",
      ],
      es: [
        "Todo proyecto de datos de estudio se traba en el mismo punto: no hay datos realistas para probar. Esta herramienta lo resuelve generando bases de negocio coherentes — con relación entre tablas, no columnas aleatorias sueltas.",
        "TODO: ¿hasta qué volumen llegaste a generar, y qué tuviste que cambiar para que el script no reventara la memoria a ese tamaño? Esa es la parte interesante.",
      ],
    },
    stack: ["Python", "Faker", "Pandas", "CSV"],
    links: {
      repo: "https://github.com/HenriqueErdei/Faker-project-generator-business-bigdata",
    },
    imageAlt: {
      pt: "TODO: descreva uma amostra da base gerada, ou o terminal rodando o gerador.",
      en: "TODO: describe a sample of the generated dataset, or the terminal running the generator.",
      es: "TODO: describe una muestra de la base generada, o la terminal ejecutando el generador.",
    },
  },

  {
    id: "powerbi-panels",
    code: "05",
    name: "Painéis Power BI",
    year: 2025,
    status: "archived",
    summary: {
      pt: "Seis painéis de áreas diferentes — faturamento e devolução, fluxo de caixa, jurídico, estoque, controle de projetos e varejo — cada um modelado a partir da pergunta que a área precisava responder.",
      en: "Six dashboards across different areas — invoicing and returns, cash flow, legal, stock, project control and retail — each modelled from the question that area needed answered.",
      es: "Seis paneles de áreas distintas — facturación y devolución, flujo de caja, jurídico, inventario, control de proyectos y retail — cada uno modelado desde la pregunta que el área necesitaba responder.",
    },
    briefing: {
      pt: [
        "Faturamento e devolução, fluxo de caixa em rublo, despesa por processo jurídico, estoque de eletrônicos, controle de projetos com prazos e valores, e vendas de uma livraria. Domínios diferentes, mesmo método: entender a decisão primeiro, modelar depois.",
        "O que se repete entre eles é a modelagem: tabela fato separada das dimensões, medidas em DAX em vez de coluna calculada onde dá, e uma hierarquia de tempo que permite descer de ano até dia sem refazer o visual.",
        "TODO: escolha um desses painéis e conte a decisão de modelagem mais difícil dele. Um caso concreto vale mais que a lista dos seis.",
      ],
      en: [
        "Invoicing and returns, cash flow in roubles, spend per legal case, electronics stock, project control with deadlines and amounts, and bookstore sales. Different domains, same method: understand the decision first, model second.",
        "What repeats across them is the modelling: a fact table kept separate from dimensions, DAX measures instead of calculated columns wherever possible, and a time hierarchy that drills from year down to day without rebuilding the visual.",
        "TODO: pick one of these dashboards and tell the hardest modelling decision in it. One concrete case is worth more than the list of six.",
      ],
      es: [
        "Facturación y devolución, flujo de caja en rublos, gasto por proceso jurídico, inventario de electrónicos, control de proyectos con plazos e importes, y ventas de una librería. Dominios distintos, mismo método: entender la decisión primero, modelar después.",
        "Lo que se repite entre ellos es el modelado: tabla de hechos separada de las dimensiones, medidas en DAX en vez de columna calculada donde se puede, y una jerarquía de tiempo que baja de año a día sin rehacer el visual.",
        "TODO: elige uno de estos paneles y cuenta la decisión de modelado más difícil. Un caso concreto vale más que la lista de los seis.",
      ],
    },
    stack: ["Power BI", "DAX", "Power Query", "Modelagem dimensional"],
    links: {
      repo: "https://github.com/HenriqueErdei?tab=repositories&q=PowerBI",
    },
    imageAlt: {
      pt: "TODO: descreva um dos painéis — quais indicadores aparecem e como estão organizados.",
      en: "TODO: describe one of the dashboards — which metrics appear and how they are laid out.",
      es: "TODO: describe uno de los paneles — qué indicadores aparecen y cómo están organizados.",
    },
  },

  {
    id: "clean-architecture",
    code: "06",
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
        "TODO: o que ficou de prático desse estudo? Qual conceito você passou a usar de verdade nos projetos seguintes, e qual você achou exagerado para o tamanho dos problemas que você resolve?",
      ],
      en: [
        "TODO: what stuck from this study? Which concept did you genuinely start using in later projects, and which one felt like overkill for the size of the problems you solve?",
      ],
      es: [
        "TODO: ¿qué quedó de práctico de este estudio? ¿Qué concepto empezaste a usar de verdad después, y cuál te pareció excesivo para el tamaño de los problemas que resuelves?",
      ],
    },
    stack: ["TypeScript", "Node.js", "Clean Architecture", "SOLID"],
    links: { repo: "https://github.com/HenriqueErdei/Clean-architecture-basic" },
    imageAlt: {
      pt: "TODO: descreva um diagrama das camadas, se você quiser incluir imagem aqui.",
      en: "TODO: describe a diagram of the layers, if you want an image here.",
      es: "TODO: describe un diagrama de las capas, si quieres poner imagen aquí.",
    },
  },
]
