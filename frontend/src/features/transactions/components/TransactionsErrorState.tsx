import { RefreshCcw } from 'lucide-react'

import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

type ErrorStateProps = {
  onRetry: () => void
}

export const TransactionsErrorState = ({ onRetry }: ErrorStateProps) => {
  return (
    <Card className="py-8 px-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid gap-1">
          <p className="text-sm font-medium text-gray-900">
            Não foi possível carregar as transações.
          </p>
          <p className="text-sm text-gray-600">
            Verifique sua conexão e tente novamente.
          </p>
        </div>

        <Button type="button" variant="outline" onClick={onRetry}>
          <RefreshCcw className="h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    </Card>
  )
}
