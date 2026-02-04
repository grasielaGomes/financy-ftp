import { Card } from '@/components/ui/Card'

const TABLE_SKELETON_ROW_COUNT = 6

export const TransactionsFiltersSkeleton = () => {
  return (
    <Card className="py-5 px-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
        <div className="grid gap-2">
          <div className="h-4 w-20 rounded bg-gray-100" />
          <div className="h-12 w-full rounded-lg bg-gray-100" />
        </div>
        <div className="grid gap-2">
          <div className="h-4 w-14 rounded bg-gray-100" />
          <div className="h-12 w-full rounded-lg bg-gray-100" />
        </div>
        <div className="grid gap-2">
          <div className="h-4 w-20 rounded bg-gray-100" />
          <div className="h-12 w-full rounded-lg bg-gray-100" />
        </div>
        <div className="grid gap-2">
          <div className="h-4 w-20 rounded bg-gray-100" />
          <div className="h-12 w-full rounded-lg bg-gray-100" />
        </div>
      </div>
    </Card>
  )
}

export const TransactionsTableSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="animate-pulse">
        <div className="border-b border-gray-100 px-6 py-5">
          <div className="h-4 w-56 rounded bg-gray-100" />
        </div>

        <div className="divide-y divide-gray-100">
          {Array.from({ length: TABLE_SKELETON_ROW_COUNT }).map((_, i) => (
            <div key={i} className="px-6 py-5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-gray-100" />
              <div className="flex-1">
                <div className="h-4 w-72 rounded bg-gray-100" />
                <div className="mt-2 h-3 w-44 rounded bg-gray-100" />
              </div>
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-4 w-20 rounded bg-gray-100" />
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-9 w-20 rounded bg-gray-100" />
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 px-4 py-3">
          <div className="h-4 w-44 rounded bg-gray-100" />
        </div>
      </div>
    </Card>
  )
}
