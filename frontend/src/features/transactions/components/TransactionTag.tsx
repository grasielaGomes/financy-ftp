import { ArrowDownCircle, ArrowUpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TransactionTagType = 'INCOME' | 'EXPENSE'

type TransactionTagProps = {
  type: TransactionTagType
  className?: string
}

const typeConfig = {
  INCOME: {
    label: 'Entrada',
    icon: ArrowUpCircle,
    className: 'text-green-base',
  },
  EXPENSE: {
    label: 'Saída',
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
