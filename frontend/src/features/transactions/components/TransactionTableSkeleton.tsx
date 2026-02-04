export const SKELETON_ROW_COUNT = 6

const ALIGNMENT_CLASS_BY_POSITION: Record<'left' | 'center' | 'right', string> =
  {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto',
  }

const SkeletonCell = ({
  align = 'left',
}: {
  align?: 'left' | 'center' | 'right'
}) => {
  const alignmentClass = ALIGNMENT_CLASS_BY_POSITION[align]

  return (
    <div
      className={['h-4 w-24 rounded bg-gray-200', alignmentClass].join(' ')}
    />
  )
}

const SkeletonBadge = () => {
  return <div className="mx-auto h-6 w-24 rounded bg-gray-200" />
}

const SkeletonIcon = () => {
  return <div className="h-10 w-10 rounded-full bg-gray-200" />
}

const SkeletonRow = () => {
  return (
    <tr className="animate-pulse border-b border-gray-100">
      <td className="pl-6 py-4">
        <div className="flex items-center">
          <SkeletonIcon />
          <div className="w-full pl-6">
            <div className="h-4 w-48 rounded bg-gray-200" />
          </div>
        </div>
      </td>
      <td className="py-4 text-center">
        <SkeletonCell align="center" />
      </td>
      <td className="py-4 text-center">
        <SkeletonBadge />
      </td>
      <td className="py-4 text-center">
        <SkeletonCell align="center" />
      </td>
      <td className="py-4 pr-2 text-right">
        <SkeletonCell align="right" />
      </td>
      <td className="py-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <div className="h-9 w-9 rounded bg-gray-200" />
          <div className="h-9 w-9 rounded bg-gray-200" />
        </div>
      </td>
    </tr>
  )
}

type TransactionTableSkeletonRowsProps = {
  rows?: number
}

export const TransactionTableSkeletonRows = ({
  rows = SKELETON_ROW_COUNT,
}: TransactionTableSkeletonRowsProps) => {
  return (
    <>
      {Array.from({ length: rows }, (_, index) => (
        <SkeletonRow key={index} />
      ))}
    </>
  )
}
