import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, SquarePen, Trash } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Tag } from '@/components/ui/Tag'
import { TransactionTag } from './TransactionTag'
import { CategoryIconBadge } from '@/features/categories/components/CategoryIconBadge'
import {
  categoryColorBadgeClasses,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'
import type { TransactionType } from '@financy/contracts'

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

type TransactionTableProps = {
  rows: TransactionRow[]
  paginationLabel: string
  page: number
  totalPages: number
  onPrevPage: () => void
  onNextPage: () => void
  onGoToPage?: (page: number) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => Promise<boolean> | boolean
  isLoading?: boolean
}

const SkeletonCell = ({
  align = 'left',
}: {
  align?: 'left' | 'center' | 'right'
}) => {
  const alignment =
    align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto'

  return (
    <div className={['h-4 w-24 rounded bg-gray-200', alignment].join(' ')} />
  )
}

const SkeletonBadge = () => {
  return <div className="h-6 w-24 rounded bg-gray-200 mx-auto" />
}

const SkeletonIcon = () => {
  return <div className="h-10 w-10 rounded-full bg-gray-200" />
}

const SkeletonRow = () => {
  return (
    <tr className="border-b border-gray-100 animate-pulse">
      <td className="pl-6 py-4">
        <div className="flex items-center">
          <SkeletonIcon />
          <div className="pl-6 w-full">
            <div className="h-4 w-48 rounded bg-gray-200" />
          </div>
        </div>
      </td>
      <td className="text-center py-4">
        <SkeletonCell align="center" />
      </td>
      <td className="text-center py-4">
        <SkeletonBadge />
      </td>
      <td className="text-center py-4">
        <SkeletonCell align="center" />
      </td>
      <td className="text-right py-4 pr-2">
        <SkeletonCell align="right" />
      </td>
      <td className="text-right pr-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <div className="h-9 w-9 rounded bg-gray-200" />
          <div className="h-9 w-9 rounded bg-gray-200" />
        </div>
      </td>
    </tr>
  )
}

export const TransactionTable = ({
  rows,
  paginationLabel,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
  onGoToPage,
  onEdit,
  onDelete,
  isLoading = false,
}: TransactionTableProps) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingTransaction, setDeletingTransaction] = useState<{
    id: string
    description: string
  } | null>(null)

  const handleDeleteOpenChange = (open: boolean) => {
    setIsDeleteOpen(open)
    if (!open) setDeletingTransaction(null)
  }

  const headers = useMemo(
    () => [
      { label: 'Descrição' },
      { label: 'Data', className: 'text-center' },
      { label: 'Categoria', className: 'text-center' },
      { label: 'Tipo', className: 'text-center' },
      { label: 'Valor', className: 'text-right' },
      { label: 'Ações', className: 'text-right' },
    ],
    [],
  )

  const pages = useMemo(() => {
    const maxButtons = 3
    const safeTotal = Math.max(1, totalPages)
    const safePage = Math.min(Math.max(1, page), safeTotal)

    if (safeTotal <= maxButtons) {
      return Array.from({ length: safeTotal }, (_, i) => i + 1)
    }

    const start = Math.max(1, safePage - 1)
    const end = Math.min(safeTotal, start + maxButtons - 1)

    const normalizedStart = Math.max(1, end - (maxButtons - 1))
    return Array.from(
      { length: end - normalizedStart + 1 },
      (_, i) => normalizedStart + i,
    )
  }, [page, totalPages])

  const canPrev = page > 1 && !isLoading
  const canNext = page < totalPages && !isLoading

  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return false
    const result = await onDelete(deletingTransaction.id)
    return result !== false
  }

  const renderCategoryCell = (row: TransactionRow) => {
    if (!row.category) {
      return (
        <Tag className="bg-gray-100 text-gray-600 border border-gray-200">
          Sem categoria
        </Tag>
      )
    }

    const colorClasses = categoryColorBadgeClasses[row.category.colorKey]
    return <Tag className={colorClasses}>{row.category.name}</Tag>
  }

  return (
    <Card className="overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {headers.map((header) => (
                <th
                  key={header.label}
                  className={[
                    'px-6 py-5 text-xs font-medium uppercase tracking-wide text-gray-500',
                    header.className,
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <>
                {Array.from({ length: 6 }, (_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </>
            ) : rows.length === 0 ? (
              <tr>
                <td
                  colSpan={headers.length}
                  className="px-6 py-10 text-center text-sm text-gray-600"
                >
                  Nenhuma transação encontrada.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-100">
                  <td className="pl-6">
                    <div className="flex items-center">
                      {row.category ? (
                        <CategoryIconBadge
                          iconKey={row.category.iconKey}
                          colorKey={row.category.colorKey}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-100" />
                      )}

                      <span className="p-6 font-medium text-gray-800">
                        {row.description}
                      </span>
                    </div>
                  </td>

                  <td className="text-sm text-gray-600 text-center">
                    {row.date}
                  </td>

                  <td className="text-center">{renderCategoryCell(row)}</td>

                  <td className="text-center">
                    <TransactionTag type={row.type} />
                  </td>

                  <td className="text-sm font-semibold text-gray-800 text-right">
                    {row.amount}
                  </td>

                  <td className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        type="button"
                        aria-label="Excluir transação"
                        disabled={isLoading}
                        onClick={() => {
                          setDeletingTransaction({
                            id: row.id,
                            description: row.description,
                          })
                          setIsDeleteOpen(true)
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
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
        <span className="text-sm text-gray-700">{paginationLabel}</span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled={!canPrev}
            onClick={onPrevPage}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pages.map((p) => (
            <Button
              key={p}
              variant="pagination"
              size="icon"
              aria-active={p === page}
              disabled={isLoading || !onGoToPage}
              onClick={() => onGoToPage?.(p)}
            >
              {p}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            aria-label="Próxima página"
            disabled={!canNext}
            onClick={onNextPage}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={isDeleteOpen}
        onOpenChange={handleDeleteOpenChange}
        title="Excluir transação"
        description={
          <>
            Tem certeza que deseja excluir a transação
            {deletingTransaction ? ` “${deletingTransaction.description}”` : ''}
            ? Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={handleConfirmDelete}
      />
    </Card>
  )
}
