import { createFileRoute } from "@tanstack/react-router";
import { CampaignForm } from "@/components/ui/CampaignForm";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/criar-campanha/"
)({
  component: () => {
    return <CampaignForm />;
  },
});
