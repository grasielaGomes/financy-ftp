import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Tag } from '@/components/ui/Tag'
import { cn } from '@/lib/utils'
import { SquarePen, Trash } from 'lucide-react'
import {
  categoryColorBadgeClasses,
  categoryIconMap,
  type CategoryColorKey,
  type CategoryIconKey,
} from '@/features/categories/helpers/categoryOptions'

type CategoryCardProps = {
  iconKey: CategoryIconKey
  colorKey: CategoryColorKey
  name: string
  description: string
  tagLabel: string
  itemsCount: string
  onEdit?: () => void
  onDelete?: () => void
  className?: string
}

export const CategoryCard = ({
  iconKey,
  colorKey,
  name,
  description,
  tagLabel,
  itemsCount,
  onEdit,
  onDelete,
  className,
}: CategoryCardProps) => {
  const Icon = categoryIconMap[iconKey]
  const colorClasses = categoryColorBadgeClasses[colorKey]

  return (
    <Card className={cn('flex h-full flex-col gap-4 p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            'flex size-9 items-center justify-center rounded-md',
            'bg-gray-100 text-gray-700 [&_svg]:h-4 [&_svg]:w-4',
            colorClasses,
          )}
        >
          <Icon />
        </div>

        <div className="flex items-center gap-2">
          {onDelete && (
            <Button
              variant="outline"
              size="icon"
              type="button"
              aria-label="Excluir categoria"
              onClick={onDelete}
            >
              <Trash className="h-4 w-4 text-danger" />
            </Button>
          )}
          {onEdit && (
            <Button
              variant="outline"
              size="icon"
              type="button"
              aria-label="Editar categoria"
              onClick={onEdit}
            >
              <SquarePen className="h-4 w-4 text-gray-700" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3">
        <Tag className={cn('bg-gray-100 text-gray-700', colorClasses)}>
          {tagLabel}
        </Tag>
        <span className="text-xs text-gray-500">{itemsCount}</span>
      </div>
    </Card>
  )
}
