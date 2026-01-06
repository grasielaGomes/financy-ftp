import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import type { ReactNode } from 'react'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => {
  return (
    <div className="min-h-dvh w-full bg-background">
      <div className="mx-auto flex min-h-dvh w-full max-w-[448px] flex-col justify-center py-10 gap-8 items-center">
        <Logo />
        <Card className="p-8 w-full ">
          <header className="flex flex-col items-center mb-8">
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
            <p className="text-md text-gray-600">{subtitle}</p>
          </header>
          <>{children}</>
        </Card>
      </div>
    </div>
  )
}
