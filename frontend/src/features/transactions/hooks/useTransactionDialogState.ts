import { useCallback, useMemo, useState } from 'react'

import {
  formatCurrencyBRL,
  isoToDateInput,
} from './transactionsPage.utils'
import type {
  TransactionDialogPayload,
  TransactionGQL,
} from './transactionsPage.types'

export const useTransactionDialogState = (
  items: TransactionGQL[],
  submitTransaction: (
    payload: TransactionDialogPayload,
    editingTransaction: TransactionGQL | null,
  ) => Promise<boolean>,
) => {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionGQL | null>(null)

  const openCreateDialog = useCallback(() => {
    setEditingTransaction(null)
    setDialogOpen(true)
  }, [])

  const openEditDialog = useCallback(
    (transactionId: string) => {
      const found =
        items.find((transaction) => transaction.id === transactionId) ?? null
      setEditingTransaction(found)
      setDialogOpen(true)
    },
    [items],
  )

  const closeDialog = useCallback(() => {
    setDialogOpen(false)
    setEditingTransaction(null)
  }, [])

  const dialogInitialValues: Partial<TransactionDialogPayload> | undefined =
    useMemo(() => {
      if (!editingTransaction) return undefined

      const categoryId = editingTransaction.category?.id ?? ''
      const date = isoToDateInput(editingTransaction.occurredAt)
      const amount = formatCurrencyBRL(editingTransaction.amount)

      return {
        type: editingTransaction.type,
        description: editingTransaction.title,
        date,
        amount,
        categoryId,
      }
    }, [editingTransaction])

  const handleSubmit = useCallback(
    (payload: TransactionDialogPayload) =>
      submitTransaction(payload, editingTransaction),
    [editingTransaction, submitTransaction],
  )

  return {
    open: dialogOpen,
    setOpen: setDialogOpen,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    initialValues: dialogInitialValues,
    isEditing: Boolean(editingTransaction),
    onSubmit: handleSubmit,
  }
}
