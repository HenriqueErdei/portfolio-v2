import type { Dict } from "./dict"

/**
 * `Dict` is derived from the Portuguese source, so a missing or misspelled key is
 * a compile error here rather than a blank string on the page.
 */
export const es: Dict = {
  meta: {
    localeName: "Español",
    localeShort: "ES",
    htmlLang: "es",
  },

  a11y: {
    skipToContent: "Saltar al contenido",
    mainLabel: "Contenido principal",
    navLabel: "Navegación entre secciones",
    themeToggle: "Alternar entre tema oscuro y claro",
    langSwitch: "Cambiar idioma",
    soundToggle: "Activar o desactivar el sonido de la interfaz",
    sceneLabel:
      "Animación decorativa: un rayo geométrico golpea el geograma y se deshace en cristales al cargar la página.",
    progressLabel: "Progreso de la página",
    externalLink: "abre en una pestaña nueva",
  },

  readout: {
    clock: "Hora local",
    progress: "Progreso",
  },

  palette: {
    open: "Abrir la consola de comandos",
    title: "Consola de comandos",
    placeholder: "Buscar sección, proyecto o comando",
    empty: "Ningún comando coincide con esa búsqueda.",
    resultsLabel: "Comandos disponibles",
    hint: {
      navigate: "navegar",
      run: "ejecutar",
      close: "cerrar",
    },
    group: {
      go: "Ir a",
      work: "Proyectos",
      view: "Visualización",
      lang: "Idioma",
      contact: "Contacto",
    },
    themeConsole: "Tema oscuro",
    themeDaylight: "Tema claro",
    soundOn: "Sonido activado",
    soundOff: "Sonido desactivado",
    copyEmail: "Copiar correo",
    copied: "Correo copiado",
    active: "en uso",
  },

  boot: {
    label: "Prevuelo",
    ok: "OK",
    hint: "abre la consola de comandos",
    step: {
      systems: "Sistemas",
      type: "Tipografía",
      scene: "Escena 3D",
      ready: "Listo para lanzar",
    },
  },

  nav: {
    intro: "Inicio",
    about: "Sobre",
    path: "Trayectoria",
    work: "Proyectos",
    stack: "Stack",
    notes: "Notas",
    contact: "Contacto",
  },

  intro: {
    designation: "00",
    title: "Inicio",
    available: "Disponible para proyectos",
    unavailable: "Sin disponibilidad ahora",
    scrollHint: "Desplaza para empezar",
    basedIn: "Lugar",
    primaryCta: "Ver proyectos",
    secondaryCta: "Hablar conmigo",
  },

  about: {
    designation: "01",
    title: "Sobre",
    subtitle: "Quién está del otro lado, y cómo trabajo.",
    spec: {
      role: "Rol",
      location: "Lugar",
      availability: "Estado",
      handle: "Usuario",
    },
  },

  path: {
    designation: "02",
    title: "Trayectoria",
    subtitle: "El camino hasta aquí, en orden de llegada.",
    kind: {
      work: "Trabajo",
      education: "Formación",
      credential: "Certificado",
    },
    viewCredential: "Ver credencial",
  },

  work: {
    designation: "03",
    title: "Proyectos",
    subtitle: "Abre un proyecto para ver el detalle completo.",
    status: {
      orbital: "En línea",
      ascent: "En construcción",
      archived: "Archivado",
    },
    statusHint: {
      orbital: "En línea y con mantenimiento",
      ascent: "En construcción ahora",
      archived: "Concluido, sin mantenimiento activo",
    },
    expand: "Abrir detalles",
    collapse: "Cerrar detalles",
    repo: "Código",
    demo: "Ver en vivo",
    caseStudy: "Estudio de caso",
    stackLabel: "Tecnologías",
    detailLabel: "Detalle",
  },

  stack: {
    designation: "04",
    title: "Stack",
    subtitle: "Las herramientas que de verdad uso, con nivel honesto.",
    levelLabel: "Nivel",
    sinceLabel: "Desde",
    bayLabel: "Bahía de carga",
    bayHint: "Arrastra — gravedad cero",
    group: {
      guidance: "Lenguajes",
      structure: "Back-end y datos",
      propulsion: "Interfaz",
      comms: "APIs e integraciones",
      ground: "Infra y herramientas",
    },
  },

  notes: {
    designation: "05",
    title: "Notas",
    subtitle: "Notas técnicas de lo que aprendí construyendo.",
    readMore: "Leer nota",
    backToNotes: "Volver a las notas",
    empty: "Ninguna nota publicada todavía.",
    minuteRead: "min de lectura",
    publishedOn: "Publicado el",
  },

  contact: {
    designation: "06",
    titleA: "Construyamos",
    titleB: "la próxima decisión?",
    subtitle:
      "Abierto a proyectos, prácticas y buenas conversaciones — en portugués, inglés o español.",
    emailCta: "Envíame un correo",
    socials: "Encuéntrame en",
    localTime: "Hora local",
    copied: "Copiado",
    resume: "Descargar CV",
    backToTop: "Volver arriba",
    builtWith: "Construido con",
    sourceCode: "Código de este sitio",
  },

  error: {
    sceneFailed:
      "La animación 3D no pudo iniciarse en este dispositivo. Todo el contenido del portafolio sigue abajo.",
    notFound: "Sección no encontrada.",
  },
}
