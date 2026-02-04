import { useCallback, useMemo } from 'react'
import { useQuery } from '@apollo/client/react'
import { ArrowDownCircle, ArrowUpCircle, Wallet } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CATEGORIES_QUERY } from '@/features/categories'
import {
  CategoriesSummaryCard,
  RecentTransactionsCard,
  useDashboardPage,
} from '@/features/dashboard'
import {
  MetricCard,
  TransactionDialog,
  useTransactionDialogState,
  useTransactionMutations,
  type CategoriesQueryData,
} from '@/features/transactions'

const RECENT_LIMIT = 5

export const DashboardPage = () => {
  const {
    metrics,
    recentTransactions,
    categoriesSummary,
    loading,
    error,
    actions,
    helpers,
  } = useDashboardPage()
  const categoriesQuery = useQuery<CategoriesQueryData>(CATEGORIES_QUERY)
  const transactionMutations = useTransactionMutations({
    page: 1,
    perPage: RECENT_LIMIT,
  })

  const categoryOptions = useMemo(() => {
    const items = categoriesQuery.data?.categories ?? []
    return items.map((category) => ({
      value: category.id,
      label: category.name,
    }))
  }, [categoriesQuery.data])

  const transactionDialog = useTransactionDialogState([], async (payload) => {
    const didSave = await transactionMutations.submitTransaction(payload, null)

    if (didSave) {
      await actions.refetch()
    }

    return didSave
  })
  const { openCreateDialog } = transactionDialog

  const handleCreateTransaction = useCallback(() => {
    openCreateDialog()
  }, [openCreateDialog])

  if (error.hasError && !loading.initial) {
    return (
      <main className="page">
        <Card className="flex flex-col items-center gap-4 px-4 py-10 text-center sm:px-6">
          <p className="text-sm text-danger">
            Não foi possível carregar os dados do dashboard.
          </p>
          <Button variant="outline" size="sm" onClick={() => actions.refetch()}>
            Tentar novamente
          </Button>
        </Card>
      </main>
    )
  }

  return (
    <main className="page flex flex-col gap-4">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <MetricCard
            icon={<Wallet className="text-purple-base" />}
            label="Saldo total"
            value={metrics.balanceTotal}
          />
          <MetricCard
            icon={<ArrowUpCircle className="text-green-base" />}
            label="Receitas do mês"
            value={metrics.monthIncome}
          />
        </div>
        <MetricCard
          icon={<ArrowDownCircle className="text-red-base" />}
          label="Despesas do mês"
          value={metrics.monthExpense}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
        <RecentTransactionsCard
          transactions={recentTransactions}
          isLoading={
            loading.recentTransactions && recentTransactions.length === 0
          }
          onCreateTransaction={handleCreateTransaction}
        />

        <CategoriesSummaryCard
          categories={categoriesSummary}
          isLoading={loading.summary && categoriesSummary.length === 0}
          formatItemsCount={helpers.formatItemsCount}
        />
      </section>

      <TransactionDialog
        open={transactionDialog.open}
        onOpenChange={transactionDialog.setOpen}
        onSubmit={transactionDialog.onSubmit}
        isEditing={transactionDialog.isEditing}
        initialValues={transactionDialog.initialValues}
        categoryOptions={categoryOptions}
      />
    </main>
  )
}
