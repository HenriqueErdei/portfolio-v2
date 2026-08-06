import "@fontsource-variable/space-grotesk"
import "@fontsource-variable/jetbrains-mono"
import "@/app/styles/global.css"

import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "@/App"
import { I18nProvider } from "@/i18n/I18nProvider"
import { SmoothScroll } from "@/lib/SmoothScroll"
import { ThemeProvider } from "@/theme/ThemeProvider"

const container = document.getElementById("root")
if (!container) throw new Error("#root is missing from index.html")

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <I18nProvider>
        <SmoothScroll>
          <App />
        </SmoothScroll>
      </I18nProvider>
    </ThemeProvider>
  </StrictMode>,
)
