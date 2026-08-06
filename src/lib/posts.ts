import type { ComponentType } from "react"
import type { Locale } from "#content/types"

/** Frontmatter contract for every file in `content/posts/`. */
export interface PostMeta {
  readonly title: string
  /** ISO date, `YYYY-MM-DD`. Used for sorting and for the `<time>` element. */
  readonly date: string
  readonly summary: string
  readonly tags?: readonly string[]
  /** Which language the note is written in. Notes are not translated. */
  readonly lang: Locale
  /** Set to `false` to keep a draft in the repo but off the site. */
  readonly published?: boolean
}

export interface Post {
  readonly slug: string
  readonly meta: PostMeta
  readonly Content: ComponentType
  readonly readingMinutes: number
}

interface PostModule {
  readonly meta: PostMeta
  readonly default: ComponentType
}

const modules = import.meta.glob<PostModule>("../../content/posts/*.mdx", { eager: true })

// A second pass over the same files as raw text, purely to count words. Vite
// drops both into the same chunk, so this costs nothing extra at runtime.
const sources = import.meta.glob("../../content/posts/*.mdx", {
  eager: true,
  query: "?raw",
})

const WORDS_PER_MINUTE = 220

const slugOf = (path: string) => path.split("/").at(-1)?.replace(/\.mdx$/, "") ?? path

/**
 * Pulls the text out of whatever the raw glob handed back. Depending on the Vite
 * version a `?raw` entry arrives either as the string itself or wrapped as
 * `{ default: string }`, so neither shape can be assumed.
 */
function rawText(entry: unknown): string {
  if (typeof entry === "string") return entry

  if (entry && typeof entry === "object" && "default" in entry) {
    const value = (entry as { default: unknown }).default
    if (typeof value === "string") return value
  }

  return ""
}

function readingMinutes(entry: unknown): number {
  const source = rawText(entry)
  if (!source) return 1

  // Strip the frontmatter block before counting, or the metadata inflates it.
  const body = source.replace(/^---[\s\S]*?---/, "")
  const words = body.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

/** Published notes, newest first. */
export const posts: readonly Post[] = Object.entries(modules)
  .map(([path, module]) => ({
    slug: slugOf(path),
    meta: module.meta,
    Content: module.default,
    readingMinutes: readingMinutes(sources[path]),
  }))
  .filter((post) => post.meta.published !== false)
  .sort((a, b) => b.meta.date.localeCompare(a.meta.date))

export const findPost = (slug: string): Post | undefined =>
  posts.find((post) => post.slug === slug)
