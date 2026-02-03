import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer',
    'rounded-lg font-medium',
    'transition-[background-color,color,border-color] ',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4',
    'shrink-0 [&_svg]:shrink-0 outline-none',
    // Focus ring
    'focus-visible:ring-[3px] focus-visible:ring-border/50',
    // Invalid (optional, if a button ever becomes aria-invalid)
    'aria-invalid:ring-danger/20 dark:aria-invalid:ring-danger/40 aria-invalid:border-danger',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:bg-brand-dark',
        danger: 'bg-danger text-white hover:bg-danger-dark',
        outline: 'border border-input bg-white text-gray-800 hover:bg-gray-200',
        link: 'text-primary underline-offset-4 text-sm hover:underline',
        pagination:
          'h-8 w-8 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200',
        paginationActive:
          'h-8 w-8 rounded-md bg-primary text-gray-100 hover:bg-primary/90',
      },
      size: {
        md: 'h-12 px-4 py-3.5 has-[>svg]:pl-3.5 has-[>svg]:pr-4',
        sm: 'h-9 px-3 py-2.5 text-sm has-[>svg]:pl-3 has-[>svg]:pr-3.5',
        icon: 'h-8 w-8',
        link: 'h-fit px-0 py-0',

        default: 'h-10 px-4 py-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
