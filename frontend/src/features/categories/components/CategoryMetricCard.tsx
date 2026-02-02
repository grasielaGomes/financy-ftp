import type { ReactNode } from 'react'

import { Card } from '@/components/ui/Card'
import { cn } from '@/lib/utils'

type CategoryMetricCardProps = {
  icon: ReactNode
  label: string
  value: string
  className?: string
}

export const CategoryMetricCard = ({
  icon,
  label,
  value,
  className,
}: CategoryMetricCardProps) => {
  return (
    <Card className={cn('flex flex-col gap-2 p-6', className)}>
      <div className="flex gap-4">
        <div className="shrink-0 mt-1.5 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
        <div className="flex flex-col gap-1">
          <strong className="ui-metric">{value}</strong>
          <span className="ui-kicker">{label}</span>
        </div>
      </div>
    </Card>
  )
}
