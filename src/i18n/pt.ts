/**
 * Português é o dicionário-fonte: o tipo `Dict` é derivado deste objeto, então
 * inglês e espanhol têm que ter exatamente as mesmas chaves ou o build quebra.
 * Ao adicionar uma chave aqui, o TypeScript passa a apontar as outras duas.
 *
 * Os nomes dos grupos espelham os ids das seções em `src/app/stages.ts`, e é daí
 * que a navegação tira os rótulos.
 */
export const pt = {
  meta: {
    localeName: "Português",
    localeShort: "PT",
    htmlLang: "pt-BR",
  },

  a11y: {
    skipToContent: "Pular para o conteúdo",
    mainLabel: "Conteúdo principal",
    navLabel: "Navegação entre seções",
    themeToggle: "Alternar entre tema escuro e claro",
    langSwitch: "Trocar idioma",
    soundToggle: "Ligar ou desligar o som da interface",
    sceneLabel:
      "Animação decorativa: um raio geométrico golpeia o geograma e se desfaz em cristais conforme a página carrega.",
    progressLabel: "Progresso da página",
    externalLink: "abre em nova aba",
  },

  readout: {
    clock: "Hora local",
    progress: "Progresso",
  },

  palette: {
    open: "Abrir console de comandos",
    title: "Console de comandos",
    placeholder: "Buscar seção, projeto ou comando",
    empty: "Nenhum comando corresponde a essa busca.",
    resultsLabel: "Comandos disponíveis",
    hint: {
      navigate: "navegar",
      run: "executar",
      close: "fechar",
    },
    group: {
      go: "Ir para",
      work: "Projetos",
      view: "Exibição",
      lang: "Idioma",
      contact: "Contato",
    },
    themeConsole: "Tema escuro",
    themeDaylight: "Tema claro",
    soundOn: "Som ligado",
    soundOff: "Som desligado",
    copyEmail: "Copiar e-mail",
    copied: "E-mail copiado",
    active: "em uso",
  },

  boot: {
    label: "Pré-voo",
    ok: "OK",
    hint: "abre o console de comandos",
    step: {
      systems: "Sistemas",
      type: "Tipografia",
      scene: "Cena 3D",
      ready: "Pronto para lançar",
    },
  },

  nav: {
    intro: "Início",
    about: "Sobre",
    path: "Trajetória",
    work: "Projetos",
    stack: "Stack",
    notes: "Notas",
    contact: "Contato",
  },

  intro: {
    designation: "00",
    title: "Início",
    available: "Disponível para projetos",
    unavailable: "Sem vagas no momento",
    scrollHint: "Role para começar",
    basedIn: "Local",
    primaryCta: "Ver projetos",
    secondaryCta: "Falar comigo",
  },

  about: {
    designation: "01",
    title: "Sobre",
    subtitle: "Quem está do outro lado, e como eu trabalho.",
    spec: {
      role: "Função",
      location: "Local",
      availability: "Situação",
      handle: "Usuário",
    },
  },

  path: {
    designation: "02",
    title: "Trajetória",
    subtitle: "O caminho até aqui, em ordem de chegada.",
    kind: {
      work: "Trabalho",
      education: "Formação",
      credential: "Certificado",
    },
    viewCredential: "Ver credencial",
  },

  work: {
    designation: "03",
    title: "Projetos",
    subtitle: "Abra um projeto para ver o detalhamento completo.",
    status: {
      orbital: "No ar",
      ascent: "Em construção",
      archived: "Arquivado",
    },
    statusHint: {
      orbital: "No ar e em manutenção",
      ascent: "Em construção agora",
      archived: "Concluído, sem manutenção ativa",
    },
    expand: "Abrir detalhes",
    collapse: "Fechar detalhes",
    repo: "Código",
    demo: "Ver no ar",
    caseStudy: "Estudo de caso",
    stackLabel: "Tecnologias",
    detailLabel: "Detalhamento",
  },

  stack: {
    designation: "04",
    title: "Stack",
    subtitle: "As ferramentas que eu realmente uso, com nível honesto.",
    levelLabel: "Nível",
    sinceLabel: "Desde",
    bayLabel: "Baia de carga",
    bayHint: "Arraste — gravidade zero",
    group: {
      guidance: "Linguagens",
      structure: "Back-end e dados",
      propulsion: "Interface",
      comms: "APIs e integrações",
      ground: "Infra e ferramental",
    },
  },

  notes: {
    designation: "05",
    title: "Notas",
    subtitle: "Notas técnicas do que eu aprendi construindo.",
    readMore: "Ler nota",
    backToNotes: "Voltar às notas",
    empty: "Nenhuma nota publicada ainda.",
    minuteRead: "min de leitura",
    publishedOn: "Publicado em",
  },

  contact: {
    designation: "06",
    titleA: "Vamos construir",
    titleB: "a próxima decisão?",
    subtitle:
      "Aberto a projetos, estágios e boas conversas — em português, inglês ou espanhol.",
    emailCta: "Me mande um e-mail",
    socials: "Encontre-me em",
    localTime: "Hora local",
    copied: "Copiado",
    resume: "Baixar currículo",
    backToTop: "Voltar ao topo",
    builtWith: "Construído com",
    sourceCode: "Código deste site",
  },

  error: {
    sceneFailed:
      "A animação 3D não pôde iniciar neste dispositivo. Todo o conteúdo do portfólio segue abaixo.",
    notFound: "Seção não encontrada.",
  },
} as const
