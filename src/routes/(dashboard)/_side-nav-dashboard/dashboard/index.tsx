import { isAuthenticatedBrands, isAuthenticatedInfluencer } from "@/lib/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/"
)({
  component: () => <div>Hello /dashboard/!</div>,
  beforeLoad: async () => {
    const isBrandAuth = await isAuthenticatedBrands();
    const isInfluencerAuth = await isAuthenticatedInfluencer();

    if (!isBrandAuth && !isInfluencerAuth) {
      throw redirect({
        to: "/login123new",
      });
    }
  },
});
