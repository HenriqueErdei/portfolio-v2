import type { Dict } from "./dict"

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
      "Fondo decorativo: cuadrícula suave y partículas discretas que siguen el scroll.",
    progressLabel: "Progreso de la página",
    externalLink: "abre en una pestaña nueva",
  },

  readout: {
    clock: "Hora local",
    progress: "Progreso",
  },

  palette: {
    open: "Abrir la paleta de comandos",
    title: "Paleta de comandos",
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
    copyPhone: "Copiar teléfono",
    copied: "Correo copiado",
    active: "in use",
  },

  boot: {
    label: "Cargando",
    ok: "OK",
    hint: "abre la paleta de comandos",
    step: {
      systems: "Recursos",
      type: "Tipografía",
      scene: "Fondo",
      ready: "Listo",
    },
  },

  nav: {
    intro: "Inicio",
    about: "Sobre",
    path: "Experiencia",
    work: "Proyectos",
    stack: "Skills",
    contact: "Contacto",
  },

  intro: {
    designation: "Inicio",
    title: "Inicio",
    available: "Disponible para oportunidades",
    unavailable: "Sin disponibilidad ahora",
    scrollHint: "Desplaza para continuar",
    basedIn: "Ubicación",
    remoteFriendly: "Remoto · solapamiento US/EU",
    stackLabel: "Stack central",
    primaryCta: "Ver experiencia",
    secondaryCta: "Contactar",
    resumeCta: "Descargar CV",
  },

  about: {
    designation: "Sobre",
    title: "Sobre",
    subtitle:
      "Ingeniero full-stack senior — producto, API e interfaz con el mismo estándar de calidad.",
    spec: {
      role: "Rol",
      location: "Ubicación",
      timezone: "Zona horaria",
      timezoneValue: "UTC-3 (BRT)",
      availability: "Disponibilidad",
      email: "Correo",
      handle: "Usuario",
    },
  },

  path: {
    designation: "Experiencia",
    title: "Experiencia",
    subtitle: "Historial profesional, formación y certificaciones relevantes.",
    kind: {
      work: "Trabajo",
      education: "Formación",
      credential: "Certificado",
    },
    viewCredential: "Ver credencial",
  },

  work: {
    designation: "Proyectos",
    title: "Proyectos",
    subtitle: "Casos seleccionados con impacto medible — se publican conforme estén listos.",
    empty:
      "Nuevos case studies en preparación. Historial completo en Experiencia y en el CV.",
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
    expand: "Ver detalles",
    collapse: "Ocultar detalles",
    repo: "Código",
    demo: "Ver en vivo",
    caseStudy: "Estudio de caso",
    stackLabel: "Tecnologías",
    detailLabel: "Detalle",
  },

  stack: {
    designation: "Skills",
    title: "Skills",
    subtitle: "Herramientas que uso en producción, con nivel de dominio honesto.",
    levelLabel: "Nivel",
    sinceLabel: "Desde",
    group: {
      guidance: "Lenguajes",
      structure: "Back-end y base de datos",
      propulsion: "Front-end y mobile",
      comms: "APIs e integraciones",
      ground: "Infra y herramientas",
    },
  },

  contact: {
    designation: "Contacto",
    title: "Contacto",
    lede: "Abierto a roles senior full-stack, contratos remotos y conversaciones técnicas — en inglés, portugués o español.",
    subtitle: "Respuesta habitual en un día hábil.",
    emailCta: "Enviar correo",
    phoneCta: "Llamar",
    socials: "Enlaces",
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

  snake: {
    eyebrow: "Secreto",
    title: "Snake",
    score: "Puntos",
    best: "Récord",
    gameOver: "Perdiste :(",
    restart: "Jugar de nuevo",
    close: "Cerrar",
    go: "Ya",
    hint: "Flechas, WASD o swipe · Esc para salir",
  },
}
