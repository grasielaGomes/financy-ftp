import * as React from 'react'

import { cn } from '@/lib/utils'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-slot="card"
      className={cn('rounded-xl border border-gray-200 bg-white', className)}
      {...props}
    />
  )
})
Card.displayName = 'Card'

export { Card }
