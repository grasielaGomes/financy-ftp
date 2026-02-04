import { CircleMinus, CirclePlus, Plus, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { TransactionType } from '@financy/contracts'

import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { CategoryIconBadge } from '@/features/categories/components/CategoryIconBadge'
import { categoryColorBadgeClasses } from '@/features/categories/helpers/categoryOptions'

import { DashboardSectionCard } from './DashboardSectionCard'

type RecentTransaction = {
  id: string
  title: string
  date: string
  amount: string
  type: TransactionType
  category: {
    id: string
    name: string
    iconKey: Parameters<typeof CategoryIconBadge>[0]['iconKey']
    colorKey: Parameters<typeof CategoryIconBadge>[0]['colorKey']
  } | null
}

type RecentTransactionsCardProps = {
  transactions: RecentTransaction[]
  isLoading?: boolean
  onCreateTransaction: () => void
}

const EmptyState = () => {
  return (
    <tr>
      <td
        colSpan={3}
        className="px-4 py-8 text-center text-sm text-gray-600 sm:px-6"
      >
        Nenhuma transação recente encontrada.
      </td>
    </tr>
  )
}

const CategoryTag = ({
  category,
}: {
  category: RecentTransaction['category']
}) => {
  if (!category) {
    return (
      <Tag className="border border-gray-200 bg-gray-100 text-gray-600">
        Sem categoria
      </Tag>
    )
  }

  return (
    <Tag className={categoryColorBadgeClasses[category.colorKey]}>
      {category.name}
    </Tag>
  )
}

const AmountIndicator = ({
  type,
  amount,
}: {
  type: TransactionType
  amount: string
}) => {
  let typeIcon = <CircleMinus className="h-4 w-4 text-red-base" />

  if (type === 'INCOME') {
    typeIcon = <CirclePlus className="h-4 w-4 text-green-base" />
  }

  return (
    <div className="inline-flex min-w-max items-center justify-end gap-2 whitespace-nowrap text-sm font-semibold text-gray-800">
      <span>{amount}</span>
      {typeIcon}
    </div>
  )
}

const TransactionRow = ({
  transaction,
}: {
  transaction: RecentTransaction
}) => {
  let categoryIcon = <div className="h-9 w-9 rounded-md bg-gray-100" />

  if (transaction.category) {
    categoryIcon = (
      <CategoryIconBadge
        iconKey={transaction.category.iconKey}
        colorKey={transaction.category.colorKey}
      />
    )
  }

  return (
    <tr className="border-b border-gray-100">
      <td className="w-full py-6 pl-6">
        <div className="flex min-w-0 items-center gap-3">
          {categoryIcon}

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-800">
              {transaction.title}
            </p>
            <p className="text-xs text-gray-500">{transaction.date}</p>
          </div>
        </div>
      </td>

      <td className="pr-6 text-center">
        <CategoryTag category={transaction.category} />
      </td>

      <td className="pr-6 text-right">
        <AmountIndicator type={transaction.type} amount={transaction.amount} />
      </td>
    </tr>
  )
}

export const RecentTransactionsCard = ({
  transactions,
  isLoading = false,
  onCreateTransaction,
}: RecentTransactionsCardProps) => {
  let bodyContent = (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <tbody>
          {transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </tbody>
      </table>
    </div>
  )

  if (transactions.length === 0) {
    bodyContent = (
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <tbody>
            <EmptyState />
          </tbody>
        </table>
      </div>
    )
  }

  if (isLoading) {
    bodyContent = (
      <div className="px-4 py-8 text-sm text-gray-600 sm:px-6">
        Carregando...
      </div>
    )
  }

  return (
    <DashboardSectionCard
      title="Transações recentes"
      action={
        <Button variant="link" size="link" asChild>
          <Link to="/transactions" className="inline-flex items-center gap-1">
            Ver todas
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      }
      footer={
        <div className="flex justify-center ">
          <Button
            variant="link"
            size="link"
            onClick={onCreateTransaction}
            className="inline-flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Nova transação
          </Button>
        </div>
      }
    >
      {bodyContent}
    </DashboardSectionCard>
  )
}
