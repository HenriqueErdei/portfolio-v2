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
      "Fundo decorativo: grade suave e partículas discretas que acompanham a rolagem.",
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
    copyPhone: "Copiar telefone",
    copied: "E-mail copiado",
    active: "em uso",
  },

  boot: {
    label: "Carregando",
    ok: "OK",
    hint: "abre o console de comandos",
    step: {
      systems: "Sistemas",
      type: "Tipografia",
      scene: "Ambiente",
      ready: "Pronto",
    },
  },

  nav: {
    intro: "Início",
    about: "Sobre",
    path: "Experiência",
    work: "Projetos",
    stack: "Skills",
    contact: "Contato",
  },

  intro: {
    designation: "Início",
    title: "Início",
    available: "Disponível para contratação",
    unavailable: "Sem disponibilidade no momento",
    scrollHint: "Role para continuar",
    basedIn: "Local",
    remoteFriendly: "Remoto · overlap US/EU",
    stackLabel: "Stack principal",
    primaryCta: "Ver experiência",
    secondaryCta: "Entrar em contato",
    resumeCta: "Baixar currículo",
  },

  about: {
    designation: "Sobre",
    title: "Sobre",
    subtitle: "Engenheiro full-stack sênior — produto, API e interface com o mesmo padrão de qualidade.",
    spec: {
      role: "Cargo",
      location: "Local",
      timezone: "Fuso horário",
      timezoneValue: "UTC-3 (BRT)",
      availability: "Disponibilidade",
      email: "E-mail",
      handle: "Usuário",
    },
  },

  path: {
    designation: "Experiência",
    title: "Experiência",
    subtitle: "Trajetória profissional, formação e certificações relevantes.",
    kind: {
      work: "Trabalho",
      education: "Formação",
      credential: "Certificado",
    },
    viewCredential: "Ver credencial",
  },

  work: {
    designation: "Projetos",
    title: "Projetos",
    subtitle: "Cases selecionados com impacto mensurável — entram aqui conforme forem publicados.",
    empty: "Novos case studies em preparação. Experiência detalhada na seção Experiência e no currículo.",
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
    designation: "Skills",
    title: "Skills",
    subtitle: "Ferramentas que uso em produção, com nível de proficiência honesto.",
    levelLabel: "Nível",
    sinceLabel: "Desde",
    group: {
      guidance: "Linguagens",
      structure: "Back-end e banco",
      propulsion: "Front-end e mobile",
      comms: "APIs e integrações",
      ground: "Infra e ferramental",
    },
  },

  contact: {
    designation: "Contato",
    title: "Contato",
    lede: "Aberto a posições sênior full-stack, contratos remotos e conversas técnicas — em português, inglês ou espanhol.",
    subtitle: "Resposta em até 24h em dias úteis.",
    emailCta: "Me mande um e-mail",
    phoneCta: "Ligar",
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

  snake: {
    eyebrow: "Segredo",
    title: "Snake",
    score: "Pontos",
    best: "Recorde",
    gameOver: "Você perdeu :(",
    restart: "Jogar de novo",
    close: "Fechar",
    go: "Vai",
    hint: "Setas, WASD ou swipe · Esc para sair",
  },
} as const
