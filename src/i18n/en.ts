import type { Dict } from "./dict"

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
      "Decorative background: a soft grid and subtle particles that follow scroll.",
    progressLabel: "Page progress",
    externalLink: "opens in a new tab",
  },

  readout: {
    clock: "Local time",
    progress: "Progress",
  },

  palette: {
    open: "Open command palette",
    title: "Command palette",
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
    copyPhone: "Copy phone",
    copied: "Email copied",
    active: "in use",
  },

  boot: {
    label: "Loading",
    ok: "OK",
    hint: "opens the command palette",
    step: {
      systems: "Assets",
      type: "Typography",
      scene: "Background",
      ready: "Ready",
    },
  },

  nav: {
    intro: "Home",
    about: "About",
    path: "Experience",
    work: "Projects",
    stack: "Skills",
    contact: "Contact",
  },

  intro: {
    designation: "Home",
    title: "Home",
    available: "Open to opportunities",
    unavailable: "Not available right now",
    scrollHint: "Scroll to continue",
    basedIn: "Based in",
    remoteFriendly: "Remote · US/EU overlap",
    stackLabel: "Core stack",
    primaryCta: "View experience",
    secondaryCta: "Get in touch",
    resumeCta: "Download résumé",
  },

  about: {
    designation: "About",
    title: "About",
    subtitle:
      "Senior full-stack engineer — product, API and UI held to the same quality bar.",
    spec: {
      role: "Role",
      location: "Location",
      timezone: "Time zone",
      timezoneValue: "UTC-3 (BRT)",
      availability: "Availability",
      email: "Email",
      handle: "Handle",
    },
  },

  path: {
    designation: "Experience",
    title: "Experience",
    subtitle: "Professional history, education and relevant credentials.",
    kind: {
      work: "Work",
      education: "Education",
      credential: "Certificate",
    },
    viewCredential: "View credential",
  },

  work: {
    designation: "Projects",
    title: "Projects",
    subtitle: "Selected case studies with measurable impact — published as they ship.",
    empty:
      "New case studies are in progress. Full history is in Experience and on the résumé.",
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
    expand: "View details",
    collapse: "Hide details",
    repo: "Code",
    demo: "View live",
    caseStudy: "Case study",
    stackLabel: "Built with",
    detailLabel: "Details",
  },

  stack: {
    designation: "Skills",
    title: "Skills",
    subtitle: "Tools I use in production, with an honest proficiency level.",
    levelLabel: "Level",
    sinceLabel: "Since",
    group: {
      guidance: "Languages",
      structure: "Back-end & database",
      propulsion: "Front-end & mobile",
      comms: "APIs & integrations",
      ground: "Infra & tooling",
    },
  },

  contact: {
    designation: "Contact",
    title: "Contact",
    lede: "Open to senior full-stack roles, remote contracts and technical conversations — English, Portuguese or Spanish.",
    subtitle: "Typical reply within one business day.",
    emailCta: "Email me",
    phoneCta: "Call",
    socials: "Links",
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

  snake: {
    eyebrow: "Secret",
    title: "Snake",
    score: "Score",
    best: "Best",
    gameOver: "You lost :(",
    restart: "Play again",
    close: "Close",
    go: "Go",
    hint: "Arrows, WASD or swipe · Esc to exit",
  },
}
