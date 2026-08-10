/**
 * Simple Icons CDN no longer hosts some brands (AWS, Power BI). Those fall back
 * to SVGs in `public/icons/`.
 */
const LOCAL_LOGOS: Readonly<Record<string, string>> = {
  powerbi: "/icons/powerbi.svg",
  amazonaws: "/icons/aws.svg",
}

export function subsystemLogoUrl(slug: string, color: string) {
  const local = LOCAL_LOGOS[slug]
  if (local) return local
  return `https://cdn.simpleicons.org/${slug}/${color.replace("#", "")}`
}
