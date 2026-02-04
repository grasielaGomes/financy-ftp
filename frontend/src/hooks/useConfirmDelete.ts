import { useCallback, useState } from 'react'

type DeleteExecutor<TItem> = (
  item: TItem,
) => void | boolean | Promise<void | boolean>

export const useConfirmDelete = <TItem>(onDelete: DeleteExecutor<TItem>) => {
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState<TItem | null>(null)

  const requestDelete = useCallback((nextItem: TItem) => {
    setItem(nextItem)
    setOpen(true)
  }, [])

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen)
    if (!nextOpen) setItem(null)
  }, [])

  const confirmDelete = useCallback(async () => {
    if (!item) return false
    const result = await onDelete(item)
    return result !== false
  }, [item, onDelete])

  return {
    open,
    item,
    requestDelete,
    onOpenChange: handleOpenChange,
    onConfirm: confirmDelete,
  }
}
