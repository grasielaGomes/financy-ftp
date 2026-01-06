import * as React from 'react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/Input'

type InputWithIconProps = React.ComponentProps<typeof Input> & {
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconClick?: () => void
  rightIconAriaLabel?: string
}

const isTruthyAriaInvalid = (v: unknown) => v === true || v === 'true'

export function InputWithIcon({
  className,
  leftIcon,
  rightIcon,
  onRightIconClick,
  rightIconAriaLabel,
  disabled,
  value,
  defaultValue,
  ...props
}: InputWithIconProps) {
  const hasLeft = !!leftIcon
  const hasRight = !!rightIcon
  const rightIsButton = hasRight && typeof onRightIconClick === 'function'

  const isError = isTruthyAriaInvalid((props as any)['aria-invalid'])

  const currentValue =
    value ?? (defaultValue as string | number | readonly string[] | undefined)
  const isFilled =
    currentValue !== undefined && String(currentValue).trim().length > 0

  const iconClassName = cn(
    'text-gray-400',
    // filled
    'data-[filled=true]:text-gray-800',
    // active
    'group-focus-within:text-primary',
    // error wins
    'group-data-[error=true]:text-danger'
  )

  return (
    <div
      className="relative w-full group"
      data-error={isError}
      data-filled={isFilled}
    >
      {hasLeft && (
        <div
          className={cn(
            'pointer-events-none absolute left-3 top-1/2 -translate-y-1/2',
            iconClassName
          )}
        >
          {leftIcon}
        </div>
      )}

      <Input
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        className={cn(hasLeft && 'pl-10', hasRight && 'pr-10', className)}
        {...props}
      />

      {hasRight && (
        <>
          {rightIsButton ? (
            <button
              type="button"
              disabled={disabled}
              aria-label={rightIconAriaLabel ?? 'Action'}
              onClick={onRightIconClick}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2',
                'cursor-pointer text-gray-700',
                'disabled:pointer-events-none disabled:opacity-50'
              )}
            >
              {rightIcon}
            </button>
          ) : (
            <div
              className={cn(
                'pointer-events-none absolute right-3 top-1/2 -translate-y-1/2',
                iconClassName
              )}
            >
              {rightIcon}
            </div>
          )}
        </>
      )}
    </div>
  )
}
