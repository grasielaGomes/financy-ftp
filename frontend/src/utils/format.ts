export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}

export const formatDate = (value: string | number | Date): string => {
  const date = value instanceof Date ? value : new Date(value)
  return date.toLocaleDateString('pt-BR')
}

export const getInitials = (fullName?: string | null) => {
  const name = (fullName ?? '').trim()
  if (!name) return '??'

  const parts = name.split(/\s+/).filter(Boolean)
  const first = parts[0]?.[0]
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] : parts[0]?.[1]

  return `${first ?? ''}${last ?? ''}`.toUpperCase() || '??'
}
