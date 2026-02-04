import type { ReactNode } from 'react'

import { Card } from '@/components/ui/Card'

type DashboardSectionCardProps = {
  title: string
  action?: ReactNode
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export const DashboardSectionCard = ({
  title,
  action,
  children,
  footer,
  className,
}: DashboardSectionCardProps) => {
  return (
    <Card className={className}>
      <header className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
        <span className="ui-kicker">{title}</span>
        {action}
      </header>

      <div>{children}</div>

      {footer ? (
        <footer className="border-t border-gray-100 py-5">{footer}</footer>
      ) : null}
    </Card>
  )
}
