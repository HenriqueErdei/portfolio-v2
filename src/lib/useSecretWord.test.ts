import { describe, expect, it } from "vitest"

function matchesSecret(buffer: string, word: string) {
  return buffer.slice(-word.length) === word
}

describe("secret word buffer", () => {
  it("matches snake at the tail of the buffer", () => {
    expect(matchesSecret("snake", "snake")).toBe(true)
    expect(matchesSecret("xxsnake", "snake")).toBe(true)
    expect(matchesSecret("sna", "snake")).toBe(false)
    expect(matchesSecret("snak", "snake")).toBe(false)
  })
})
