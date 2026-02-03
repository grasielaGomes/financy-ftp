import { Plus } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

type EmptyStateProps = {
  onCreate: () => void
}

export const TransactionsEmptyState = ({ onCreate }: EmptyStateProps) => {
  return (
    <Card className="py-10 px-6">
      <div className="grid gap-2 text-center">
        <p className="text-sm font-medium text-gray-900">
          Nenhuma transação encontrada
        </p>
        <p className="text-sm text-gray-600">
          Ajuste os filtros ou crie uma nova transação.
        </p>
      </div>
    </Card>
  )
}
