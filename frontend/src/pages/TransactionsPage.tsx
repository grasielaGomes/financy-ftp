import { Plus, Search } from 'lucide-react'
import { transactionOptions } from '@financy/contracts'

import { PageHeader } from '@/components/ui/PageHeader'
import { Card } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'

import { TransactionTable } from '@/features/transactions/components/TransactionTable'
import { TransactionDialog } from '@/features/transactions/components/TransactionDialog'
import { useTransactionsPage } from '@/features/transactions/hooks/useTransactionsPage'

export const TransactionsPage = () => {
  const {
    filters,
    setSearch,
    setType,
    setCategoryId,
    setPeriod,

    page,
    totalPages,
    paginationLabel,
    goToPage,

    categoryOptions,
    periodOptions,

    rows,

    dialog,

    actions,
    loading,
  } = useTransactionsPage({ perPage: 10 })

  console.log(
    'periodOptions',
    periodOptions.map((p) => p.label),
  )

  return (
    <main className="page flex flex-col gap-8">
      <PageHeader
        title="Transações"
        description="Gerencie todas as suas transações financeiras"
        action={
          <TransactionDialog
            open={dialog.open}
            onOpenChange={dialog.setOpen}
            onSubmit={dialog.onSubmit}
            initialValues={dialog.initialValues}
            title={dialog.isEditing ? 'Editar transação' : 'Nova transação'}
            description={
              dialog.isEditing
                ? 'Atualize os dados da transação'
                : 'Registre sua despesa ou receita'
            }
            submitLabel={dialog.isEditing ? 'Salvar alterações' : 'Salvar'}
            categoryOptions={categoryOptions}
            trigger={
              <Button size="sm" onClick={dialog.openCreateDialog}>
                <Plus />
                Nova transação
              </Button>
            }
          />
        }
      />

      <Card className="py-5 px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TextField
            id="transaction-search"
            label="Buscar"
            value={filters.search}
            placeholder="Buscar por descrição"
            leftIcon={<Search className="h-4 w-4" />}
            inputProps={{
              onChange: (event) => setSearch(event.target.value),
            }}
          />

          <Select
            id="transaction-type"
            label="Tipo"
            value={filters.type}
            onValueChange={(value) => setType(value as typeof filters.type)}
            options={transactionOptions}
          />

          <Select
            id="transaction-category"
            label="Categoria"
            value={filters.categoryId}
            onValueChange={setCategoryId}
            options={[{ value: 'all', label: 'Todas' }, ...categoryOptions]}
          />

          <Select
            id="transaction-period"
            label="Período"
            value={filters.period}
            onValueChange={setPeriod}
            options={periodOptions}
          />
        </div>
      </Card>

      <TransactionTable
        rows={rows}
        paginationLabel={paginationLabel}
        page={page}
        totalPages={totalPages}
        onPrevPage={() => goToPage(page - 1)}
        onNextPage={() => goToPage(page + 1)}
        onGoToPage={goToPage}
        onEdit={(id) => dialog.openEditDialog(id)}
        onDelete={(id) => actions.deleteTransaction(id)}
        isLoading={loading.transactions}
      />
    </main>
  )
}
