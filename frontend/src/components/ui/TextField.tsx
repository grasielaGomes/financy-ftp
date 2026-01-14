import type { ReactNode } from 'react'
import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { InputWithIcon } from '@/components/ui/InputWithIcon'
import { FieldLabel } from '@/components/ui/FieldLabel'

type TextFieldProps = {
  id: string
  label: string
  value: string
  placeholder?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onRightIconClick?: () => void
  rightIconAriaLabel?: string
  readOnly?: boolean
  disabled?: boolean
  hint?: string
  errorMessage?: string
  className?: string
  inputProps?: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'id' | 'value' | 'placeholder' | 'disabled' | 'readOnly'
  >
}

export const TextField = ({
  id,
  label,
  value,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconClick,
  rightIconAriaLabel,
  readOnly,
  disabled,
  hint,
  errorMessage,
  className,
  inputProps,
}: TextFieldProps) => {
  const hasError = !!errorMessage
  const message = hasError ? errorMessage : hint

  return (
    <div className={cn('grid gap-2 group', className)} data-error={hasError}>
      <FieldLabel htmlFor={id} hasError={hasError}>
        {label}
      </FieldLabel>

      <InputWithIcon
        id={id}
        value={value}
        placeholder={placeholder}
        leftIcon={leftIcon}
        rightIcon={rightIcon}
        onRightIconClick={onRightIconClick}
        rightIconAriaLabel={rightIconAriaLabel}
        readOnly={readOnly}
        disabled={disabled}
        aria-invalid={hasError}
        {...inputProps}
      />

      {message && <p className="text-xs text-gray-500">{message}</p>}
    </div>
  )
}
