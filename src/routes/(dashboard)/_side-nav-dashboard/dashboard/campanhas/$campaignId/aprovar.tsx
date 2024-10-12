import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/aprovar',
)({
  component: () => (
    <div>
      Hello /_side-nav-dashboard/dashboard/campanhas/$campaignId/aprovar!
    </div>
  ),
})
