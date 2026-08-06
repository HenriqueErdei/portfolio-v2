import type { Dict } from "./dict"

/**
 * `Dict` is derived from the Portuguese source, so a missing or misspelled key is
 * a compile error here rather than a blank string on the page.
 */
export const en: Dict = {
  meta: {
    localeName: "English",
    localeShort: "EN",
    htmlLang: "en",
  },

  a11y: {
    skipToContent: "Skip to content",
    mainLabel: "Main content",
    navLabel: "Section navigation",
    themeToggle: "Switch between dark and light theme",
    langSwitch: "Change language",
    soundToggle: "Turn the interface sound on or off",
    sceneLabel:
      "Decorative animation: a geometric bolt strikes the geogram and shatters into crystals as the page loads.",
    progressLabel: "Page progress",
    externalLink: "opens in a new tab",
  },

  readout: {
    clock: "Local time",
    progress: "Progress",
  },

  palette: {
    open: "Open the command console",
    title: "Command console",
    placeholder: "Search a section, project or command",
    empty: "No command matches that search.",
    resultsLabel: "Available commands",
    hint: {
      navigate: "navigate",
      run: "run",
      close: "close",
    },
    group: {
      go: "Go to",
      work: "Projects",
      view: "Display",
      lang: "Language",
      contact: "Contact",
    },
    themeConsole: "Dark theme",
    themeDaylight: "Light theme",
    soundOn: "Sound on",
    soundOff: "Sound off",
    copyEmail: "Copy email",
    copied: "Email copied",
    active: "in use",
  },

  boot: {
    label: "Preflight",
    ok: "OK",
    hint: "opens the command console",
    step: {
      systems: "Systems",
      type: "Typography",
      scene: "3D scene",
      ready: "Ready to launch",
    },
  },

  nav: {
    intro: "Intro",
    about: "About",
    path: "Path",
    work: "Work",
    stack: "Stack",
    notes: "Notes",
    contact: "Contact",
  },

  intro: {
    designation: "00",
    title: "Intro",
    available: "Available for projects",
    unavailable: "No availability right now",
    scrollHint: "Scroll to begin",
    basedIn: "Based in",
    primaryCta: "See the work",
    secondaryCta: "Get in touch",
  },

  about: {
    designation: "01",
    title: "About",
    subtitle: "Who is on the other side, and how I work.",
    spec: {
      role: "Role",
      location: "Based in",
      availability: "Status",
      handle: "Handle",
    },
  },

  path: {
    designation: "02",
    title: "Path",
    subtitle: "How I got here, in the order it happened.",
    kind: {
      work: "Work",
      education: "Education",
      credential: "Certificate",
    },
    viewCredential: "View credential",
  },

  work: {
    designation: "03",
    title: "Work",
    subtitle: "Open a project for the full write-up.",
    status: {
      orbital: "Live",
      ascent: "In progress",
      archived: "Archived",
    },
    statusHint: {
      orbital: "Live and maintained",
      ascent: "Being built right now",
      archived: "Finished, no longer maintained",
    },
    expand: "Open details",
    collapse: "Close details",
    repo: "Code",
    demo: "View live",
    caseStudy: "Case study",
    stackLabel: "Built with",
    detailLabel: "Details",
  },

  stack: {
    designation: "04",
    title: "Stack",
    subtitle: "The tools I actually reach for, with an honest level.",
    levelLabel: "Level",
    sinceLabel: "Since",
    bayLabel: "Cargo bay",
    bayHint: "Drag — zero gravity",
    group: {
      guidance: "Languages",
      structure: "Back-end and data",
      propulsion: "Interface",
      comms: "APIs and integrations",
      ground: "Infra and tooling",
    },
  },

  notes: {
    designation: "05",
    title: "Notes",
    subtitle: "Technical notes on what I learned building things.",
    readMore: "Read note",
    backToNotes: "Back to notes",
    empty: "No notes published yet.",
    minuteRead: "min read",
    publishedOn: "Published on",
  },

  contact: {
    designation: "06",
    titleA: "Let's build",
    titleB: "the next decision?",
    subtitle: "Open to projects, internships and good conversations — in Portuguese, English or Spanish.",
    emailCta: "Send me an email",
    socials: "Find me on",
    localTime: "Local time",
    copied: "Copied",
    resume: "Download résumé",
    backToTop: "Back to top",
    builtWith: "Built with",
    sourceCode: "Source of this site",
  },

  error: {
    sceneFailed:
      "The 3D animation could not start on this device. All of the portfolio's content is below.",
    notFound: "Section not found.",
  },
}
