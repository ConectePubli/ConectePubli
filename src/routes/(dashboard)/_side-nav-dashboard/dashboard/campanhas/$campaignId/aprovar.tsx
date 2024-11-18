import {
  createFileRoute,
  notFound,
  useLoaderData,
  redirect,
} from "@tanstack/react-router";
import pb from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/campanhas/$campaignId/aprovar"
)({
  loader: async ({ params: { campaignId } }) => {
    try {
      const campaignData = await pb
        .collection("Campaigns")
        .getFirstListItem(`id="${campaignId}"`);

      const currentBrandId = pb.authStore.model?.id;
      if (!currentBrandId) {
        throw redirect({ to: "/login" });
      }

      if (!campaignData) {
        throw notFound();
      }

      if (campaignData.brand !== currentBrandId) {
        throw redirect({ to: "/dashboard" });
      }

      return { campaignData };
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        return { error: "not_found" };
      }
      console.error("Error fetching campaign data:", error);
      throw error;
    }
  },
  component: Page,
  errorComponent: () => (
    <div>
      Ocorreu um erro ao carregar essa página. Não se preocupe, estamos
      trabalhando para resolvê-lo!
    </div>
  ),
  notFoundComponent: () => <div>Campanha não encontrada</div>,
});

function Page() {
  const { campaignData, error } = useLoaderData({ from: Route.id });

  const navigate = useNavigate();

  if (error === "not_found") {
    return <div>Campanha não encontrada</div>;
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="font-bold text-xl">
        Tela de administração da campanha. Recomendo deletar esse côdigo todo quando for fazer essa US pois talvez seja mais fácil do que seguir esse côdigo como base.
      </h1>
      <div>
        <strong>ID da Campanha:</strong> {campaignData.id}
      </div>
      <div>
        <strong>Nome da Campanha:</strong> {campaignData.name || "N/A"}
      </div>
      <Button className="mt-4 w-fit" variant={"orange"} onClick={() => {
          navigate({ to: `/dashboard/campanhas/${campaignData.id}/editar` });
        }}>
        Editar Campanha
      </Button>
    </div>
  );
}
