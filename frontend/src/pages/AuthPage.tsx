import { useMemo } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

import { AuthShell } from '@/features/auth/components/AuthShell'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { useToken } from '@/lib/storage/token'

type Mode = 'login' | 'signup'

export const AuthPage = () => {
  const token = useToken()
  const [params, setParams] = useSearchParams()

  const mode = useMemo<Mode>(() => {
    const value = params.get('mode')
    return value === 'signup' ? 'signup' : 'login'
  }, [params])

  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  if (mode === 'signup') {
    return (
      <AuthShell
        title="Criar conta"
        subtitle="Comece a controlar suas finanças ainda hoje"
      >
        <SignupForm onSwitchToLogin={() => setParams({ mode: 'login' })} />
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Fazer login" subtitle="Entre na sua conta para continuar">
      <LoginForm onSwitchToSignUp={() => setParams({ mode: 'signup' })} />
    </AuthShell>
  )
}
