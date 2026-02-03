import { useCallback, useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import type { DocumentNode } from 'graphql'

import { showErrorToast, showSuccessToast } from '@/lib/toast'

import {
  TRANSACTIONS_QUERY,
  TRANSACTION_PERIODS_QUERY,
  CREATE_TRANSACTION_MUTATION,
  UPDATE_TRANSACTION_MUTATION,
  DELETE_TRANSACTION_MUTATION,
} from '@/features/transactions/api/transactions.gql'
import { CATEGORIES_QUERY } from '@/features/categories/api/categories.gql'

import {
  TRANSACTION_TYPE_SIGNS,
  toTransactionType,
  type TransactionTypeFilter,
  type TransactionType,
} from '@financy/contracts'

import type {
  CategoryColorKey,
  CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'
import { toMonthLabelPTBR } from '@/features/transactions/helpers/period'

type CategoryOption = { value: string; label: string; disabled?: boolean }

type CategoryGQL = {
  id: string
  name: string
  iconKey: string
  colorKey: string
}

type TransactionGQL = {
  id: string
  title: string
  amount: number
  type: TransactionType
  occurredAt: string
  category?: {
    id: string
    name: string
    iconKey: string
    colorKey: string
  } | null
}

type TransactionPeriodGQL = {
  period: string // YYYY-MM
  count: number
}

export type TransactionRow = {
  id: string
  description: string
  date: string
  category: {
    id: string
    name: string
    colorKey: CategoryColorKey
    iconKey: CategoryIconKey
  } | null
  type: TransactionType
  amount: string
}

export type TransactionsFilters = {
  search: string
  type: TransactionTypeFilter
  categoryId: 'all' | string
  period: string // '' or YYYY-MM
}

type TransactionsQueryInput = {
  search?: string
  type?: TransactionType
  categoryId?: string
  period?: string
  page?: number
  perPage?: number
}

type TransactionsQueryData = {
  transactions: {
    total: number
    items: TransactionGQL[]
  }
}

type CategoriesQueryData = {
  categories: CategoryGQL[]
}

type TransactionPeriodsQueryData = {
  transactionPeriods: TransactionPeriodGQL[]
}

export type TransactionDialogPayload = {
  type: TransactionType
  description: string
  date: string
  amount: string
  categoryId: string
}

type RefetchQuery = { query: DocumentNode; variables?: Record<string, unknown> }

type MutationExecutor<TVariables> = (args: {
  variables: TVariables
  refetchQueries: RefetchQuery[]
  awaitRefetchQueries: boolean
}) => Promise<unknown>

const normalizeCurrencyToFloat = (raw: string): number | null => {
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

const formatCurrencyBRL = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

const formatAmountWithSign = (amount: number, type: TransactionType) => {
  const formatted = formatCurrencyBRL(amount)
  const sign = TRANSACTION_TYPE_SIGNS[type]
  return `${sign} ${formatted}`
}

const formatDateShortBR = (isoOrDateOnly: string): string => {
  const date = new Date(isoOrDateOnly)
  if (Number.isNaN(date.getTime())) return isoOrDateOnly

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date)
}

const isoToDateInput = (iso: string): string => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const year = date.getUTCFullYear()
  const month = String(date.getUTCMonth() + 1).padStart(2, '0')
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const buildPeriodOptionsFromApi = (periods: TransactionPeriodGQL[]) => {
  const apiOptions = periods.map((p) => ({
    value: p.period,
    label: `${toMonthLabelPTBR(p.period)} (${Number(p.count ?? 0)})`,
  }))

  return [{ value: '', label: 'Todos' }, ...apiOptions]
}

type UseTransactionsPageOptions = {
  perPage?: number
}

export const useTransactionsPage = (
  options: UseTransactionsPageOptions = {},
) => {
  const { perPage = 10 } = options

  const [filters, setFilters] = useState<TransactionsFilters>({
    search: '',
    type: 'all',
    categoryId: 'all',
    period: '',
  })

  const [page, setPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionGQL | null>(null)

  const categoriesQuery = useQuery<CategoriesQueryData>(CATEGORIES_QUERY)
  const periodsQuery = useQuery<TransactionPeriodsQueryData>(
    TRANSACTION_PERIODS_QUERY,
  )

  const availablePeriods = periodsQuery.data?.transactionPeriods ?? []

  const periodOptions = useMemo(() => {
    return buildPeriodOptionsFromApi(availablePeriods)
  }, [availablePeriods])

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
      (p) => p.period === filters.period,
    )
    if (stillExists) return

    const mostRecent = availablePeriods[0]?.period
    if (!mostRecent) return

    setPage(1)
    setFilters((prev) => ({ ...prev, period: mostRecent }))
  }, [availablePeriods, filters.period])

  const transactionsInput: TransactionsQueryInput = useMemo(() => {
    const input: TransactionsQueryInput = { page, perPage }

    const normalizedType = toTransactionType(filters.type)
    const normalizedCategoryId =
      filters.categoryId === 'all' ? undefined : filters.categoryId

    const search = filters.search.trim()
    const period = filters.period.trim()

    if (search !== '') input.search = search
    if (normalizedType) input.type = normalizedType
    if (normalizedCategoryId) input.categoryId = normalizedCategoryId
    if (period !== '') input.period = period

    return input
  }, [filters, page, perPage])

  const transactionsQuery = useQuery<TransactionsQueryData>(
    TRANSACTIONS_QUERY,
    {
      variables: { input: transactionsInput },
    },
  )

  const total = transactionsQuery.data?.transactions.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1
  const endIndex = total === 0 ? 0 : Math.min(page * perPage, total)

  const paginationLabel =
    total === 0
      ? '0 resultados'
      : `${startIndex} a ${endIndex} | ${total} resultados`

  const refetchAfterTransaction = useMemo<RefetchQuery[]>(() => {
    return [
      { query: TRANSACTIONS_QUERY, variables: { input: transactionsInput } },
      { query: TRANSACTION_PERIODS_QUERY },
      { query: CATEGORIES_QUERY },
    ]
  }, [transactionsInput])

  const [createTransaction, { loading: creating }] = useMutation(
    CREATE_TRANSACTION_MUTATION,
  )
  const [updateTransaction, { loading: updating }] = useMutation(
    UPDATE_TRANSACTION_MUTATION,
  )
  const [deleteTransaction, { loading: deleting }] = useMutation(
    DELETE_TRANSACTION_MUTATION,
  )

  const runMutation = useCallback(
    async <TVariables>(
      executor: MutationExecutor<TVariables>,
      variables: TVariables,
      successMessage: string,
      errorMessage: string,
    ) => {
      try {
        await executor({
          variables,
          refetchQueries: refetchAfterTransaction,
          awaitRefetchQueries: true,
        })

        showSuccessToast(successMessage)
        return true
      } catch (err) {
        showErrorToast(err, errorMessage)
        return false
      }
    },
    [refetchAfterTransaction],
  )

  const categoryOptions: CategoryOption[] = useMemo(() => {
    const items = categoriesQuery.data?.categories ?? []
    return items.map((c) => ({ value: c.id, label: c.name }))
  }, [categoriesQuery.data])

  const rows: TransactionRow[] = useMemo(() => {
    const items = transactionsQuery.data?.transactions.items ?? []

    return items.map((t) => {
      const category = t.category
        ? {
            id: t.category.id,
            name: t.category.name,
            colorKey: t.category.colorKey as CategoryColorKey,
            iconKey: t.category.iconKey as CategoryIconKey,
          }
        : null

      return {
        id: t.id,
        description: t.title,
        date: formatDateShortBR(t.occurredAt),
        category,
        type: t.type,
        amount: formatAmountWithSign(t.amount, t.type),
      }
    })
  }, [transactionsQuery.data])

  const setSearch = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, search: value }))
  }

  const setType = (value: TransactionsFilters['type']) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, type: value }))
  }

  const setCategoryId = (value: TransactionsFilters['categoryId']) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, categoryId: value }))
  }

  const setPeriod = (value: string) => {
    setPage(1)
    setFilters((prev) => ({ ...prev, period: value }))
  }

  const openCreateDialog = () => {
    setEditingTransaction(null)
    setDialogOpen(true)
  }

  const openEditDialog = (transactionId: string) => {
    const items = transactionsQuery.data?.transactions.items ?? []
    const found = items.find((t) => t.id === transactionId) ?? null
    setEditingTransaction(found)
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingTransaction(null)
  }

  const dialogInitialValues: Partial<TransactionDialogPayload> | undefined =
    useMemo(() => {
      if (!editingTransaction) return undefined

      const categoryId = editingTransaction.category?.id ?? ''
      const date = isoToDateInput(editingTransaction.occurredAt)
      const amount = formatCurrencyBRL(editingTransaction.amount)

      return {
        type: editingTransaction.type,
        description: editingTransaction.title,
        date,
        amount,
        categoryId,
      }
    }, [editingTransaction])

  const submitTransaction = async (
    payload: TransactionDialogPayload,
  ): Promise<boolean> => {
    const amount = normalizeCurrencyToFloat(payload.amount)

    if (!amount) {
      showErrorToast(null, 'Informe um valor válido.')
      return false
    }

    const occurredAt =
      payload.date.trim() === '' ? undefined : payload.date.trim()

    const categoryId =
      payload.categoryId.trim() === '' ? undefined : payload.categoryId.trim()

    if (!editingTransaction) {
      return runMutation(
        createTransaction as unknown as MutationExecutor<{
          input: {
            title: string
            amount: number
            type: TransactionType
            occurredAt?: string
            categoryId?: string
          }
        }>,
        {
          input: {
            title: payload.description,
            amount,
            type: payload.type,
            occurredAt,
            categoryId,
          },
        },
        'Transação criada com sucesso.',
        'Não foi possível criar a transação.',
      )
    }

    return runMutation(
      updateTransaction as unknown as MutationExecutor<{
        input: {
          id: string
          title: string
          amount: number
          type: TransactionType
          occurredAt?: string
          categoryId?: string
        }
      }>,
      {
        input: {
          id: editingTransaction.id,
          title: payload.description,
          amount,
          type: payload.type,
          occurredAt,
          categoryId,
        },
      },
      'Transação atualizada com sucesso.',
      'Não foi possível atualizar a transação.',
    )
  }

  const removeTransaction = (id: string): Promise<boolean> => {
    return runMutation(
      deleteTransaction as unknown as MutationExecutor<{ id: string }>,
      { id },
      'Transação removida com sucesso.',
      'Não foi possível remover a transação.',
    )
  }

  const goToPage = (nextPage: number) => {
    const safe = Math.min(Math.max(1, nextPage), totalPages)
    setPage(safe)
  }

  return {
    filters: {
      search: filters.search,
      type: filters.type,
      categoryId: filters.categoryId,
      period: filters.period,
    },
    setSearch,
    setType,
    setCategoryId,
    setPeriod,

    page,
    perPage,
    total,
    totalPages,
    paginationLabel,
    goToPage,

    categoryOptions,
    periodOptions,

    rows,

    dialog: {
      open: dialogOpen,
      setOpen: setDialogOpen,
      openCreateDialog,
      openEditDialog,
      closeDialog,
      initialValues: dialogInitialValues,
      isEditing: Boolean(editingTransaction),
      onSubmit: submitTransaction,
    },

    actions: {
      creating,
      updating,
      deleting,
      remove: removeTransaction,
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
