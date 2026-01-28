export const normalizeTitle = (value: string): string => {
  return (
    value
      .trim()
      .toLowerCase()
      // remove diacritics (accents)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      // collapse whitespace
      .replace(/\s+/g, ' ')
  )
}
