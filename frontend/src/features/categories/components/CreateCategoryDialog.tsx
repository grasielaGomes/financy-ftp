import * as React from 'react'
import { XIcon } from 'lucide-react'

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
import { cn } from '@/lib/utils'
import {
  categoryColorOptions,
  categoryIconOptions,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

type CreateCategoryPayload = {
  id: string
  name: string
  description: string
  iconKey: CategoryIconKey
  colorKey: CategoryColorKey
}

type CreateCategoryDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onSubmit?: (payload: CreateCategoryPayload) => void
  trigger?: React.ReactNode
  className?: string
}

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `category-${Date.now()}`
}

export const CreateCategoryDialog = ({
  open,
  onOpenChange,
  onSubmit,
  trigger,
  className,
}: CreateCategoryDialogProps) => {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [iconKey, setIconKey] = React.useState<CategoryIconKey>('briefcase')
  const [colorKey, setColorKey] = React.useState<CategoryColorKey>('green')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onSubmit?.({
      id: createId(),
      name,
      description,
      iconKey,
      colorKey,
    })

    setName('')
    setDescription('')
    setIconKey('shopping-cart')
    setColorKey('green')
    onOpenChange?.(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn('max-w-[448px]', className)}
        showCloseButton={false}
      >
        <div className="flex items-start justify-between gap-4 mb-2">
          <DialogHeader className="gap-1">
            <DialogTitle className="text-base">Nova categoria</DialogTitle>
            <DialogDescription>
              Organize suas transações com categorias
            </DialogDescription>
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
          <TextField
            id="category-title"
            label="Título"
            value={name}
            placeholder="Ex. Alimentação"
            inputProps={{
              required: true,
              onChange: (event) => setName(event.target.value),
            }}
          />

          <TextField
            id="category-description"
            label="Descrição"
            value={description}
            placeholder="Descrição da categoria"
            hint="Opcional"
            inputProps={{
              onChange: (event) => setDescription(event.target.value),
            }}
          />

          <div className="grid gap-2">
            <span className="text-sm font-medium text-gray-700">Ícone</span>
            <div className="grid w-full grid-cols-4 gap-2 sm:grid-cols-8">
              {categoryIconOptions.map((option) => {
                const Icon = option.icon
                const isSelected = iconKey === option.key

                return (
                  <Button
                    key={option.key}
                    type="button"
                    size="icon"
                    variant="outline"
                    aria-pressed={isSelected}
                    onClick={() => setIconKey(option.key)}
                    className={cn(
                      'h-[42px] w-[42px] text-gray-600 data-[selected=true]:border-primary data-[selected=true]:bg-gray-100',
                    )}
                    data-selected={isSelected}
                  >
                    <Icon className="size-5" />
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-2">
            <span className="text-sm font-medium text-gray-700">Cor</span>
            <div className="grid w-full grid-cols-7 gap-2">
              {categoryColorOptions.map((option) => {
                const isSelected = colorKey === option.key

                return (
                  <button
                    key={option.key}
                    type="button"
                    aria-label={`Selecionar cor ${option.label}`}
                    aria-pressed={isSelected}
                    data-selected={isSelected}
                    onClick={() => setColorKey(option.key)}
                    className={cn(
                      'flex p-1 w-full items-center justify-center rounded-lg border border-gray-200 bg-white',
                      isSelected && 'border-primary bg-gray-100',
                    )}
                  >
                    <span
                      className={cn('h-5 w-full rounded-md', option.className)}
                    />
                  </button>
                )
              })}
            </div>
          </div>

          <Button type="submit" className="mt-2 w-full">
            Salvar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
