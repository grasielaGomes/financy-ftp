import { Mail, UserRound, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Form } from '@/components/ui/Form'
import { RHFTextField } from '@/components/ui/RHFTextField'
import { useSignupForm } from '../hooks/useSignupForm'
import { PasswordField } from './PasswordField'
import { AuthFormFooter } from './AuthFormFooter'

type SignupFormProps = {
  onSwitchToLogin: () => void
  onSignedUp?: () => void
}

export const SignupForm = ({
  onSwitchToLogin,
  onSignedUp,
}: SignupFormProps) => {
  const { form, loading, showPassword, toggleShowPassword, onSubmit } =
    useSignupForm({ onSignedUp })

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <RHFTextField
          control={form.control}
          name="fullName"
          label="Nome completo"
          placeholder="Seu nome completo"
          autoComplete="name"
          leftIcon={<UserRound size={16} />}
        />

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
          autoComplete="new-password"
          description={
            form.formState.errors.password
              ? undefined
              : 'A senha deve ter no mínimo 8 caracteres'
          }
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full mt-2"
          disabled={loading}
        >
          Cadastrar
        </Button>

        <AuthFormFooter
          question="Já tem uma conta?"
          actionLabel="Fazer login"
          actionIcon={<LogIn size={18} />}
          onActionClick={onSwitchToLogin}
        />
      </form>
    </Form>
  )
}
