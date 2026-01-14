import { Mail, UserRoundPlus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { Form, FormField } from '@/components/ui/Form'
import { RHFTextField } from '@/components/ui/RHFTextField'

import { useLoginForm } from '../hooks/useLoginForm'
import { PasswordField } from './PasswordField'
import { AuthFormFooter } from './AuthFormFooter'

type LoginFormProps = {
  onSwitchToSignUp: () => void
  onLoggedIn?: () => void
}

export const LoginForm = ({ onSwitchToSignUp, onLoggedIn }: LoginFormProps) => {
  const { form, loading, showPassword, toggleShowPassword, onSubmit } =
    useLoginForm({ onLoggedIn })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <RHFTextField
          control={form.control}
          name="email"
          label="E-mail"
          placeholder="mail@exemplo.com"
          autoComplete="email"
          leftIcon={<Mail size={16} />}
        />

        <PasswordField
          control={form.control}
          name="password"
          showPassword={showPassword}
          onToggleShowPassword={toggleShowPassword}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between gap-3">
          <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <Checkbox
                  checked={!!field.value}
                  onCheckedChange={(v) => field.onChange(Boolean(v))}
                />
                Lembrar-me
              </label>
            )}
          />

          <Button variant="link" size="link">
            Recuperar senha
          </Button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          disabled={loading}
        >
          Entrar
        </Button>

        <AuthFormFooter
          question="Ainda não tem uma conta?"
          actionLabel="Criar conta"
          actionIcon={<UserRoundPlus size={18} />}
          onActionClick={onSwitchToSignUp}
        />
      </form>
    </Form>
  )
}
