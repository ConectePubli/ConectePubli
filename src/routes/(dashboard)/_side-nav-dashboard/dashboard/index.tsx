import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/"
)({
  beforeLoad: async ({ search }) => {
    const userType = await getUserType();
    const { recentRegister } = search as { recentRegister: string };

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    } else if (userType === "Brands") {
      throw redirect({
        to: "/dashboard-marca",
        search: { recentRegister },
      });
    } else if (userType === "Influencers") {
      throw redirect({
        to: "/dashboard-creator",
        search: { recentRegister },
      });
    } else {
      pb.authStore.clear();
      throw redirect({
        to: "/login",
      });
    }
  },
});
