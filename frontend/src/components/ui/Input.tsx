import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout: full width, 48px height, px=12px, py=14px
        'w-full min-w-0 h-12 rounded-lg border bg-transparent px-3 py-3.5 text-md',
        // States
        'border-input outline-none transition-[color,box-shadow]',
        'placeholder:text-gray-400',
        'focus-visible:border-input focus-visible:ring-border/50',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'read-only:pointer-events-none read-only:cursor-not-allowed read-only:opacity-50',
        // File input styling (keep from shadcn baseline)
        'file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-md file:font-medium file:text-gray-700',
        // Dark mode background (keep baseline)
        'dark:bg-input/30',
        className
      )}
      {...props}
    />
  )
}

export { Input }
