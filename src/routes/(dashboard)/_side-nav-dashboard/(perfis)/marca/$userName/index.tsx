import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/(perfis)/marca/$userName/',
)({
  component: () => <div>Hello /marca/$userName/!</div>,
})
