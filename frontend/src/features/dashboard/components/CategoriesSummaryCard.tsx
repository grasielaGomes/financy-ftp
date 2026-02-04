import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import {
  categoryColorBadgeClasses,
  type CategoryColorKey,
} from '@/features/categories/helpers/categoryOptions'

import { DashboardSectionCard } from './DashboardSectionCard'

type CategoriesSummaryItem = {
  id: string
  name: string
  colorKey: CategoryColorKey
  transactionsCount: number
  totalFormatted: string
}

type CategoriesSummaryCardProps = {
  categories: CategoriesSummaryItem[]
  isLoading?: boolean
  formatItemsCount: (value: number) => string
}

const EmptyState = () => {
  return (
    <tr>
      <td
        colSpan={3}
        className="px-4 py-8 text-center text-sm text-gray-600 sm:px-6"
      >
        Nenhuma categoria encontrada neste período.
      </td>
    </tr>
  )
}

const CategoryRow = ({
  category,
  formatItemsCount,
}: {
  category: CategoriesSummaryItem
  formatItemsCount: CategoriesSummaryCardProps['formatItemsCount']
}) => {
  return (
    <tr>
      <td className="pl-6 pb-5">
        <Tag className={categoryColorBadgeClasses[category.colorKey]}>
          {category.name}
        </Tag>
      </td>

      <td className="text-right text-xs text-gray-500">
        {formatItemsCount(category.transactionsCount)}
      </td>

      <td className="text-right pr-6">
        <strong className="text-sm font-semibold text-gray-800">
          {category.totalFormatted}
        </strong>
      </td>
    </tr>
  )
}

export const CategoriesSummaryCard = ({
  categories,
  isLoading = false,
  formatItemsCount,
}: CategoriesSummaryCardProps) => {
  let bodyContent = (
    <div className="w-full overflow-x-auto py-6">
      <table className="w-full border-collapse">
        <tbody>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              formatItemsCount={formatItemsCount}
            />
          ))}
        </tbody>
      </table>
    </div>
  )

  if (categories.length === 0) {
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
      title="Categorias"
      action={
        <Button variant="link" size="link" asChild>
          <Link to="/categories" className="inline-flex items-center gap-1">
            Gerenciar
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      }
    >
      {bodyContent}
    </DashboardSectionCard>
  )
}
