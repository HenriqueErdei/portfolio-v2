import { ArrowUpRight, Check, CornerDownLeft } from "lucide-react"
import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { missions } from "#content/missions"
import { profile } from "#content/profile"
import { LOCALES } from "#content/types"
import { STAGES } from "@/app/stages"
import { useI18n } from "@/i18n/context"
import { DICTIONARIES } from "@/i18n/dictionaries"
import { blip, setSound, useSound } from "@/lib/audio"
import { cn } from "@/lib/cn"
import { score } from "@/lib/fuzzy"
import { openMission } from "@/lib/openMission"
import { onTogglePalette } from "@/lib/palette"
import { scrollToStage, setScrollLocked } from "@/lib/scrollTo"
import { useTheme } from "@/theme/context"

type Group = "go" | "work" | "view" | "lang" | "contact"

/** Display order of the groups. Results are ranked inside a group, never across. */
const GROUPS: readonly Group[] = ["go", "work", "view", "lang", "contact"]

interface Command {
  readonly id: string
  readonly group: Group
  readonly label: string
  /** Right-hand readout: a designation, a language code, a domain. */
  readonly hint: string
  /** Searchable but not shown — a mission's stack, mostly. */
  readonly keywords: string
  /** Marks the option that describes the current state, e.g. the active language. */
  readonly active: boolean
  readonly external: boolean
  /**
   * Runs the command. A returned string is shown in the footer instead of
   * closing, which is what makes "copy email" and the two toggles usable without
   * reopening the console to check they took effect.
   */
  readonly run: () => string | void
}

/**
 * ⌘K / Ctrl+K. Every destination and setting on the page in one keyboard-first
 * list: sections, projects, theme, language and the ways to reach me.
 *
 * Built as a combobox driving a listbox, which is what assistive tech expects
 * from this pattern — focus never leaves the input, and the highlighted option is
 * announced through `aria-activedescendant` rather than by stealing focus.
 */
