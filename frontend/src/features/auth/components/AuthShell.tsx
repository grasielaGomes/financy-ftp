import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => {
  return (
    <div className="min-h-dvh w-full bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col justify-center px-4 py-10 sm:px-6">
        <header className="mb-6 space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </header>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  )
}
