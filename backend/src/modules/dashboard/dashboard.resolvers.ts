import type { GraphQLContext } from '@/graphql/context'
import { requireUser } from '@/shared/auth/requireUser'
import { dashboardService } from './dashboard.service'

type DashboardSummaryArgs = {
  input?: {
    period?: string
    recentLimit?: number
  }
}

export const dashboardResolvers = {
  Query: {
    dashboardSummary: async (
      _parent: unknown,
      args: DashboardSummaryArgs,
      ctx: GraphQLContext,
    ) => {
      const userId = requireUser(ctx)
      return dashboardService.getSummary(ctx.prisma, userId, args.input)
    },
  },
}
