export const MAX_VISIBLE_PAGES = 3

export const getPaginationRange = (page: number, totalPages: number) => {
  const safeTotal = Math.max(1, totalPages)
  const safePage = Math.min(Math.max(1, page), safeTotal)

  if (safeTotal <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: safeTotal }, (_, index) => index + 1)
  }

  const start = Math.max(1, safePage - 1)
  const end = Math.min(safeTotal, start + MAX_VISIBLE_PAGES - 1)
  const normalizedStart = Math.max(1, end - (MAX_VISIBLE_PAGES - 1))

  return Array.from(
    { length: end - normalizedStart + 1 },
    (_, index) => normalizedStart + index,
  )
}
