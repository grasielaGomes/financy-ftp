import { useCallback, ReactNode } from 'react'
import { Plus } from 'lucide-react'

import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'

import { TransactionsFilters } from '@/features/transactions/components/TransactionsFilters'
import { TransactionsEmptyState } from '@/features/transactions/components/TransactionsEmptyState'
import { TransactionsErrorState } from '@/features/transactions/components/TransactionsErrorState'
import {
  TransactionsFiltersSkeleton,
  TransactionsTableSkeleton,
} from '@/features/transactions/components/TransactionsSkeletons'
import { TransactionTable } from '@/features/transactions/components/TransactionTable'
import { TransactionDialog } from '@/features/transactions/components/TransactionDialog'
import { useDebouncedValue } from '@/features/transactions/hooks/useDebouncedValue'
import { useTransactionsPage } from '@/features/transactions/hooks/useTransactionsPage'

const PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 350

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
    error,
  } = useTransactionsPage({ perPage: PER_PAGE })

  const [searchDraft, setSearchDraft] = useDebouncedValue({
    value: filters.search,
    delay: SEARCH_DEBOUNCE_MS,
    onChange: setSearch,
  })

  const isInitialLoading =
    (loading.periods || loading.categories) && rows.length === 0
  const isLoadingTransactions = loading.transactions

  const hasError = Boolean(
    error.transactions || error.periods || error.categories,
  )

  const handleRetry = useCallback(async () => {
    await actions.refetchTransactions()
  }, [actions])

  const handleTypeChange = useCallback(
    (value: string) => setType(value as typeof filters.type),
    [setType, filters.type],
  )

  const handlePrevPage = useCallback(() => goToPage(page - 1), [goToPage, page])

  const handleNextPage = useCallback(() => goToPage(page + 1), [goToPage, page])

  const handleEdit = useCallback(
    (id: string) => dialog.openEditDialog(id),
    [dialog],
  )

  const handleDelete = useCallback(
    (id: string) => actions.remove(id),
    [actions],
  )

  const handleCreate = useCallback(() => dialog.openCreateDialog(), [dialog])

  let content: ReactNode

  if (hasError) {
    content = <TransactionsErrorState onRetry={handleRetry} />
  } else if (isLoadingTransactions && rows.length === 0) {
    content = <TransactionsTableSkeleton />
  } else if (rows.length === 0) {
    content = <TransactionsEmptyState onCreate={handleCreate} />
  } else {
    content = (
      <TransactionTable
        rows={rows}
        paginationLabel={paginationLabel}
        page={page}
        totalPages={totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onGoToPage={goToPage}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoadingTransactions}
      />
    )
  }

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

      {isInitialLoading ? (
        <TransactionsFiltersSkeleton />
      ) : (
        <TransactionsFilters
          search={searchDraft}
          onSearchChange={setSearchDraft}
          type={filters.type}
          onTypeChange={handleTypeChange}
          categoryId={filters.categoryId}
          onCategoryChange={setCategoryId}
          period={filters.period}
          onPeriodChange={setPeriod}
          categoryOptions={categoryOptions}
          periodOptions={periodOptions}
          isLoading={isLoadingTransactions}
          isPeriodsLoading={loading.periods}
        />
      )}

      {content}
    </main>
  )
}
