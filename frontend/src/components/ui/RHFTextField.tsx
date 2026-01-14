import type { ReactNode } from 'react'
import type { Control, FieldPath, FieldValues } from 'react-hook-form'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/Form'
import { InputWithIcon } from '@/components/ui/InputWithIcon'

type RHFTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
> = {
  control: Control<TFieldValues>
  name: TName
  label: string
  placeholder?: string
  autoComplete?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  onRightIconClick?: () => void
  rightIconAriaLabel?: string
  type?: string
  description?: string
  readOnly?: boolean
}

export const RHFTextField = <
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  name,
  label,
  placeholder,
  autoComplete,
  leftIcon,
  rightIcon,
  onRightIconClick,
  rightIconAriaLabel,
  type = 'text',
  description,
  readOnly,
}: RHFTextFieldProps<TFieldValues, TName>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputWithIcon
              {...field}
              id={field.name}
              type={type}
              placeholder={placeholder}
              autoComplete={autoComplete}
              leftIcon={leftIcon}
              rightIcon={rightIcon}
              onRightIconClick={onRightIconClick}
              rightIconAriaLabel={rightIconAriaLabel}
              readOnly={readOnly}
              aria-invalid={!!fieldState.error}
            />
          </FormControl>

          {description && !fieldState.error && (
            <FormDescription>{description}</FormDescription>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
