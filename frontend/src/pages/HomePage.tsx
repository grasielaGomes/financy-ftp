import { useMemo, useState } from 'react'
import { AuthShell } from '@/features/auth/components/AuthShell'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { SignupForm } from '@/features/auth/components/SignupForm'
import { getToken } from '@/lib/storage/token'

type Mode = 'login' | 'signup'

export const HomePage = () => {
  const token = useMemo(() => getToken(), [])
  const [mode, setMode] = useState<Mode>('login')

  // For now, if logged in we can show a placeholder.
  // Later this becomes the Dashboard page content.
  if (token) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Logged in. Dashboard will be implemented next.
        </p>
      </div>
    )
  }

  if (mode === 'signup') {
    return (
      <AuthShell
        title="Criar conta"
        subtitle="Comece a controlar suas finanças ainda hoje"
      >
        <SignupForm onSwitchToLogin={() => setMode('login')} />
      </AuthShell>
    )
  }

  return (
    <AuthShell title="Fazer login" subtitle="Entre na sua conta para continuar">
      <LoginForm onSwitchToSignUp={() => setMode('signup')} />
    </AuthShell>
  )
}
