import "@testing-library/jest-dom/vitest"
import { vi } from "vitest"

/**
 * jsdom has no `matchMedia`, and both the theme and the capability checks ask for
 * it on first render. Default every query to "does not match", which is the
 * conservative answer: tests run as a motion-friendly dark theme.
 */
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Used by the reveal-on-scroll hook and the stage spy. Never fires, so elements
// simply stay in their initial state unless a test drives it directly.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ""
  readonly thresholds: readonly number[] = []
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
  takeRecords = vi.fn(() => [])
}

vi.stubGlobal("IntersectionObserver", IntersectionObserverStub)
