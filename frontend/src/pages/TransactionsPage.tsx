import { PageHeader } from '@/components/ui/PageHeader'
import { Plus } from 'lucide-react'

export const TransactionsPage = () => {
  return (
    <main className="page">
      <PageHeader
        title="Transações"
        description="Gerencie todas as suas transações financeiras"
        buttonLabel="Nova transação"
        buttonIcon={<Plus />}
      />
    </main>
  )
}
