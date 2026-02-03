import { useState } from 'react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { TextField } from '@/components/ui/TextField'
import { Plus, Search } from 'lucide-react'
import { TransactionTable } from '@/features/transactions/components/TransactionTable'

export const TransactionsPage = () => {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('all')
  const [category, setCategory] = useState('all')
  const [period, setPeriod] = useState('2025-11')

  return (
    <main className="page flex flex-col gap-8">
      <PageHeader
        title="Transações"
        description="Gerencie todas as suas transações financeiras"
        buttonLabel="Nova transação"
        buttonIcon={<Plus />}
      />

      <Card className="py-5 px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TextField
            id="transaction-search"
            label="Buscar"
            value={search}
            placeholder="Buscar por descrição"
            leftIcon={<Search className="h-4 w-4" />}
            inputProps={{
              onChange: (event) => setSearch(event.target.value),
            }}
          />

          <Select
            id="transaction-type"
            label="Tipo"
            value={type}
            onValueChange={setType}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'income', label: 'Entradas' },
              { value: 'expense', label: 'Saídas' },
            ]}
          />

          <Select
            id="transaction-category"
            label="Categoria"
            value={category}
            onValueChange={setCategory}
            options={[
              { value: 'all', label: 'Todas' },
              { value: 'housing', label: 'Moradia' },
              { value: 'food', label: 'Alimentação' },
              { value: 'transport', label: 'Transporte' },
            ]}
          />

          <Select
            id="transaction-period"
            label="Período"
            value={period}
            onValueChange={setPeriod}
            options={[
              { value: '2025-11', label: 'Novembro / 2025' },
              { value: '2025-10', label: 'Outubro / 2025' },
              { value: '2025-09', label: 'Setembro / 2025' },
            ]}
          />
        </div>
      </Card>

      <TransactionTable />
    </main>
  )
}
