import { Card } from '@/components/ui/Card'
import { Logo } from '@/components/ui/Logo'
import type { ReactNode } from 'react'

type FormLayoutProps = {
  children: ReactNode
  header?: ReactNode
  logo?: ReactNode | null
}

export const FormLayout = ({
  header,
  children,
  logo = <Logo />,
}: FormLayoutProps) => {
  return (
    <div className="min-h-dvh w-full">
      <div className="mx-auto flex min-h-dvh w-full max-w-[448px] flex-col gap-8 items-center">
        <>{logo}</>
        <Card className="p-8 w-full ">
          <>{header}</>
          <>{children}</>
        </Card>
      </div>
    </div>
  )
}

type FormHeaderProps = {
  children?: ReactNode
  title: string
  subtitle: string
}

export const FormHeader = ({ children, title, subtitle }: FormHeaderProps) => {
  return (
    <header className="flex flex-col items-center mb-8">
      {children}
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
      <p className="text-md text-gray-600">{subtitle}</p>
    </header>
  )
}
