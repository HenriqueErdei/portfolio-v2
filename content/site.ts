/**
 * Public site origin for SEO, Open Graph and sitemap generation.
 * Override at build time with `VITE_SITE_URL=https://seu-dominio.com`.
 */
export const SITE_URL = (process.env.VITE_SITE_URL ?? "https://henriqueerdei.netlify.app").replace(
  /\/$/,
  "",
)
