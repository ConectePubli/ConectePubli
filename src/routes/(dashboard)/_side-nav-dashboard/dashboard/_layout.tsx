import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard/_layout',
)({
  component: () => <div>Hello /dashboard/_layout!</div>,
})
