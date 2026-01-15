import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Card } from '@/components/ui/Card'

type MetricCardProps = {
  icon: ReactNode
  label: string
  value: string
  className?: string
}

export const MetricCard = ({
  icon,
  label,
  value,
  className,
}: MetricCardProps) => {
  return (
    <Card className={cn('flex flex-col gap-4 p-6', className)}>
      <div className="flex items-center gap-3">
        <div className="shrink-0 [&_svg]:h-5 [&_svg]:w-5">{icon}</div>
        <span className="ui-kicker">{label}</span>
      </div>
      <strong className="ui-metric">{value}</strong>
    </Card>
  )
}
