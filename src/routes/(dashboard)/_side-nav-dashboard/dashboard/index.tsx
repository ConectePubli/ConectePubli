import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/"
)({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login123new",
      });
    } else if (userType === "Brands") {
      throw redirect({
        to: "/dashboard-marca",
      });
    } else if (userType === "Influencers") {
      throw redirect({
        to: "/dashboard-influencer",
      });
    } else {
      pb.authStore.clear();
      throw redirect({
        to: "/login123new",
      });
    }
  },
});

function Page() {
  return (
    <div className="mx-auto py-6">
      <h1 className="text-2xl font-bold mb-2">Minhas Participações</h1>
      <p className="text-gray-700 mb-6">
        Acompanhe todas as campanhas nas quais você se inscreveu e gerencie suas
        participações.
      </p>
    </div>
  );
}

export default Page;
