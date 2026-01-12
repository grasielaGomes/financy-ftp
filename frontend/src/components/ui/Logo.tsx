import * as React from 'react'

import logo from '@/assets/logo.svg'
import { cn } from '@/lib/utils'

const Logo = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, alt = 'Financy', ...props }, ref) => {
  return (
    <img
      ref={ref}
      src={logo}
      alt={alt}
      width={134}
      height={32}
      className={cn('h-8 w-[134px]', className)}
      {...props}
    />
  )
})
Logo.displayName = 'Logo'

export { Logo }
