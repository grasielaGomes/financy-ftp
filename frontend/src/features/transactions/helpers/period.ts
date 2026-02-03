export type PeriodValue = `${number}-${string}` | '' // '' = all

const pad2 = (n: number) => String(n).padStart(2, '0')

export const toYYYYMM = (date: Date) => {
  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  return `${year}-${month}` as `${number}-${string}`
}

export const getCurrentPeriod = () => toYYYYMM(new Date())

const MONTHS_PT_BR = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
] as const

export const toMonthLabelPTBR = (period: string) => {
  if (!period) return 'Todos'

  const [yRaw, mRaw] = period.split('-')
  const year = Number(yRaw)
  const month = Number(mRaw)

  if (!Number.isFinite(year) || !Number.isFinite(month)) return period
  if (month < 1 || month > 12) return period

  return `${MONTHS_PT_BR[month - 1]} / ${year}`
}

export const buildRecentPeriods = (count: number) => {
  const now = new Date()
  const cursor = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const periods: string[] = []

  for (let i = 0; i < count; i++) {
    periods.push(toYYYYMM(cursor))
    cursor.setUTCMonth(cursor.getUTCMonth() - 1)
  }

  return periods
}

export const buildPeriodOptions = (count: number) => {
  const periods = buildRecentPeriods(count)
  return [
    { value: '', label: 'Todos' },
    ...periods.map((p) => ({ value: p, label: toMonthLabelPTBR(p) })),
  ]
}
