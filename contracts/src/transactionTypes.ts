export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const
export type TransactionType = (typeof TRANSACTION_TYPES)[number]

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  INCOME: 'Entrada',
  EXPENSE: 'Saída',
}

export const TRANSACTION_TYPE_SIGNS: Record<TransactionType, '+' | '-'> = {
  INCOME: '+',
  EXPENSE: '-',
}

export type TransactionTypeFilter = 'all' | 'income' | 'expense'

export const toTransactionType = (
  value: TransactionTypeFilter,
): TransactionType | undefined => {
  if (value === 'income') return 'INCOME'
  if (value === 'expense') return 'EXPENSE'
  return undefined
}

export const transactionOptions: {
  value: TransactionTypeFilter
  label: string
}[] = [
  { value: 'all', label: 'Todos' },
  { value: 'income', label: 'Entradas' },
  { value: 'expense', label: 'Saídas' },
]
