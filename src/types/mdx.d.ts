/**
 * `@mdx-js/rollup` turns every `.mdx` file into a React component, and
 * `remark-mdx-frontmatter` adds a named `meta` export built from the YAML block
 * at the top. TypeScript knows about neither, so this declares the shape both
 * sides agree on.
 */
declare module "*.mdx" {
  import type { ComponentType } from "react"
  import type { PostMeta } from "@/lib/posts"

  export const meta: PostMeta
  const MDXComponent: ComponentType<{ components?: Record<string, unknown> }>
  export default MDXComponent
}
