import type { ReactNode } from 'react'
import { FormHeader, FormLayout } from '@/components/layout/FormLayout'

type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
}

export const AuthShell = ({ title, subtitle, children }: AuthShellProps) => {
  return (
    <div className="py-10 md:py-12">
      <FormLayout header={<FormHeader title={title} subtitle={subtitle} />}>
        {children}
      </FormLayout>
    </div>
  )
}
