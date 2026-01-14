import type { ReactNode } from 'react'
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
}: TextFieldProps) => {
  const hasError = !!errorMessage

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
      />

      {hint && !hasError && <p className="text-xs text-gray-500">{hint}</p>}
      {hasError && <p className="text-sm text-danger">{errorMessage}</p>}
    </div>
  )
}
