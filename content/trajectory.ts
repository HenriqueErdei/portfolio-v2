import type { TrajectoryEntry } from "./types"

/**
 * Esta é a parte que eu não consegui montar do GitHub — perfil público não traz
 * cargo, período nem formação. Só o empregador (@techlabsp) estava lá.
 *
 * Preencha os TODO. Dica para as notas: verbo no passado e número sempre que der.
 * "Construí o painel de faturamento" é fraco; "Reduzi o fechamento mensal de
 * três dias para uma tarde" é o que faz alguém te chamar.
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
    id: "formacao",
    kind: "education",
    // TODO: período. Se estiver cursando, use "2024 – 2027".
    period: "TODO",
    org: "TODO: instituição",
    title: {
      pt: "TODO: seu curso",
      en: "TODO: your degree",
      es: "TODO: tu carrera",
    },
    notes: {
      pt: ["TODO: em andamento ou concluído, e uma linha sobre o foco."],
      en: ["TODO: in progress or completed, plus one line on the focus."],
      es: ["TODO: en curso o concluido, más una línea sobre el enfoque."],
    },
  },

  {
    id: "alura",
    kind: "credential",
    // TODO: o ano em que você concluiu. Seus repositórios da Alura são de 2022–2023.
    period: "2023",
    org: "Alura",
    title: {
      // TODO: o nome exato da formação que você concluiu lá.
      pt: "TODO: nome da formação (ex.: Formação Power BI)",
      en: "TODO: name of the track (e.g. Power BI track)",
      es: "TODO: nombre de la formación (p. ej. Formación Power BI)",
    },
    notes: {
      pt: ["TODO: o que ela cobriu, em uma linha."],
      en: ["TODO: what it covered, in one line."],
      es: ["TODO: qué cubrió, en una línea."],
    },
    // TODO: link do certificado, se você tiver.
  },
]
