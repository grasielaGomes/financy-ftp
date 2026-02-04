import { useCallback, useEffect, useMemo, useState } from 'react'

import { buildTransactionsInput } from './transactionsPage.utils'
import type {
  TransactionPeriodGQL,
  TransactionsFilters,
} from './transactionsPage.types'

const DEFAULT_FILTERS: TransactionsFilters = {
  search: '',
  type: 'all',
  categoryId: 'all',
  period: '',
}

export const useTransactionFiltersState = (
  availablePeriods: TransactionPeriodGQL[],
  perPage: number,
) => {
  const [filters, setFilters] = useState<TransactionsFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  // Auto-pick the most recent period
  useEffect(() => {
    if (filters.period !== '') return
    if (availablePeriods.length === 0) return

    const mostRecent = availablePeriods[0]?.period
    if (!mostRecent) return

    setFilters((prev) => ({ ...prev, period: mostRecent }))
  }, [availablePeriods, filters.period])

  // If selected period no longer exists, fallback to most recent
  useEffect(() => {
    if (filters.period === '') return
    if (availablePeriods.length === 0) return

    const stillExists = availablePeriods.some(
      (periodOption) => periodOption.period === filters.period,
    )
    if (stillExists) return

    const mostRecent = availablePeriods[0]?.period
    if (!mostRecent) return

    setPage(1)
    setFilters((prev) => ({ ...prev, period: mostRecent }))
  }, [availablePeriods, filters.period])

  const transactionsInput = useMemo(
    () => buildTransactionsInput(filters, page, perPage),
    [filters, page, perPage],
  )

  const updateFilter = useCallback((next: Partial<TransactionsFilters>) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, ...next }))
  }, [])

  const setSearch = useCallback(
    (value: string) => updateFilter({ search: value }),
    [updateFilter],
  )

  const setType = useCallback(
    (value: TransactionsFilters['type']) => updateFilter({ type: value }),
    [updateFilter],
  )

  const setCategoryId = useCallback(
    (value: TransactionsFilters['categoryId']) =>
      updateFilter({ categoryId: value }),
    [updateFilter],
  )

  const setPeriod = useCallback(
    (value: string) => updateFilter({ period: value }),
    [updateFilter],
  )

  return {
    filters,
    page,
    setPage,
    transactionsInput,
    setSearch,
    setType,
    setCategoryId,
    setPeriod,
  }
}
