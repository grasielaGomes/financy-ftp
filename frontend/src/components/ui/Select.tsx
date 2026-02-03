import * as React from 'react'
import { CheckIcon, ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu'
import { FieldLabel } from '@/components/ui/FieldLabel'

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

type SelectProps = {
  id: string
  label: string
  value?: string
  options: SelectOption[]
  onValueChange?: (value: string) => void
  placeholder?: string
  leftIcon?: React.ReactNode
  disabled?: boolean
  hint?: string
  errorMessage?: string
  className?: string
}

export const Select = ({
  id,
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Selecione uma opção',
  leftIcon,
  disabled,
  hint,
  errorMessage,
  className,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false)
  const hasError = !!errorMessage
  const message = hasError ? errorMessage : hint

  const selectedOption = options.find((option) => option.value === value)
  const displayLabel = selectedOption?.label ?? placeholder
  const isPlaceholder = !selectedOption

  const iconClassName = cn(
    'text-gray-400',
    'data-[filled=true]:text-gray-800',
    'group-focus-within:text-primary',
    'group-data-[error=true]:text-danger',
  )

  return (
    <div className={cn('grid gap-2 group', className)} data-error={hasError}>
      <FieldLabel htmlFor={id} hasError={hasError}>
        {label}
      </FieldLabel>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            id={id}
            type="button"
            disabled={disabled}
            data-open={open}
            data-filled={!isPlaceholder}
            className={cn(
              'relative w-full min-w-0 h-12 rounded-lg border bg-transparent px-3 py-3.5 text-md',
              'border-input outline-none transition-[color,box-shadow]',
              'focus-visible:border-input focus-visible:ring-border/50',
              'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
              'text-left',
              leftIcon && 'pl-10',
              'pr-10',
            )}
          >
            <span
              className={cn(
                'block truncate',
                isPlaceholder ? 'text-gray-400' : 'text-gray-800',
              )}
            >
              {displayLabel}
            </span>
            {leftIcon && (
              <span
                className={cn(
                  'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
                  iconClassName,
                )}
              >
                {leftIcon}
              </span>
            )}
            <span
              className={cn(
                'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
                'text-gray-400 transition-transform',
                'data-[open=true]:-rotate-180',
              )}
              data-open={open}
            >
              <ChevronDown className="h-4 w-4" />
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          sideOffset={6}
          className={cn(
            'p-2',
            'min-w-[12rem]',
            'w-[var(--radix-dropdown-menu-trigger-width)]',
          )}
        >
          {options.map((option) => {
            const isSelected = option.value === value
            return (
              <DropdownMenuItem
                key={option.value}
                disabled={option.disabled}
                onSelect={() => onValueChange?.(option.value)}
                className={cn(
                  'flex items-center justify-between gap-3 px-2 py-2 text-sm',
                  'data-[disabled]:opacity-50',
                )}
                data-selected={isSelected}
              >
                <span className="truncate">{option.label}</span>
                {isSelected && (
                  <CheckIcon className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  )
}
