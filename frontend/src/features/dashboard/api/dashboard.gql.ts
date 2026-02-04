import { gql } from '@apollo/client'

export const DASHBOARD_SUMMARY_QUERY = gql`
  query DashboardSummary($input: DashboardSummaryInput) {
    dashboardSummary(input: $input) {
      period
      balanceTotal
      monthIncome
      monthExpense
      categories {
        transactionsCount
        total
        income
        expense
        category {
          id
          name
          iconKey
          colorKey
        }
      }
    }
  }
`
