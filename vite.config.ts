import { fileURLToPath } from "node:url"
import mdx from "@mdx-js/rollup"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import rehypeSlug from "rehype-slug"
import remarkFrontmatter from "remark-frontmatter"
import remarkGfm from "remark-gfm"
import remarkMdxFrontmatter from "remark-mdx-frontmatter"
import { defineConfig } from "vitest/config"

const resolvePath = (relative: string) => fileURLToPath(new URL(relative, import.meta.url))

export default defineConfig({
  plugins: [
    // `enforce: "pre"` so MDX becomes JSX before the React plugin runs, which is
    // what lets Fast Refresh work inside posts.
    {
      enforce: "pre",
      ...mdx({
        remarkPlugins: [remarkGfm, remarkFrontmatter, [remarkMdxFrontmatter, { name: "meta" }]],
        rehypePlugins: [rehypeSlug],
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": resolvePath("./src"),
      "#content": resolvePath("./content"),
    },
  },
  build: {
    target: "es2022",
    cssTarget: "chrome111",
    // three.js dwarfs everything else; splitting it keeps the entry chunk small
    // enough that the first paint does not wait on the 3D scene.
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
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
