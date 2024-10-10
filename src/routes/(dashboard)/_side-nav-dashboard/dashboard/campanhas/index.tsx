import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard/campanhas/',
)({
  component: () => <div>Hello /_side-nav-dashboard/dashboard/campanhas/!</div>,
})
