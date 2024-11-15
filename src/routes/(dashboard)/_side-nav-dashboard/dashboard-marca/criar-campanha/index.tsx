import { createFileRoute, redirect } from "@tanstack/react-router";
import { CampaignForm } from "@/components/ui/CampaignForm";

import { getUserType } from "@/lib/auth";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard-marca/criar-campanha/"
)({
  component: () => {
    return <CampaignForm />;
  },
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login123new",
      });
    } else if (userType !== "Brands") {
      throw redirect({
        to: "/dashboard",
      });
    }
  },
});
