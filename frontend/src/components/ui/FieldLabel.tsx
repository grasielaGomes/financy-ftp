import type * as LabelPrimitive from '@radix-ui/react-label'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/Label'
import { fieldLabelClassName } from './fieldLabelStyles'

type FieldLabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
  hasError?: boolean
}

export const FieldLabel = ({
  className,
  hasError,
  ...props
}: FieldLabelProps) => {
  return (
    <Label
      data-slot="field-label"
      data-error={!!hasError}
      className={fieldLabelClassName}
      {...props}
    />
  )
}
