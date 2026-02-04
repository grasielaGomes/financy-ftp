import { useCallback, useMemo } from 'react'
import { useMutation } from '@apollo/client/react'

import { showErrorToast, showSuccessToast } from '@/lib/toast'

import {
  TRANSACTIONS_QUERY,
  TRANSACTION_PERIODS_QUERY,
  CREATE_TRANSACTION_MUTATION,
  UPDATE_TRANSACTION_MUTATION,
  DELETE_TRANSACTION_MUTATION,
} from '@/features/transactions/api/transactions.gql'
import { CATEGORIES_QUERY } from '@/features/categories/api/categories.gql'

import type { TransactionType } from '@financy/contracts'

import { normalizeCurrencyToFloat } from './transactionsPage.utils'
import type {
  MutationExecutor,
  RefetchQuery,
  TransactionDialogPayload,
  TransactionGQL,
  TransactionsQueryInput,
} from './transactionsPage.types'

export const useTransactionMutations = (transactionsInput: TransactionsQueryInput) => {
  const refetchAfterTransaction = useMemo<RefetchQuery[]>(() => {
    return [
      { query: TRANSACTIONS_QUERY, variables: { input: transactionsInput } },
      { query: TRANSACTION_PERIODS_QUERY },
      { query: CATEGORIES_QUERY },
    ]
  }, [transactionsInput])

  const [createTransaction, { loading: creating }] = useMutation(
    CREATE_TRANSACTION_MUTATION,
  )
  const [updateTransaction, { loading: updating }] = useMutation(
    UPDATE_TRANSACTION_MUTATION,
  )
  const [deleteTransaction, { loading: deleting }] = useMutation(
    DELETE_TRANSACTION_MUTATION,
  )

  const runMutation = useCallback(
    async <TVariables>(
      executor: MutationExecutor<TVariables>,
      variables: TVariables,
      successMessage: string,
      errorMessage: string,
    ) => {
      try {
        await executor({
          variables,
          refetchQueries: refetchAfterTransaction,
          awaitRefetchQueries: true,
        })

        showSuccessToast(successMessage)
        return true
      } catch (err) {
        showErrorToast(err, errorMessage)
        return false
      }
    },
    [refetchAfterTransaction],
  )

  const submitTransaction = useCallback(
    async (
      payload: TransactionDialogPayload,
      editingTransaction: TransactionGQL | null,
    ) => {
      const amount = normalizeCurrencyToFloat(payload.amount)

      if (!amount) {
        showErrorToast(null, 'Informe um valor válido.')
        return false
      }

      const occurredAt =
        payload.date.trim() === '' ? undefined : payload.date.trim()

      const categoryId =
        payload.categoryId.trim() === '' ? undefined : payload.categoryId.trim()

      if (!editingTransaction) {
        return runMutation(
          createTransaction as unknown as MutationExecutor<{
            input: {
              title: string
              amount: number
              type: TransactionType
              occurredAt?: string
              categoryId?: string
            }
          }>,
          {
            input: {
              title: payload.description,
              amount,
              type: payload.type,
              occurredAt,
              categoryId,
            },
          },
          'Transação criada com sucesso.',
          'Não foi possível criar a transação.',
        )
      }

      return runMutation(
        updateTransaction as unknown as MutationExecutor<{
          input: {
            id: string
            title: string
            amount: number
            type: TransactionType
            occurredAt?: string
            categoryId?: string
          }
        }>,
        {
          input: {
            id: editingTransaction.id,
            title: payload.description,
            amount,
            type: payload.type,
            occurredAt,
            categoryId,
          },
        },
        'Transação atualizada com sucesso.',
        'Não foi possível atualizar a transação.',
      )
    },
    [createTransaction, runMutation, updateTransaction],
  )

  const removeTransaction = useCallback(
    (id: string) =>
      runMutation(
        deleteTransaction as unknown as MutationExecutor<{ id: string }>,
        { id },
        'Transação removida com sucesso.',
        'Não foi possível remover a transação.',
      ),
    [deleteTransaction, runMutation],
  )

  return {
    creating,
    updating,
    deleting,
    submitTransaction,
    removeTransaction,
  }
}
