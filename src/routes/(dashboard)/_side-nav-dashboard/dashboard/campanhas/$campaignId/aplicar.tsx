import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/aplicar',
)({
  component: () => (
    <div>
      Hello /_side-nav-dashboard/dashboard/campanhas/$campaignId/aplicar!
    </div>
  ),
})
