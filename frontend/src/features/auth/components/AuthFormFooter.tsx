import type * as React from 'react'
import { Separator } from '@/components/ui/Separator'
import { Button } from '@/components/ui/Button'

type AuthFormFooterProps = {
  question: string
  actionLabel: string
  actionIcon?: React.ReactNode
  onActionClick: () => void
}

export const AuthFormFooter = ({
  question,
  actionLabel,
  actionIcon,
  onActionClick,
}: AuthFormFooterProps) => {
  return (
    <>
      <div className="flex items-center gap-3 py-1">
        <Separator className="flex-1" />
        <span className="text-sm text-gray-500">ou</span>
        <Separator className="flex-1" />
      </div>

      <p className="text-center text-sm text-gray-600">{question}</p>

      <Button
        type="button"
        variant="outline"
        size="md"
        className="w-full"
        onClick={onActionClick}
      >
        {actionIcon}
        {actionLabel}
      </Button>
    </>
  )
}
