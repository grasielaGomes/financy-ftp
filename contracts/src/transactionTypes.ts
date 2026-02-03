export const TRANSACTION_TYPES = ['INCOME', 'EXPENSE'] as const

export type TransactionType = (typeof TRANSACTION_TYPES)[number]
