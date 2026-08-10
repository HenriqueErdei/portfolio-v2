import { writeFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"
import { SITE_URL } from "./content/site"

const resolvePath = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

/** Injects the public origin into HTML and writes robots/sitemap on build. */
function siteMetaPlugin() {
  return {
    name: "site-meta",
    transformIndexHtml(html: string) {
      return html.replaceAll("__SITE_URL__", SITE_URL)
    },
    closeBundle() {
      writeFileSync(
        "dist/robots.txt",
        ["User-agent: *", "Allow: /", "", `Sitemap: ${SITE_URL}/sitemap.xml`, ""].join("\n"),
      )
      writeFileSync(
        "dist/sitemap.xml",
        [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          "  <url>",
          `    <loc>${SITE_URL}/</loc>`,
          "    <changefreq>monthly</changefreq>",
          "    <priority>1.0</priority>",
          "  </url>",
          "</urlset>",
          "",
        ].join("\n"),
      )
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), siteMetaPlugin()],
  resolve: {
    alias: {
      "@": resolvePath("./src"),
      "#content": resolvePath("./content"),
    },
  },
  build: {
    target: "es2022",
    cssTarget: "chrome111",
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber"],
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}", "src/test/**", "src/three/**"],
    },
  },
})
