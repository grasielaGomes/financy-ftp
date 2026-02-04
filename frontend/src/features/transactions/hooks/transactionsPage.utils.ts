import {
  TRANSACTION_TYPE_SIGNS,
  toTransactionType,
  type TransactionType,
} from '@financy/contracts'

import { toMonthLabelPTBR } from '@/features/transactions/helpers/period'
import type {
  TransactionPeriodGQL,
  TransactionsFilters,
  TransactionsQueryInput,
} from './transactionsPage.types'

export const normalizeCurrencyToFloat = (raw: string): number | null => {
  const cleaned = raw
    .replace(/\s/g, '')
    .replace(/^R\$\s?/, '')
    .replace(/\./g, '')
    .replace(',', '.')
    .replace(/[^\d.]/g, '')

  if (cleaned.trim() === '') return null

  const parsed = Number(cleaned)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

export const normalizeSearchTerm = (raw: string): string =>
  raw.trim().replace(/\s+/g, ' ')

export const formatCurrencyBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export const formatAmountWithSign = (amount: number, type: TransactionType) => {
  const formatted = formatCurrencyBRL(amount)
  const sign = TRANSACTION_TYPE_SIGNS[type]
  return `${sign} ${formatted}`
}

export const formatDateShortBR = (isoOrDateOnly: string): string => {
  const date = new Date(isoOrDateOnly)
  if (Number.isNaN(date.getTime())) return isoOrDateOnly

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date)
}

export const isoToDateInput = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const buildPeriodOptionsFromApi = (periods: TransactionPeriodGQL[]) => {
  const apiOptions = periods.map((p) => ({
    value: p.period,
    label: `${toMonthLabelPTBR(p.period)} (${Number(p.count ?? 0)})`,
  }))

  return [{ value: '', label: 'Todos' }, ...apiOptions]
}

export const buildTransactionsInput = (
  filters: TransactionsFilters,
  page: number,
  perPage: number,
): TransactionsQueryInput => {
  const input: TransactionsQueryInput = { page, perPage }

  const normalizedType = toTransactionType(filters.type)
  const normalizedCategoryId =
    filters.categoryId === 'all' ? undefined : filters.categoryId

  const search = normalizeSearchTerm(filters.search)
  const period = filters.period.trim()

  if (search !== '') input.search = search
  if (normalizedType) input.type = normalizedType
  if (normalizedCategoryId) input.categoryId = normalizedCategoryId
  if (period !== '') input.period = period

  return input
}

export const buildPaginationLabel = (total: number, page: number, perPage: number) => {
  const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1
  const endIndex = total === 0 ? 0 : Math.min(page * perPage, total)

  return total === 0
    ? '0 resultados'
    : `${startIndex} a ${endIndex} | ${total} resultados`
}
