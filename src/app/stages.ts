/**
 * The sections of the page, in order. This array is the single source of truth
 * for navigation, scroll spying, keyboard jumps and the progress rail — add a
 * section here and every one of them picks it up.
 *
 * `id` doubles as the DOM id (so `#work` is a real deep link) and as the key into
 * `t.nav`, which is why the dictionary uses exactly these names. Changing an id
 * changes a public URL, so treat them as stable.
 */
export const STAGES = [
  { id: "intro", designation: "00" },
  { id: "about", designation: "01" },
  { id: "path", designation: "02" },
  { id: "work", designation: "03" },
  { id: "stack", designation: "04" },
  { id: "contact", designation: "05" },
] as const

export type StageId = (typeof STAGES)[number]["id"]

export const STAGE_IDS: readonly StageId[] = STAGES.map((stage) => stage.id)
