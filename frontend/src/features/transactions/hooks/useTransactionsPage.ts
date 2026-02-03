import * as React from 'react'
import { useMutation, useQuery } from '@apollo/client/react'
import type { DocumentNode } from 'graphql'

import { showErrorToast, showSuccessToast } from '@/lib/toast'

import {
  TRANSACTIONS_QUERY,
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

import {
  buildPeriodOptions,
  getCurrentPeriod,
} from '@/features/transactions/helpers/period'

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
  period: string
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

export type TransactionDialogPayload = {
  type: TransactionType
  description: string
  date: string // YYYY-MM-DD (input)
  amount: string
  categoryId: string
}

type UseTransactionsPageOptions = {
  initialPeriod?: string
  perPage?: number
  periodOptionsCount?: number
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

export const useTransactionsPage = (
  options: UseTransactionsPageOptions = {},
) => {
  const {
    initialPeriod = getCurrentPeriod(),
    perPage = 10,
    periodOptionsCount = 24,
  } = options

  const [filters, setFilters] = React.useState<TransactionsFilters>({
    search: '',
    type: 'all',
    categoryId: 'all',
    period: initialPeriod,
  })

  const [page, setPage] = React.useState(1)

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingTransaction, setEditingTransaction] =
    React.useState<TransactionGQL | null>(null)

  const periodOptions = React.useMemo(
    () => buildPeriodOptions(periodOptionsCount),
    [periodOptionsCount],
  )

  const categoriesQuery = useQuery<CategoriesQueryData>(CATEGORIES_QUERY)

  const transactionsInput: TransactionsQueryInput = React.useMemo(() => {
    const input: TransactionsQueryInput = {
      page,
      perPage,
    }

    const normalizedType = toTransactionType(filters.type)
    const normalizedCategoryId =
      filters.categoryId === 'all' ? undefined : filters.categoryId

    if (filters.search.trim() !== '') input.search = filters.search.trim()
    if (normalizedType) input.type = normalizedType
    if (normalizedCategoryId) input.categoryId = normalizedCategoryId
    if (filters.period.trim() !== '') input.period = filters.period.trim()

    return input
  }, [filters, page, perPage])

  const transactionsQuery = useQuery<TransactionsQueryData>(
    TRANSACTIONS_QUERY,
    {
      variables: { input: transactionsInput },
    },
  )

  const [createTransaction, { loading: creating }] = useMutation(
    CREATE_TRANSACTION_MUTATION,
  )
  const [updateTransaction, { loading: updating }] = useMutation(
    UPDATE_TRANSACTION_MUTATION,
  )
  const [deleteTransaction, { loading: deleting }] = useMutation(
    DELETE_TRANSACTION_MUTATION,
  )

  const transactionsRefetch: RefetchQuery[] = React.useMemo(
    () => [
      { query: TRANSACTIONS_QUERY, variables: { input: transactionsInput } },
    ],
    [transactionsInput],
  )

  const runMutation = React.useCallback(
    async <TVariables>(
      executor: MutationExecutor<TVariables>,
      variables: TVariables,
      successMessage: string,
      errorMessage: string,
    ) => {
      try {
        await executor({
          variables,
          refetchQueries: transactionsRefetch,
          awaitRefetchQueries: true,
        })

        showSuccessToast(successMessage)
        return true
      } catch (err) {
        showErrorToast(err, errorMessage)
        return false
      }
    },
    [transactionsRefetch],
  )

  const categoryOptions: CategoryOption[] = React.useMemo(() => {
    const items = categoriesQuery.data?.categories ?? []
    return items.map((c) => ({ value: c.id, label: c.name }))
  }, [categoriesQuery.data])

  const rows: TransactionRow[] = React.useMemo(() => {
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

  const total = transactionsQuery.data?.transactions.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / perPage))
  const startIndex = total === 0 ? 0 : (page - 1) * perPage + 1
  const endIndex = total === 0 ? 0 : Math.min(page * perPage, total)

  const paginationLabel =
    total === 0
      ? '0 resultados'
      : `${startIndex} a ${endIndex} | ${total} resultados`

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

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

    if (!found) {
      showErrorToast(
        null,
        'Não foi possível carregar os dados da transação para edição.',
      )
      return false
    }

    setEditingTransaction(found)
    setDialogOpen(true)
    return true
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingTransaction(null)
  }

  const dialogInitialValues: Partial<TransactionDialogPayload> | undefined =
    React.useMemo(() => {
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

  const maybeSyncPeriodFromDate = (dateInput: string) => {
    const trimmed = dateInput.trim()
    if (trimmed === '') return

    const nextPeriod = trimmed.slice(0, 7) // YYYY-MM
    if (nextPeriod.length !== 7) return

    if (nextPeriod !== filters.period) {
      setPage(1)
      setFilters((prev) => ({ ...prev, period: nextPeriod }))
    }
  }

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
      const ok = await runMutation(
        createTransaction,
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

      if (ok) {
        maybeSyncPeriodFromDate(payload.date)
        closeDialog()
      }
      return ok
    }

    const ok = await runMutation(
      updateTransaction,
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

    if (ok) {
      maybeSyncPeriodFromDate(payload.date)
      closeDialog()
    }
    return ok
  }

  const handleDeleteTransaction = async (id: string): Promise<boolean> => {
    return runMutation(
      deleteTransaction,
      { id },
      'Transação removida com sucesso.',
      'Não foi possível remover a transação.',
    )
  }

  const goToPage = (nextPage: number) => {
    const safe = Math.min(Math.max(1, nextPage), totalPages)
    setPage(safe)
  }

  const isBusy = creating || updating || deleting

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
      deleteTransaction: handleDeleteTransaction,
      refetchTransactions: transactionsQuery.refetch,
    },

    loading: {
      categories: categoriesQuery.loading,
      transactions: transactionsQuery.loading,
      creating,
      updating,
      deleting,
      isBusy,
    },

    error: {
      categories: categoriesQuery.error,
      transactions: transactionsQuery.error,
    },
  }
}
