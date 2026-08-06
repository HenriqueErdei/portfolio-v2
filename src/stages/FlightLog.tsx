import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { useI18n } from "@/i18n/context"
import { cn } from "@/lib/cn"
import { posts, type Post } from "@/lib/posts"
import { Panel, PanelHead } from "@/ui/Panel"
import { Reveal } from "@/ui/Reveal"
import { Stage } from "@/ui/Stage"
import { StageHeading } from "@/ui/StageHeading"

const HASH_PREFIX = "#notes/"

/**
 * S-05. Technical notes, written in MDX under `content/posts/`.
 *
 * Notes open in place instead of on their own route: it keeps the console in one
 * page, and a hash deep link (`#log/<slug>`) still shares a specific note.
 */
export function FlightLog() {
  const { t } = useI18n()
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  // Honour a hash on arrival, and keep responding to back/forward afterwards.
  useEffect(() => {
    const sync = () => {
      const { hash } = window.location
      setOpenSlug(hash.startsWith(HASH_PREFIX) ? hash.slice(HASH_PREFIX.length) : null)
    }
    sync()
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  const toggle = (slug: string) => {
    const next = openSlug === slug ? null : slug
    setOpenSlug(next)
    // `replaceState` rather than assigning `location.hash`: assigning would make
    // the browser jump to the anchor and fight the smooth scroller.
    history.replaceState(null, "", next ? `${HASH_PREFIX}${next}` : window.location.pathname)
  }

  return (
    <Stage id="notes" labelledBy="notes-title">
      <StageHeading
        id="notes-title"
        designation={t.notes.designation}
        title={t.notes.title}
        subtitle={t.notes.subtitle}
      />

      {posts.length === 0 ? (
        <p className="text-ink-dim">{t.notes.empty}</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {posts.map((post, index) => (
            <Reveal key={post.slug} as="li" delay={index * 60}>
              <LogEntry post={post} open={openSlug === post.slug} onToggle={() => toggle(post.slug)} />
            </Reveal>
          ))}
        </ul>
      )}
    </Stage>
  )
}

function LogEntry({
  post,
  open,
  onToggle,
}: {
  post: Post
  open: boolean
  onToggle: () => void
}) {
  const { t, locale } = useI18n()
  const { Content } = post

  const published = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(post.meta.date))

  return (
    <Panel as="article">
      <PanelHead
        code={post.meta.lang.toUpperCase()}
        right={
          <span className="readout">
            {post.readingMinutes} {t.notes.minuteRead}
          </span>
        }
      >
        <time dateTime={post.meta.date}>{published}</time>
      </PanelHead>

      <div className="p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-2xl text-ink">{post.meta.title}</h3>
            <p className="mt-2 max-w-2xl text-ink-dim">{post.meta.summary}</p>
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-controls={`log-body-${post.slug}`}
            className="readout flex shrink-0 items-center gap-2 border border-line px-3 py-2 text-ink-dim transition-colors hover:border-sig hover:text-sig"
          >
            {open ? t.notes.backToNotes : t.notes.readMore}
            <ChevronDown
              aria-hidden="true"
              className={cn("size-3.5 transition-transform duration-300", open && "rotate-180")}
              strokeWidth={2}
            />
          </button>
        </div>

        {post.meta.tags && post.meta.tags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {post.meta.tags.map((tag) => (
              <li key={tag} className="readout border border-line-soft px-2 py-1 text-ink-dim">
                #{tag}
              </li>
            ))}
          </ul>
        ) : null}

        <div
          id={`log-body-${post.slug}`}
          hidden={!open}
          className="prose-log mt-6 border-t border-line-soft pt-6"
        >
          <Content />
        </div>
      </div>
    </Panel>
  )
}
