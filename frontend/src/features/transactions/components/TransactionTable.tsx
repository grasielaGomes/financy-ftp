import { useState } from 'react'
import { ChevronLeft, ChevronRight, SquarePen, Trash } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { Tag } from '@/components/ui/Tag'
import { TransactionTag, type TransactionTagType } from './TransactionTag'
import { CategoryIconBadge } from '@/features/categories/components/CategoryIconBadge'
import {
  categoryColorBadgeClasses,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

type TransactionRow = {
  id: string
  description: string
  date: string
  category: {
    name: string
    colorKey: CategoryColorKey
    iconKey: CategoryIconKey
  }
  type: TransactionTagType
  amount: string
}

const rows: TransactionRow[] = [
  {
    id: '1',
    description: 'Jantar no Restaurante',
    date: '30/11/25',
    category: { name: 'Alimentação', colorKey: 'blue', iconKey: 'utensils' },
    type: 'EXPENSE',
    amount: '- R$ 89,50',
  },
  {
    id: '2',
    description: 'Posto de Gasolina',
    date: '29/11/25',
    category: { name: 'Transporte', colorKey: 'purple', iconKey: 'car' },
    type: 'EXPENSE',
    amount: '- R$ 100,00',
  },
  {
    id: '3',
    description: 'Compras no Mercado',
    date: '28/11/25',
    category: { name: 'Mercado', colorKey: 'orange', iconKey: 'shopping-cart' },
    type: 'EXPENSE',
    amount: '- R$ 156,80',
  },
  {
    id: '4',
    description: 'Retorno de Investimento',
    date: '26/11/25',
    category: {
      name: 'Investimento',
      colorKey: 'green',
      iconKey: 'piggy-bank',
    },
    type: 'INCOME',
    amount: '+ R$ 340,25',
  },
  {
    id: '5',
    description: 'Aluguel',
    date: '26/11/25',
    category: { name: 'Utilidades', colorKey: 'yellow', iconKey: 'home' },
    type: 'EXPENSE',
    amount: '- R$ 1.700,00',
  },
  {
    id: '6',
    description: 'Freelance',
    date: '24/11/25',
    category: { name: 'Salário', colorKey: 'green', iconKey: 'briefcase' },
    type: 'INCOME',
    amount: '+ R$ 2.500,00',
  },
  {
    id: '7',
    description: 'Compras Jantar',
    date: '22/11/25',
    category: { name: 'Mercado', colorKey: 'orange', iconKey: 'shopping-cart' },
    type: 'EXPENSE',
    amount: '- R$ 150,00',
  },
  {
    id: '8',
    description: 'Cinema',
    date: '18/11/25',
    category: { name: 'Entretenimento', colorKey: 'pink', iconKey: 'ticket' },
    type: 'EXPENSE',
    amount: '- R$ 88,00',
  },
]

export const TransactionTable = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [deletingTransaction, setDeletingTransaction] = useState<
    Pick<TransactionRow, 'id' | 'description'> | null
  >(null)

  const handleDeleteOpenChange = (open: boolean) => {
    setIsDeleteOpen(open)

    if (!open) {
      setDeletingTransaction(null)
    }
  }

  const headers = [
    { label: 'Descrição' },
    { label: 'Data', className: 'text-center' },
    { label: 'Categoria', className: 'text-center' },
    { label: 'Tipo', className: 'text-center' },
    { label: 'Valor', className: 'text-right' },
    { label: 'Ações', className: 'text-right' },
  ]

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
            {rows.map((row) => {
              const colorClasses =
                categoryColorBadgeClasses[row.category.colorKey]
              return (
                <tr key={row.id} className="border-b border-gray-100">
                  <td className="pl-6">
                    <div className="flex items-center">
                      <CategoryIconBadge
                        iconKey={row.category.iconKey}
                        colorKey={row.category.colorKey}
                      />
                      <span className="p-6 font-medium text-gray-800">
                        {row.description}
                      </span>
                    </div>
                  </td>
                  <td className="text-sm text-gray-600 text-center">
                    {row.date}
                  </td>
                  <td className="text-center">
                    <Tag className={colorClasses}>{row.category.name}</Tag>
                  </td>
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
                      >
                        <SquarePen className="h-4 w-4 text-gray-700" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
        <span className="text-sm text-gray-700">1 a 10 | 27 resultados</span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            aria-label="Página anterior"
            disabled
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="pagination" size="icon" aria-active>
            1
          </Button>
          <Button variant="pagination" size="icon">
            2
          </Button>
          <Button variant="pagination" size="icon">
            3
          </Button>
          <Button variant="outline" size="icon" aria-label="Próxima página">
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
      />
    </Card>
  )
}
