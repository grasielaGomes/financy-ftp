import { Search } from 'lucide-react'
import { transactionOptions } from '@financy/contracts'

import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { TextField } from '@/components/ui/TextField'

const ALL_CATEGORIES_OPTION = { value: 'all', label: 'Todas' }

type FiltersProps = {
  search: string
  onSearchChange: (value: string) => void
  type: string
  onTypeChange: (value: string) => void
  categoryId: string
  onCategoryChange: (value: string) => void
  period: string
  onPeriodChange: (value: string) => void
  categoryOptions: { value: string; label: string }[]
  periodOptions: { value: string; label: string }[]
  isLoading: boolean
  isPeriodsLoading: boolean
}

export const TransactionsFilters = ({
  search,
  onSearchChange,
  type,
  onTypeChange,
  categoryId,
  onCategoryChange,
  period,
  onPeriodChange,
  categoryOptions,
  periodOptions,
  isLoading,
  isPeriodsLoading,
}: FiltersProps) => {
  return (
    <Card className="py-5 px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <TextField
          id="transaction-search"
          label="Buscar"
          value={search}
          placeholder="Buscar por descrição"
          leftIcon={<Search className="h-4 w-4" />}
          inputProps={{
            onChange: (event) => onSearchChange(event.target.value),
          }}
        />

        <Select
          id="transaction-type"
          label="Tipo"
          value={type}
          onValueChange={onTypeChange}
          options={transactionOptions}
          disabled={isLoading}
        />

        <Select
          id="transaction-category"
          label="Categoria"
          value={categoryId}
          onValueChange={onCategoryChange}
          options={[ALL_CATEGORIES_OPTION, ...categoryOptions]}
          disabled={isLoading}
        />

        <Select
          id="transaction-period"
          label="Período"
          value={period}
          onValueChange={onPeriodChange}
          options={periodOptions}
          disabled={isLoading || isPeriodsLoading}
        />
      </div>
    </Card>
  )
}