export function CommandPalette() {
  const { t, locale, setLocale } = useI18n()
  const { theme, set: setTheme } = useTheme()
  const { on: sound } = useSound()

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [index, setIndex] = useState(0)
  const [status, setStatus] = useState("")

  const inputRef = useRef<HTMLInputElement>(null)
  const restoreTo = useRef<HTMLElement | null>(null)
  const listId = useId()

  const close = useCallback(() => setOpen(false), [])

  const commands = useMemo<Command[]>(() => {
    const list: Command[] = []

    const push = (command: Partial<Command> & Pick<Command, "id" | "group" | "label" | "run">) => {
      list.push({ hint: "", keywords: "", active: false, external: false, ...command })
    }

    for (const stage of STAGES) {
      push({
        id: `go:${stage.id}`,
        group: "go",
        label: t.nav[stage.id],
        hint: stage.designation,
        run: () => scrollToStage(stage.id),
      })
    }

    for (const mission of missions) {
      push({
        id: `work:${mission.id}`,
        group: "work",
        label: mission.name,
        hint: mission.code,
        keywords: mission.stack.join(" "),
        // The missions section owns both the expansion and the scroll, so the
        // report is open by the time the page settles on it.
        run: () => openMission(mission.id),
      })
    }

    push({
      id: "view:console",
      group: "view",
      label: t.palette.themeConsole,
      active: theme === "console",
      run: () => {
        setTheme("console")
        return t.palette.themeConsole
      },
    })
    push({
      id: "view:daylight",
      group: "view",
      label: t.palette.themeDaylight,
      active: theme === "daylight",
      run: () => {
        setTheme("daylight")
        return t.palette.themeDaylight
      },
    })

    push({
      id: "view:sound-on",
      group: "view",
      label: t.palette.soundOn,
      active: sound,
      run: () => {
        setSound(true)
        return t.palette.soundOn
      },
    })
    push({
      id: "view:sound-off",
      group: "view",
      label: t.palette.soundOff,
      active: !sound,
      run: () => {
        setSound(false)
        return t.palette.soundOff
      },
    })

    for (const code of LOCALES) {
      push({
        id: `lang:${code}`,
        group: "lang",
        label: DICTIONARIES[code].meta.localeName,
        hint: DICTIONARIES[code].meta.localeShort,
        active: code === locale,
        run: () => {
          setLocale(code)
          return DICTIONARIES[code].meta.localeName
        },
      })
    }

    push({
      id: "contact:email",
      group: "contact",
      label: t.palette.copyEmail,
      hint: profile.email,
      run: () => {
        void navigator.clipboard?.writeText(profile.email)
        return t.palette.copied
      },
    })

    for (const social of profile.socials) {
      if (social.url.startsWith("mailto:")) continue
      push({
        id: `contact:${social.label}`,
        group: "contact",
        label: social.label,
        hint: hostOf(social.url),
        external: true,
        run: () => {
          window.open(social.url, "_blank", "noopener,noreferrer")
        },
      })
    }

    return list
  }, [t, locale, setLocale, theme, setTheme, sound])

  /**
   * Ranked inside each group and then concatenated, so the list keeps the same
   * shape no matter what is typed: sections stay above projects, and a section
   * never leapfrogs into the middle of the contact block.
   */
  const results = useMemo(() => {
    const matched = commands
      .map((command) => ({
        command,
        points: score(`${command.label} ${command.hint} ${command.keywords}`, query),
      }))
      .filter((row): row is { command: Command; points: number } => row.points !== null)

    return GROUPS.flatMap((group) =>
      matched
        .filter((row) => row.command.group === group)
        .sort((a, b) => b.points - a.points)
        .map((row) => row.command),
    )
  }, [commands, query])

  /**
   * The highlighted row, clamped as it is read: the stored index can outlive the
   * list it pointed into, and correcting that here rather than in an effect saves
   * a render pass on every keystroke.
   */
  const active = results.length === 0 ? 0 : Math.min(index, results.length - 1)

  /** Always reopens on a clean prompt — a stale query is never what you wanted. */
  const toggle = useCallback(() => {
    blip(!open)
    setQuery("")
    setIndex(0)
    setStatus("")
    setOpen(!open)
  }, [open])

  useEffect(() => onTogglePalette(toggle), [toggle])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        toggle()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [toggle])

  // Freezes the page behind the console while it is up, and hands focus back to
  // whatever the visitor was using once it comes down.
  useEffect(() => {
    if (!open) return

    restoreTo.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    setScrollLocked(true)
    inputRef.current?.focus()

    return () => {
      setScrollLocked(false)
      restoreTo.current?.focus({ preventScroll: true })
    }
  }, [open])

  useEffect(() => {
    if (open) document.getElementById(`${listId}-${active}`)?.scrollIntoView({ block: "nearest" })
  }, [open, active, listId])

  const runAt = useCallback(
    (position: number) => {
      const command = results[position]
      if (!command) return

      const message = command.run()
      if (typeof message === "string") setStatus(message)
      else close()
    },
    [results, close],
  )

  /**
   * Bound to the input rather than the dialog: in a combobox focus never leaves
   * the field, so this is where every key actually arrives.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const last = Math.max(0, results.length - 1)

    switch (event.key) {
      case "Escape":
        event.preventDefault()
        close()
        break
      case "ArrowDown":
        event.preventDefault()
        setIndex(active >= last ? 0 : active + 1)
        break
      case "ArrowUp":
        event.preventDefault()
        setIndex(active === 0 ? last : active - 1)
        break
      case "Home":
        event.preventDefault()
        setIndex(0)
        break
      case "End":
        event.preventDefault()
        setIndex(last)
        break
      case "Enter":
        event.preventDefault()
        runAt(active)
        break
      default:
        break
    }
  }

  if (!open) return null

  return createPortal(
    <div className="palette-root">
      {/* Hidden from assistive tech, which reaches the same exit through Escape.
          That is also what keeps a bare click handler legitimate here. */}
      <div aria-hidden="true" className="palette-scrim" onClick={close} />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t.palette.title}
        className="palette-panel panel panel-ticks"
      >
        <div className="flex items-center gap-3 border-b border-line px-4 py-3">
          <span aria-hidden="true" className="readout-value text-sig">
            &gt;
          </span>
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value)
              setIndex(0)
              setStatus("")
            }}
            onKeyDown={onKeyDown}
            placeholder={t.palette.placeholder}
            aria-label={t.palette.title}
            aria-expanded={true}
            aria-controls={listId}
            aria-activedescendant={results.length ? `${listId}-${active}` : undefined}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-ink outline-none placeholder:text-ink-faint"
          />
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-dim">{t.palette.empty}</p>
        ) : (
          <ul id={listId} role="listbox" aria-label={t.palette.resultsLabel} className="palette-list">
            {results.map((command, position) => (
              <Fragment key={command.id}>
                {results[position - 1]?.group === command.group ? null : (
                  <li role="presentation" className="readout palette-group">
                    {t.palette.group[command.group]}
                  </li>
                )}

                {/* The pointer affordance for a row the keyboard reaches through
                    the input above — a combobox keeps focus in the field, so key
                    handling deliberately does not live here. */}
                {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
                <li
                  role="option"
                  id={`${listId}-${position}`}
                  aria-selected={position === active}
                  onClick={() => runAt(position)}
                  onMouseMove={() => setIndex(position)}
                  className={cn("palette-option", position === active && "palette-option-on")}
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    {command.active ? (
                      <Check aria-hidden="true" className="size-3.5 shrink-0 text-sig" strokeWidth={2} />
                    ) : (
                      <span aria-hidden="true" className="palette-bullet" />
                    )}
                    <span className="truncate text-ink">{command.label}</span>
                    {command.active ? <span className="readout text-sig">{t.palette.active}</span> : null}
                  </span>

                  <span className="flex shrink-0 items-center gap-2">
                    {command.hint ? <span className="readout truncate">{command.hint}</span> : null}
                    {command.external ? (
                      <ArrowUpRight aria-hidden="true" className="size-3.5 text-ink-faint" strokeWidth={1.5} />
                    ) : null}
                  </span>
                </li>
              </Fragment>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5">
          <p aria-live="polite" className="readout truncate text-sig">
            {status}
          </p>

          <div aria-hidden="true" className="flex shrink-0 items-center gap-4">
            <Legend keys="↑↓">{t.palette.hint.navigate}</Legend>
            <Legend icon={<CornerDownLeft className="size-3" strokeWidth={2} />}>
              {t.palette.hint.run}
            </Legend>
            <Legend keys="esc">{t.palette.hint.close}</Legend>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Legend({
  keys,
  icon,
  children,
}: {
  keys?: string
  icon?: React.ReactNode
  children: string
}) {
  return (
    <span className="flex items-center gap-1.5">
      <kbd className="readout flex items-center border border-line px-1.5 py-0.5 text-ink-dim">
        {icon ?? keys}
      </kbd>
      <span className="readout text-ink-faint">{children}</span>
    </span>
  )
}

/** `github.com/HenriqueErdei` reads better in a narrow column than the full URL. */
function hostOf(url: string): string {
  try {
    const parsed = new URL(url)
    return `${parsed.host.replace(/^www\./u, "")}${parsed.pathname.replace(/\/$/u, "")}`
  } catch {
    return url
  }
}
