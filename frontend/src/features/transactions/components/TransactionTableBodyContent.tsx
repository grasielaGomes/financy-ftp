import { SquarePen, Trash } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Tag } from '@/components/ui/Tag'
import { TransactionTag } from './TransactionTag'
import { TransactionTableSkeletonRows } from './TransactionTableSkeleton'
import { CategoryIconBadge } from '@/features/categories/components/CategoryIconBadge'
import { categoryColorBadgeClasses } from '@/features/categories/helpers/categoryOptions'
import type { TransactionRow } from './TransactionTable'

type CategoryCellProps = {
  category: TransactionRow['category']
}

const CategoryCell = ({ category }: CategoryCellProps) => {
  if (!category) {
    return (
      <Tag className="border border-gray-200 bg-gray-100 text-gray-600">
        Sem categoria
      </Tag>
    )
  }

  const colorClasses = categoryColorBadgeClasses[category.colorKey]
  return <Tag className={colorClasses}>{category.name}</Tag>
}

const CategoryIcon = ({ category }: CategoryCellProps) => {
  if (!category) {
    return <div className="h-10 w-10 rounded-full bg-gray-100" />
  }

  return (
    <CategoryIconBadge
      iconKey={category.iconKey}
      colorKey={category.colorKey}
    />
  )
}

type TransactionTableBodyContentProps = {
  rows: TransactionRow[]
  isLoading: boolean
  columnCount: number
  onEdit: (id: string) => void
  onDelete: (transaction: Pick<TransactionRow, 'id' | 'description'>) => void
}

export const TransactionTableBodyContent = ({
  rows,
  isLoading,
  columnCount,
  onEdit,
  onDelete,
}: TransactionTableBodyContentProps) => {
  if (isLoading) {
    return <TransactionTableSkeletonRows />
  }

  if (rows.length === 0) {
    return (
      <tr>
        <td
          colSpan={columnCount}
          className="px-6 py-10 text-center text-sm text-gray-600"
        >
          Nenhuma transação encontrada.
        </td>
      </tr>
    )
  }

  return rows.map((row) => (
    <tr key={row.id} className="border-b border-gray-100">
      <td className="pl-6">
        <div className="flex items-center">
          <CategoryIcon category={row.category} />

          <span className="p-6 font-medium text-gray-800">{row.description}</span>
        </div>
      </td>

      <td className="text-sm text-center text-gray-600">{row.date}</td>

      <td className="text-center">
        <CategoryCell category={row.category} />
      </td>

      <td className="text-center">
        <TransactionTag type={row.type} />
      </td>

      <td className="text-right text-sm font-semibold text-gray-800">
        {row.amount}
      </td>

      <td className="pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="icon"
            type="button"
            aria-label="Excluir transação"
            disabled={isLoading}
            onClick={() => {
              onDelete({
                id: row.id,
                description: row.description,
              })
            }}
          >
            <Trash className="h-4 w-4 text-danger" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            type="button"
            aria-label="Editar transação"
            disabled={isLoading}
            onClick={() => onEdit(row.id)}
          >
            <SquarePen className="h-4 w-4 text-gray-700" />
          </Button>
        </div>
      </td>
    </tr>
  ))
}
