import * as React from 'react'

import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type PageHeaderProps = {
  title: string
  description?: string
  buttonLabel?: string
  buttonIcon?: React.ReactNode
  onButtonClick?: () => void
  buttonProps?: Omit<
    React.ComponentProps<typeof Button>,
    'children' | 'onClick'
  >
  className?: string
}

const PageHeader = ({
  title,
  description,
  buttonLabel,
  buttonIcon,
  onButtonClick,
  buttonProps,
  className,
}: PageHeaderProps) => {
  return (
    <header
      data-slot="page-header"
      className={cn(
        'flex flex-wrap items-center justify-between gap-4',
        className
      )}
    >
      <div className="space-y-1">
        <h1 className="text-2xl leading-8 font-bold text-gray-800">{title}</h1>
        {description && (
          <p className="text-base leading-6 text-gray-600">{description}</p>
        )}
      </div>

      {buttonLabel && (
        <Button size="sm" onClick={onButtonClick} {...buttonProps}>
          {buttonIcon}
          {buttonLabel}
        </Button>
      )}
    </header>
  )
}

export { PageHeader }
