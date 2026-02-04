import { useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import {
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'
import { TransactionTableBodyContent } from './TransactionTableBodyContent'
import { getPaginationRange } from '@/features/transactions/helpers/getPaginationRange'
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
  onDelete: (transaction: Pick<TransactionRow, 'id' | 'description'>) => void
  isLoading?: boolean
}

type TableHeader = {
  label: string
  className?: string
}

const TABLE_HEADERS: TableHeader[] = [
  { label: 'Descrição' },
  { label: 'Data', className: 'text-center' },
  { label: 'Categoria', className: 'text-center' },
  { label: 'Tipo', className: 'text-center' },
  { label: 'Valor', className: 'text-right' },
  { label: 'Ações', className: 'text-right' },
]

type PaginationControlsProps = {
  pages: number[]
  currentPage: number
  canPrev: boolean
  canNext: boolean
  isLoading: boolean
  onPrevPage: () => void
  onNextPage: () => void
  onGoToPage?: (page: number) => void
}

const PaginationControls = ({
  pages,
  currentPage,
  canPrev,
  canNext,
  isLoading,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: PaginationControlsProps) => {
  return (
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
          aria-active={p === currentPage}
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
  const pages = useMemo(() => getPaginationRange(page, totalPages), [page, totalPages])

  const canPrev = page > 1 && !isLoading
  const canNext = page < totalPages && !isLoading

  return (
    <Card className="overflow-hidden">
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-left">
              {TABLE_HEADERS.map((header) => (
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
            <TransactionTableBodyContent
              rows={rows}
              isLoading={isLoading}
              columnCount={TABLE_HEADERS.length}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
        <span className="text-sm text-gray-700">{paginationLabel}</span>

        <PaginationControls
          pages={pages}
          currentPage={page}
          canPrev={canPrev}
          canNext={canNext}
          isLoading={isLoading}
          onPrevPage={onPrevPage}
          onNextPage={onNextPage}
          onGoToPage={onGoToPage}
        />
      </div>
    </Card>
  )
}
