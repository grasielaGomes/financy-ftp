import { useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { TRANSACTION_TYPE_SIGNS, type TransactionType } from '@financy/contracts'

import { DASHBOARD_SUMMARY_QUERY } from '@/features/dashboard/api/dashboard.gql'
import { TRANSACTIONS_QUERY } from '@/features/transactions/api/transactions.gql'
import {
  getSafeColorKey,
  getSafeIconKey,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'
import { formatCurrency } from '@/utils/format'

const RECENT_LIMIT = 5

type DashboardSummaryCategory = {
  transactionsCount: number
  total: number
  income: number
  expense: number
  category: {
    id: string
    name: string
    iconKey: unknown
    colorKey: unknown
  }
}

type DashboardSummaryData = {
  dashboardSummary: {
    period: string
    balanceTotal: number
    monthIncome: number
    monthExpense: number
    categories: DashboardSummaryCategory[]
  }
}

type DashboardSummaryVariables = {
  input?: {
    period?: string
    recentLimit?: number
  }
}

type TransactionsData = {
  transactions: {
    items: Array<{
      id: string
      title: string
      amount: number
      type: TransactionType
      occurredAt: string
      category: {
        id: string
        name: string
        iconKey: unknown
        colorKey: unknown
      } | null
    }>
  }
}

type TransactionsVariables = {
  input: {
    page: number
    perPage: number
  }
}

type RecentTransactionItem = {
  id: string
  title: string
  date: string
  amount: string
  type: TransactionType
  category: {
    id: string
    name: string
    iconKey: CategoryIconKey
    colorKey: CategoryColorKey
  } | null
}

type CategorySummaryItem = {
  id: string
  name: string
  colorKey: CategoryColorKey
  transactionsCount: number
  totalFormatted: string
}

const formatDateShortBR = (raw: string) => {
  const date = new Date(raw)

  if (Number.isNaN(date.getTime())) return raw

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }).format(date)
}

const formatAmountWithSign = (amount: number, type: TransactionType) => {
  return `${TRANSACTION_TYPE_SIGNS[type]} ${formatCurrency(amount)}`
}

const formatItemsCount = (value: number) => {
  return `${value} ${value === 1 ? 'item' : 'itens'}`
}

export const useDashboardPage = () => {
  const summaryQuery = useQuery<DashboardSummaryData, DashboardSummaryVariables>(
    DASHBOARD_SUMMARY_QUERY,
  )

  const recentTransactionsQuery = useQuery<TransactionsData, TransactionsVariables>(
    TRANSACTIONS_QUERY,
    {
      variables: {
        input: {
          page: 1,
          perPage: RECENT_LIMIT,
        },
      },
    },
  )

  const summary = summaryQuery.data?.dashboardSummary

  const metricCards = useMemo(
    () => ({
      balanceTotal: formatCurrency(summary?.balanceTotal ?? 0),
      monthIncome: formatCurrency(summary?.monthIncome ?? 0),
      monthExpense: formatCurrency(summary?.monthExpense ?? 0),
    }),
    [summary],
  )

  const recentTransactions = useMemo<RecentTransactionItem[]>(() => {
    const items = recentTransactionsQuery.data?.transactions.items ?? []

    return items.map((transaction) => ({
      id: transaction.id,
      title: transaction.title,
      date: formatDateShortBR(transaction.occurredAt),
      amount: formatAmountWithSign(transaction.amount, transaction.type),
      type: transaction.type,
      category: transaction.category
        ? {
            id: transaction.category.id,
            name: transaction.category.name,
            iconKey: getSafeIconKey(transaction.category.iconKey),
            colorKey: getSafeColorKey(transaction.category.colorKey),
          }
        : null,
    }))
  }, [recentTransactionsQuery.data])

  const categoriesSummary = useMemo<CategorySummaryItem[]>(() => {
    const categories = summary?.categories ?? []

    return categories.slice(0, 5).map((item) => ({
      id: item.category.id,
      name: item.category.name,
      colorKey: getSafeColorKey(item.category.colorKey),
      transactionsCount: item.transactionsCount,
      totalFormatted: formatCurrency(Math.abs(item.total ?? 0)),
    }))
  }, [summary])

  const hasInitialData =
    recentTransactions.length > 0 || categoriesSummary.length > 0 || Boolean(summary)

  return {
    metrics: metricCards,
    recentTransactions,
    categoriesSummary,

    loading: {
      summary: summaryQuery.loading,
      recentTransactions: recentTransactionsQuery.loading,
      initial: !hasInitialData && (summaryQuery.loading || recentTransactionsQuery.loading),
    },

    error: {
      summary: summaryQuery.error,
      recentTransactions: recentTransactionsQuery.error,
      hasError: Boolean(summaryQuery.error || recentTransactionsQuery.error),
    },

    actions: {
      async refetch() {
        await Promise.all([summaryQuery.refetch(), recentTransactionsQuery.refetch()])
      },
    },

    helpers: {
      formatItemsCount,
    },
  }
}
