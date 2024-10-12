import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard/',
)({
  component: () => <div>Hello /dashboard/!</div>,
})
