import type { Locale } from "#content/types"
import type { Dict } from "./dict"
import { en } from "./en"
import { es } from "./es"
import { pt } from "./pt"

/**
 * All three dictionaries, keyed by locale. Kept apart from the provider because
 * the command palette needs to name a language in that language — "Español", not
 * "Spanish" — which means reading a dictionary that is not the active one.
 */
export const DICTIONARIES: Readonly<Record<Locale, Dict>> = { pt, en, es }
