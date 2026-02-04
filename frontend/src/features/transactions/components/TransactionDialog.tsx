import * as React from 'react'
import { ArrowDownCircle, ArrowUpCircle, XIcon } from 'lucide-react'
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPES,
  type TransactionType,
} from '@financy/contracts'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { TextField } from '@/components/ui/TextField'
import { Select } from '@/components/ui/Select'
import { cn } from '@/lib/utils'

type TransactionOption = {
  value: string
  label: string
  disabled?: boolean
}

export type CreateTransactionPayload = {
  type: TransactionType
  description: string
  date: string
  amount: string
  categoryId: string
}

const DEFAULT_VALUES: CreateTransactionPayload = {
  type: TRANSACTION_TYPES[1],
  description: '',
  date: '',
  amount: '',
  categoryId: '',
}

type TransactionDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (payload: CreateTransactionPayload) => void | Promise<boolean>
  trigger?: React.ReactNode
  className?: string
  closeOnSubmit?: boolean
  isEditing?: boolean
  initialValues?: Partial<CreateTransactionPayload>
  title?: string
  description?: string
  submitLabel?: string
  categoryOptions: TransactionOption[]
}

const typeOptions: Array<{
  value: TransactionType
  label: string
  icon: typeof ArrowUpCircle
  selectedClassName: string
}> = [
  {
    value: TRANSACTION_TYPES[1],
    label: TRANSACTION_TYPE_LABELS.EXPENSE,
    icon: ArrowDownCircle,
    selectedClassName: 'border-red-base text-red-base',
  },
  {
    value: TRANSACTION_TYPES[0],
    label: TRANSACTION_TYPE_LABELS.INCOME,
    icon: ArrowUpCircle,
    selectedClassName: 'border-green-base text-green-base',
  },
]

export const TransactionDialog = ({
  open,
  onOpenChange,
  onSubmit,
  trigger,
  className,
  closeOnSubmit = true,
  isEditing = false,
  initialValues,
  title,
  description,
  submitLabel,
  categoryOptions,
}: TransactionDialogProps) => {
  const [type, setType] = React.useState<TransactionType>(DEFAULT_VALUES.type)
  const [descriptionValue, setDescriptionValue] = React.useState(
    DEFAULT_VALUES.description,
  )
  const [date, setDate] = React.useState(DEFAULT_VALUES.date)
  const [amount, setAmount] = React.useState(DEFAULT_VALUES.amount)
  const [categoryId, setCategoryId] = React.useState(DEFAULT_VALUES.categoryId)

  React.useEffect(() => {
    if (!open) return

    const values = {
      ...DEFAULT_VALUES,
      ...initialValues,
    }

    setType(values.type ?? DEFAULT_VALUES.type)
    setDescriptionValue(values.description ?? DEFAULT_VALUES.description)
    setDate(values.date ?? DEFAULT_VALUES.date)
    setAmount(values.amount ?? DEFAULT_VALUES.amount)
    setCategoryId(values.categoryId ?? DEFAULT_VALUES.categoryId)
  }, [open, initialValues])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const result = await onSubmit?.({
      type,
      description: descriptionValue,
      date,
      amount,
      categoryId,
    })

    const shouldClose = closeOnSubmit && result !== false
    if (shouldClose) {
      setType(DEFAULT_VALUES.type)
      setDescriptionValue(DEFAULT_VALUES.description)
      setDate(DEFAULT_VALUES.date)
      setAmount(DEFAULT_VALUES.amount)
      setCategoryId(DEFAULT_VALUES.categoryId)
      onOpenChange?.(false)
    }
  }

  const resolvedTitle = title ?? (isEditing ? 'Editar transação' : 'Nova transação')
  const resolvedDescription =
    description ??
    (isEditing
      ? 'Atualize os dados da transação'
      : 'Registre sua despesa ou receita')
  const resolvedSubmitLabel = submitLabel ?? (isEditing ? 'Salvar alterações' : 'Salvar')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn('max-w-[448px]', className)}
        showCloseButton={false}
      >
        <div className="mb-2 flex items-start justify-between gap-4">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-base">{resolvedTitle}</DialogTitle>
            <DialogDescription>{resolvedDescription}</DialogDescription>
          </DialogHeader>

          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Fechar"
            >
              <XIcon className="h-4 w-4" />
            </Button>
          </DialogClose>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-2 gap-2 rounded-lg border border-input bg-white p-2">
            {typeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = type === option.value

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setType(option.value)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-medium transition-colors cursor-pointer',
                    'border-transparent text-gray-600 hover:bg-gray-100',
                    isSelected ? option.selectedClassName : '',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {option.label}
                </button>
              )
            })}
          </div>

          <TextField
            id="transaction-description"
            label="Descrição"
            value={descriptionValue}
            placeholder="Ex. Almoço no restaurante"
            inputProps={{
              required: true,
              onChange: (event) => setDescriptionValue(event.target.value),
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              id="transaction-date"
              label="Data"
              value={date}
              placeholder="Selecione"
              inputProps={{
                type: 'date',
                onChange: (event) => setDate(event.target.value),
              }}
            />

            <TextField
              id="transaction-amount"
              label="Valor"
              value={amount}
              placeholder="R$ 0,00"
              inputProps={{
                onChange: (event) => setAmount(event.target.value),
              }}
            />
          </div>

          <Select
            id="transaction-category"
            label="Categoria"
            value={categoryId}
            options={categoryOptions}
            placeholder="Selecione"
            onValueChange={setCategoryId}
          />

          <Button type="submit" className="mt-2 w-full">
            {resolvedSubmitLabel}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
