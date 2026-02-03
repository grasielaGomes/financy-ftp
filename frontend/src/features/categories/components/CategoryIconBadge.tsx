import { cn } from '@/lib/utils'
import {
  categoryColorBadgeClasses,
  categoryIconMap,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

type CategoryIconBadgeProps = {
  iconKey: CategoryIconKey
  colorKey: CategoryColorKey
  className?: string
}

export const CategoryIconBadge = ({
  iconKey,
  colorKey,
  className,
}: CategoryIconBadgeProps) => {
  const Icon = categoryIconMap[iconKey]
  const colorClasses = categoryColorBadgeClasses[colorKey]

  return (
    <div
      className={cn(
        'flex size-9 items-center justify-center rounded-md',
        '[&_svg]:h-4 [&_svg]:w-4',
        colorClasses,
        className,
      )}
    >
      <Icon />
    </div>
  )
}
