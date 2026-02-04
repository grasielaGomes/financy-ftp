export const dashboardTypeDefs = /* GraphQL */ `
  type DashboardCategorySummary {
    category: Category!
    transactionsCount: Int!
    total: Float!
    income: Float!
    expense: Float!
  }

  type DashboardSummary {
    period: String!
    balanceTotal: Float!
    monthIncome: Float!
    monthExpense: Float!
    recentTransactions: [Transaction!]!
    categories: [DashboardCategorySummary!]!
  }

  input DashboardSummaryInput {
    period: String
    recentLimit: Int
  }

  extend type Query {
    dashboardSummary(input: DashboardSummaryInput): DashboardSummary!
  }
`
