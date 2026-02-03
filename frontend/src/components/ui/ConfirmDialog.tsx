import * as React from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type ConfirmDialogProps = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  description: React.ReactNode
  confirmLabel?: string
  cancelLabel?: string
  confirmVariant?: React.ComponentProps<typeof Button>['variant']
  closeOnConfirm?: boolean
  className?: string
  onConfirm?: () => void | Promise<boolean | void>
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmVariant = 'danger',
  closeOnConfirm = true,
  className,
  onConfirm,
}: ConfirmDialogProps) => {
  const handleConfirm = async () => {
    const result = await onConfirm?.()
    if (closeOnConfirm && result !== false) {
      onOpenChange?.(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn('max-w-[420px]', className)}
        showCloseButton={false}
      >
        <DialogHeader className="gap-3 text-left">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button type="button" variant={confirmVariant} onClick={handleConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
