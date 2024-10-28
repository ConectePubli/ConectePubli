import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard-influencer/',
)({
  component: () => (
    <div>Hello /(dashboard)/_side-nav-dashboard/dashboard-influencer/!</div>
  ),
})
