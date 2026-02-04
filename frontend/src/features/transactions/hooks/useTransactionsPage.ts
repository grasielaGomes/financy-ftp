import { useCallback, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'

import { CATEGORIES_QUERY } from '@/features/categories/api/categories.gql'
import {
  TRANSACTIONS_QUERY,
  TRANSACTION_PERIODS_QUERY,
} from '@/features/transactions/api/transactions.gql'
import type {
  CategoryColorKey,
  CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

import { useTransactionDialogState } from './useTransactionDialogState'
import { useTransactionFiltersState } from './useTransactionFiltersState'
import { useTransactionMutations } from './useTransactionMutations'
import {
  buildPaginationLabel,
  buildPeriodOptionsFromApi,
  formatAmountWithSign,
  formatDateShortBR,
} from './transactionsPage.utils'
import type {
  CategoriesQueryData,
  CategoryOption,
  TransactionRow,
  TransactionPeriodsQueryData,
  TransactionsQueryData,
  UseTransactionsPageOptions,
} from './transactionsPage.types'

export type { TransactionDialogPayload, TransactionRow, TransactionsFilters } from './transactionsPage.types'

export const useTransactionsPage = (options: UseTransactionsPageOptions = {}) => {
  const { perPage = 10 } = options

  const categoriesQuery = useQuery<CategoriesQueryData>(CATEGORIES_QUERY)
  const periodsQuery = useQuery<TransactionPeriodsQueryData>(
    TRANSACTION_PERIODS_QUERY,
  )

  const availablePeriods = periodsQuery.data?.transactionPeriods ?? []
  const periodOptions = useMemo(
    () => buildPeriodOptionsFromApi(availablePeriods),
    [availablePeriods],
  )

  const filtersState = useTransactionFiltersState(availablePeriods, perPage)

  const transactionsQuery = useQuery<TransactionsQueryData>(
    TRANSACTIONS_QUERY,
    {
      variables: { input: filtersState.transactionsInput },
    },
  )

  const total = transactionsQuery.data?.transactions.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const paginationLabel = buildPaginationLabel(
    total,
    filtersState.page,
    perPage,
  )

  const goToPage = useCallback(
    (nextPage: number) => {
      const safe = Math.min(Math.max(1, nextPage), totalPages)
      filtersState.setPage(safe)
    },
    [filtersState, totalPages],
  )

  const categoryOptions: CategoryOption[] = useMemo(() => {
    const items = categoriesQuery.data?.categories ?? []
    return items.map((category) => ({ value: category.id, label: category.name }))
  }, [categoriesQuery.data])

  const transactionItems = transactionsQuery.data?.transactions.items ?? []

  const rows: TransactionRow[] = useMemo(
    () =>
      transactionItems.map((transaction) => {
        const category = transaction.category
          ? {
              id: transaction.category.id,
              name: transaction.category.name,
              colorKey: transaction.category.colorKey as CategoryColorKey,
              iconKey: transaction.category.iconKey as CategoryIconKey,
            }
          : null

        return {
          id: transaction.id,
          description: transaction.title,
          date: formatDateShortBR(transaction.occurredAt),
          category,
          type: transaction.type,
          amount: formatAmountWithSign(transaction.amount, transaction.type),
        }
      }),
    [transactionItems],
  )

  const mutations = useTransactionMutations(filtersState.transactionsInput)
  const dialog = useTransactionDialogState(
    transactionItems,
    mutations.submitTransaction,
  )

  return {
    filters: {
      search: filtersState.filters.search,
      type: filtersState.filters.type,
      categoryId: filtersState.filters.categoryId,
      period: filtersState.filters.period,
      setSearch: filtersState.setSearch,
      setType: filtersState.setType,
      setCategoryId: filtersState.setCategoryId,
      setPeriod: filtersState.setPeriod,
    },

    pagination: {
      page: filtersState.page,
      totalPages,
      paginationLabel,
      goToPage,
    },

    options: {
      categoryOptions,
      periodOptions,
    },

    table: {
      rows,
    },

    dialog,

    actions: {
      creating: mutations.creating,
      updating: mutations.updating,
      deleting: mutations.deleting,
      remove: mutations.removeTransaction,
      refetchTransactions: transactionsQuery.refetch,
    },

    loading: {
      categories: categoriesQuery.loading,
      transactions: transactionsQuery.loading,
      periods: periodsQuery.loading,
    },

    error: {
      categories: categoriesQuery.error,
      transactions: transactionsQuery.error,
      periods: periodsQuery.error,
    },
  }
}
