/** DDD + celular as `+55 11 92581-5808`. */
export function formatPhoneBR(digits: string) {
  const d = digits.replace(/\D/g, "")
  if (d.length === 11) return `+55 ${d.slice(0, 2)} ${d.slice(2, 7)}-${d.slice(7)}`
  return digits
}
