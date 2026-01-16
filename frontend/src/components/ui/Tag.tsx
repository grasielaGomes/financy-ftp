import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cn } from '@/lib/utils'

type TagProps = React.ComponentProps<'span'> & {
  asChild?: boolean
}

export function Tag({ className, asChild = false, ...props }: TagProps) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="tag"
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap',
        'rounded-full px-3 py-1',
        'text-sm font-medium',
        className
      )}
      {...props}
    />
  )
}
