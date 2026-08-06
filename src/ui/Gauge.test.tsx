import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { LinearGauge, SegmentedGauge } from "./Gauge"

describe("SegmentedGauge", () => {
  it("exposes the level to assistive tech rather than only lighting boxes", () => {
    render(<SegmentedGauge value={3} label="React — Level 3/5" />)

    const meter = screen.getByRole("meter", { name: "React — Level 3/5" })
    expect(meter).toHaveAttribute("aria-valuenow", "3")
    expect(meter).toHaveAttribute("aria-valuemax", "5")
  })

  it("lights exactly as many segments as the value", () => {
    const { container } = render(<SegmentedGauge value={2} label="test" />)

    const lit = container.querySelectorAll('[data-on="true"]')
    const unlit = container.querySelectorAll('[data-on="false"]')

    expect(lit).toHaveLength(2)
    expect(unlit).toHaveLength(3)
  })
})

describe("LinearGauge", () => {
  it("reports progress as a percentage", () => {
    render(<LinearGauge value={0.42} label="Page progress" />)

    expect(screen.getByRole("progressbar", { name: "Page progress" })).toHaveAttribute(
      "aria-valuenow",
      "42",
    )
  })
})
