import { Component, type ErrorInfo, type ReactNode } from "react"

/**
 * Catches anything the WebGL scene throws on the way up — a lost context, a
 * shader that will not compile on some driver — and reports it so the app can
 * stop trying. The scene is decoration, so failing to draw it must never take the
 * portfolio down with it.
 *
 * Has to be a class: error boundaries still have no hook equivalent.
 */
export class SceneBoundary extends Component<
  { children: ReactNode; onFail: () => void },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Worth keeping in the console: this is the one failure mode that is
    // invisible to the visitor and therefore never gets reported.
    console.warn("Background scene failed to render", error, info.componentStack)
    this.props.onFail()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
