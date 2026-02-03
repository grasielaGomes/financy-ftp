import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPES,
  type TransactionType,
} from '@financy/contracts'

type TransactionTagProps = {
  type: TransactionType
  className?: string
}

const typeConfig = {
  [TRANSACTION_TYPES[0]]: {
    label: TRANSACTION_TYPE_LABELS.INCOME,
    icon: ArrowUpCircle,
    className: 'text-green-base',
  },
  [TRANSACTION_TYPES[1]]: {
    label: TRANSACTION_TYPE_LABELS.EXPENSE,
    icon: ArrowDownCircle,
    className: 'text-red-base',
  },
} as const

export const TransactionTag = ({ type, className }: TransactionTagProps) => {
  const config = typeConfig[type]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium',
        config.className,
        className,
      )}
    >
      <Icon className="h-4 w-4" />
      {config.label}
    </span>
  )
}
