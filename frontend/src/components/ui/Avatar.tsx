import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg'

type AvatarProps = {
  initials: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-14 w-14 text-lg',
}

export const Avatar = ({ initials, size = 'md', className }: AvatarProps) => {
  return (
    <div
      aria-label="User avatar"
      className={cn(
        'flex items-center justify-center rounded-full border bg-gray-100 font-semibold text-gray-700',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
