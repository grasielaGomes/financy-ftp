import type { DocumentNode } from 'graphql'

import type {
  TransactionType,
  TransactionTypeFilter,
} from '@financy/contracts'

import type {
  CategoryColorKey,
  CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

export type CategoryOption = { value: string; label: string; disabled?: boolean }

export type CategoryGQL = {
  id: string
  name: string
  iconKey: string
  colorKey: string
}

export type TransactionGQL = {
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

export type TransactionPeriodGQL = {
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

export type TransactionsQueryInput = {
  search?: string
  type?: TransactionType
  categoryId?: string
  period?: string
  page?: number
  perPage?: number
}

export type TransactionsQueryData = {
  transactions: {
    total: number
    items: TransactionGQL[]
  }
}

export type CategoriesQueryData = {
  categories: CategoryGQL[]
}

export type TransactionPeriodsQueryData = {
  transactionPeriods: TransactionPeriodGQL[]
}

export type TransactionDialogPayload = {
  type: TransactionType
  description: string
  date: string
  amount: string
  categoryId: string
}

export type RefetchQuery = {
  query: DocumentNode
  variables?: Record<string, unknown>
}

export type MutationExecutor<TVariables> = (args: {
  variables: TVariables
  refetchQueries: RefetchQuery[]
  awaitRefetchQueries: boolean
}) => Promise<unknown>

export type UseTransactionsPageOptions = {
  perPage?: number
}
