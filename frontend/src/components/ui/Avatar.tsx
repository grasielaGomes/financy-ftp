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
  lg: 'h-16 w-16 text-2xl',
}

export const Avatar = ({ initials, size = 'md', className }: AvatarProps) => {
  return (
    <div
      aria-label="User avatar"
      className={cn(
        'flex items-center justify-center rounded-full bg-gray-300 font-medium text-gray-700',
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  )
}
