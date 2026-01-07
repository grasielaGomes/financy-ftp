import { Eye, EyeClosed, Lock } from 'lucide-react'
import type { Control, FieldValues, Path } from 'react-hook-form'

import { InputWithIcon } from '@/components/ui/InputWithIcon'
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/Form'

type PasswordFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: Path<TFieldValues>
  label?: string
  placeholder?: string
  autoComplete?: string
  showPassword: boolean
  onToggleShowPassword: () => void
  description?: string
}

export const PasswordField = <TFieldValues extends FieldValues>({
  control,
  name,
  label = 'Senha',
  placeholder = 'Digite sua senha',
  autoComplete = 'current-password',
  showPassword,
  onToggleShowPassword,
  description,
}: PasswordFieldProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <InputWithIcon
              {...field}
              id={field.name}
              type={showPassword ? 'text' : 'password'}
              placeholder={placeholder}
              autoComplete={autoComplete}
              leftIcon={<Lock size={16} />}
              rightIcon={
                showPassword ? <Eye size={16} /> : <EyeClosed size={16} />
              }
              rightIconAriaLabel={
                showPassword ? 'Hide password' : 'Show password'
              }
              onRightIconClick={onToggleShowPassword}
            />
          </FormControl>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
