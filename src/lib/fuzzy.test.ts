import { describe, expect, it } from "vitest"
import { fold, score } from "./fuzzy"

describe("fold", () => {
  it("strips accents and case so Portuguese is typeable on any keyboard", () => {
    expect(fold("Trajetória")).toBe("trajetoria")
    expect(fold("Construído")).toBe("construido")
  })
})

describe("score", () => {
  it("accepts a subsequence and rejects anything else", () => {
    expect(score("Subsystems", "sub")).not.toBeNull()
    expect(score("Subsystems", "sst")).not.toBeNull()
    expect(score("Subsystems", "xyz")).toBeNull()
  })

  it("lets an empty query through without favouring anything", () => {
    expect(score("anything", "")).toBe(0)
    expect(score("other", "")).toBe(0)
  })

  it("ignores accents in both directions", () => {
    expect(score("Trajetória", "trajetoria")).not.toBeNull()
    expect(score("Trajetoria", "trajetória")).not.toBeNull()
  })

  it("prefers a prefix over a match buried in the middle", () => {
    const prefix = score("Stack", "st")
    const buried = score("Subsystems", "st")
    expect(prefix).toBeGreaterThan(buried!)
  })

  it("prefers a word start over the same letters mid-word", () => {
    const wordStart = score("Power BI", "pb")
    const midWord = score("Pandas by hand", "pb")
    expect(wordStart).toBeGreaterThan(midWord!)
  })

  it("prefers consecutive characters over scattered ones", () => {
    const together = score("contact", "con")
    const scattered = score("clean options now", "con")
    expect(together).toBeGreaterThan(scattered!)
  })

  it("ignores spaces in the query, so two words can be typed as one", () => {
    expect(score("Power BI", "power bi")).toBe(score("Power BI", "powerbi"))
  })
})
