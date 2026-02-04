import { useCallback, type ReactNode } from 'react'
import { Plus } from 'lucide-react'

import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'

import {
  TransactionDialog,
  TransactionTable,
  TransactionsEmptyState,
  TransactionsErrorState,
  TransactionsFilters,
  TransactionsFiltersSkeleton,
  TransactionsTableSkeleton,
  useDebouncedValue,
  useTransactionsPage,
  type TransactionRow,
} from '@/features/transactions'
import { useConfirmDelete } from '@/hooks/useConfirmDelete'

const PER_PAGE = 10
const SEARCH_DEBOUNCE_MS = 350

export const TransactionsPage = () => {
  const {
    filters,
    pagination,
    options,
    table,

    dialog,

    actions,
    loading,
    error,
  } = useTransactionsPage({ perPage: PER_PAGE })

  const [searchDraft, setSearchDraft] = useDebouncedValue({
    value: filters.search,
    delay: SEARCH_DEBOUNCE_MS,
    onChange: filters.setSearch,
  })
  const deleteConfirmation = useConfirmDelete<
    Pick<TransactionRow, 'id' | 'description'>
  >((transaction) => actions.remove(transaction.id))

  const isInitialLoading =
    (loading.periods || loading.categories) && table.rows.length === 0
  const isLoadingTransactions = loading.transactions

  const hasError = Boolean(
    error.transactions || error.periods || error.categories,
  )

  const handleRetry = useCallback(async () => {
    await actions.refetchTransactions()
  }, [actions])

  const handleTypeChange = useCallback(
    (value: string) => filters.setType(value as typeof filters.type),
    [filters],
  )

  const handlePrevPage = useCallback(
    () => pagination.goToPage(pagination.page - 1),
    [pagination],
  )

  const handleNextPage = useCallback(
    () => pagination.goToPage(pagination.page + 1),
    [pagination],
  )

  const handleEdit = useCallback(
    (id: string) => dialog.openEditDialog(id),
    [dialog],
  )

  const handleDelete = useCallback(
    (transaction: Pick<TransactionRow, 'id' | 'description'>) => {
      deleteConfirmation.requestDelete(transaction)
    },
    [deleteConfirmation],
  )

  const handleCreate = useCallback(() => dialog.openCreateDialog(), [dialog])

  let content: ReactNode

  if (hasError) {
    content = <TransactionsErrorState onRetry={handleRetry} />
  } else if (isLoadingTransactions && table.rows.length === 0) {
    content = <TransactionsTableSkeleton />
  } else if (table.rows.length === 0) {
    content = <TransactionsEmptyState onCreate={handleCreate} />
  } else {
    content = (
      <TransactionTable
        rows={table.rows}
        paginationLabel={pagination.paginationLabel}
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onGoToPage={pagination.goToPage}
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
          <Button size="sm" onClick={dialog.openCreateDialog}>
            <Plus />
            Nova transação
          </Button>
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
          onCategoryChange={filters.setCategoryId}
          period={filters.period}
          onPeriodChange={filters.setPeriod}
          categoryOptions={options.categoryOptions}
          periodOptions={options.periodOptions}
          isLoading={isLoadingTransactions}
          isPeriodsLoading={loading.periods}
        />
      )}

      {content}

      <TransactionDialog
        open={dialog.open}
        onOpenChange={dialog.setOpen}
        onSubmit={dialog.onSubmit}
        isEditing={dialog.isEditing}
        initialValues={dialog.initialValues}
        categoryOptions={options.categoryOptions}
      />

      <ConfirmDialog
        open={deleteConfirmation.open}
        onOpenChange={deleteConfirmation.onOpenChange}
        title="Excluir transação"
        description={
          <>
            Tem certeza que deseja excluir a transação
            {deleteConfirmation.item
              ? ` “${deleteConfirmation.item.description}”`
              : ''}
            ? Essa ação não pode ser desfeita.
          </>
        }
        confirmLabel="Excluir"
        cancelLabel="Cancelar"
        onConfirm={deleteConfirmation.onConfirm}
      />
    </main>
  )
}
