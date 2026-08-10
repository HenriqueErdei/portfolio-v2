import type { Locale } from "#content/types"

const SIZE = { width: 20, height: 14 }

/** Compact flag glyphs for the locale switcher — readable at ~14px height. */
export function FlagIcon({
  locale,
  className,
}: {
  locale: Locale
  className?: string
}) {
  const props = {
    className,
    width: SIZE.width,
    height: SIZE.height,
    viewBox: `0 0 ${SIZE.width} ${SIZE.height}`,
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true as const,
  }

  if (locale === "pt") {
    return (
      <svg {...props}>
        <rect width={20} height={14} fill="#009b3a" rx={0.5} />
        <polygon fill="#fedf00" points="10,1.2 18.4,7 10,12.8 1.6,7" />
        <circle cx={10} cy={7} r={2.6} fill="#002776" />
        <path
          fill="#fff"
          d="M10 5.1c.9.5 1.5 1.1 1.5 1.9s-.6 1.4-1.5 1.9c-.9-.5-1.5-1.1-1.5-1.9s.6-1.4 1.5-1.9z"
          opacity={0.9}
        />
      </svg>
    )
  }

  if (locale === "en") {
    return (
      <svg {...props}>
        <rect width={20} height={14} fill="#b22234" rx={0.5} />
        {[1, 3, 5, 7, 9, 11, 13].map((y) => (
          <rect key={y} y={y} width={20} height={1} fill="#fff" />
        ))}
        <rect width={8.2} height={7.7} fill="#3c3b6e" />
        {[0, 1.55, 3.1, 4.65, 6.2].map((y) =>
          [0, 1.65, 3.3, 4.95].map((x) => (
            <circle key={`${x}-${y}`} cx={x + 0.9} cy={y + 0.9} r={0.32} fill="#fff" />
          )),
        )}
      </svg>
    )
  }

  return (
    <svg {...props}>
      <rect width={20} height={14} fill="#c60b1e" rx={0.5} />
      <rect y={3.5} width={20} height={7} fill="#ffc400" />
      <rect x={4.2} y={5.2} width={2.4} height={3.6} fill="#c60b1e" opacity={0.85} />
    </svg>
  )
}
