import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import Spinner from "@/components/ui/Spinner";
import { Spinner as SpinnerPhosphor } from "phosphor-react";
import pb from "@/lib/pb";
import { Influencer } from "@/types/Influencer";
import { useState, useMemo, useEffect } from "react";
import { createOrGetChat } from "@/services/chatService";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import debounce from "lodash.debounce";
import { channelIcons } from "@/utils/socialMediasIcons";
import GoldCheckIcon from "@/assets/icons/gold-check.svg";
import LocationPin from "@/assets/icons/location-pin.svg";
import Tag from "@/assets/icons/tag.svg";
import { Search } from "lucide-react";

const searchSchema = z.object({
  page: z.number().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/vitrine-de-creators/"
)({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => {
    const page = Number(search.page ?? 1);
    const q = search.q ?? "";
    return { page, q };
  },
  loader: async ({ deps: { page, q } }) => {
    const userType = pb.authStore.model?.collectionName;
    if (userType === "Influencers") {
      throw redirect({
        to: "/dashboard-creator",
      });
    }
    const brandId = pb.authStore.model?.id;
    let hasPlan = true;
    try {
      // Tenta buscar o registro usando a brandId
      console.log("Buscando o plano da marca...", brandId);
      await pb
        .collection("purchased_brand_plans")
        .getFirstListItem(`brand="${brandId}" && active=true`);
    } catch (error) {
      hasPlan = false;
      console.error("Erro ao buscar o plano da marca:", error);
    }
    const perPage = 6;

    let filter = 'name != ""';

    if (q) {
      filter += ` && (full_name ~ "${q}" || name ~ "${q}" || neighborhood ~ "${q}" || city ~ "${q}" || state ~ "${q}" || country ~ "${q}" || account_type ~ "${q}")`;
    }
    const result = await pb
      .collection("Influencers")
      .getList<Influencer>(page, perPage, {
        filter,
        sort: "-top_creator,created",
      });
    console.log(result);

    return {
      creators: result.items,
      totalPages: result.totalPages,
      page,
      hasPlan,
      q,
    };
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-[calc(100vh-66px)] ">
      <Spinner />
    </div>
  ),
  staleTime: Infinity,
  shouldReload: false,
  component: Page,
});

function Page() {
  const { creators, totalPages, page, hasPlan } = Route.useLoaderData();
  const router = useRouter();
  const [loadingChatId, setLoadingChatId] = useState<string | null>(null);
  const [loadingPage, setLoadingPage] = useState(false);

  const debouncedNavigate = useMemo(
    () =>
      debounce((query: string) => {
        router.navigate({
          // @ts-expect-error - Não sei como corrigir isso
          search: (prev) => ({
            ...prev,
            q: query,
            page: 1,
          }),
        });
      }, 500),
    [router]
  );

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    debouncedNavigate(newValue);
  }

  useEffect(() => {
    setLoadingPage(false);
  }, [page]);

  function setPage(newPage: number) {
    setLoadingPage(true);
    router.navigate({
      // @ts-expect-error - Não sei como corrigir isso
      search: (prev) => ({
        ...prev,
        page: newPage,
      }),
    });
  }

  const handleStartChat = async (influencerId: string, brandId: string) => {
    setLoadingChatId(influencerId);

    try {
      const chat = await createOrGetChat("", influencerId, brandId);

      router.navigate({
        to: "/dashboard/chat/",
        search: {
          campaignId: chat.campaign,
          influencerId: chat.influencer,
          brandId: chat.brand,
        },
      });
    } catch (error) {
      console.error("Erro ao iniciar o chat:", error);
      toast("Não foi possível iniciar o chat", {
        type: "error",
      });
    } finally {
      setLoadingChatId(null);
    }
  };

  if (!hasPlan) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-66px)] bg-gradient-to-b from-blue-50 to-blue-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md mb-[66px]">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Acesso Restrito
          </h1>
          <p className="text-gray-600 mb-6">
            Essa funcionalidade está disponível apenas para marcas do plano
            <span className="text-[#FF672F] font-bold"> Premium</span>. Faça o
            upgrade e aproveite todos os benefícios.
          </p>

          <button
            onClick={() => router.navigate({ to: "/premium/marca" })}
            className="bg-[#10438F] text-white px-6 py-3 rounded-lg hover:bg-[#10438F]/90 transition-all font-semibold"
          >
            Ver Planos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Vitrine de Creators</h1>
      <p className="mb-4">
        Descubra os creators da nossa plataforma e entre em contato com os que
        mais se alinham à sua marca.
      </p>

      <div className="relative z-0 mb-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-black" />
        </div>
        <input
          id="campaignSearch"
          type="text"
          placeholder="Pesquisar pelo nome do Creator"
          onChange={handleSearchChange}
          className="w-full pl-10 p-2 border-black/40 border border-gray-300 rounded-lg"
        />
      </div>

      {creators.length === 0 ? (
        <p className="text-gray-600">Nenhum creator encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {creators.map((creator) => {
            const socialLinks = [
              { name: "Instagram", url: creator.instagram_url },
              { name: "YouTube", url: creator.youtube_url },
              { name: "Tiktok", url: creator.tiktok_url },
              { name: "Facebook", url: creator.facebook_url },
              { name: "LinkedIn", url: creator.linkedin_url },
              { name: "Twitter", url: creator.twitter_url },
              { name: "Twitch", url: creator.twitch_url },
              { name: "Pinterest", url: creator.pinterest_url },
              { name: "Kwai", url: creator.kwai_url },
              { name: "YourClub", url: creator.yourclub_url },
            ].filter((link) => link.url);

            return (
              <div
                key={creator.id}
                className="border-[1px] rounded-xl border-black/40 p-4 flex flex-col items-start h-full"
              >
                <div
                  className="flex items-center mb-4 hover:cursor-pointer"
                  onClick={() =>
                    router.navigate({ to: `/creator/${creator.username}` })
                  }
                >
                  {creator.profile_img && (
                    <img
                      src={pb.getFileUrl(creator, creator.profile_img)}
                      alt={creator.full_name}
                      className="w-24 h-24 rounded-full mr-3 object-cover"
                    />
                  )}
                  {!creator.profile_img && (
                    <div className="w-24 h-24 rounded-full mr-3 bg-gray-200">
                      <div className="flex items-center justify-center h-full text-gray-500 font-bold line-clamp-1">
                        {creator.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-row">
                  <h2
                    className="text-lg font-semibold mr-2 hover:cursor-pointer line-clamp-1"
                    onClick={() =>
                      router.navigate({ to: `/creator/${creator.username}` })
                    }
                  >
                    {creator.full_name !== ""
                      ? creator.full_name
                      : creator.name}
                  </h2>
                  {creator.top_creator && (
                    <div
                      className={`inline-flex items-center gap-x-1 px-2 py-1 rounded-full font-bold text-xs cursor-default select-none bg-blue-900 text-yellow-300`}
                    >
                      <img
                        src={GoldCheckIcon}
                        alt={"Gold Check"}
                        className="w-4 h-4"
                        draggable={false}
                      />
                      Top Creator
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-700 mb-2 flex flex-col">
                  {(creator.account_type && (
                    <p className="flex items-center font-bold text-[#052759] mt-2">
                      <img
                        src={Tag}
                        alt="Tipo de conta"
                        className="w-4 h-4 mr-1"
                      />
                      {creator.account_type}
                    </p>
                  )) || (
                    <p className="flex items-center font-bold text-[#052759] mt-2">
                      <img
                        src={Tag}
                        alt="Tipo de conta"
                        className="w-4 h-4 mr-1"
                      />
                      Não informado
                    </p>
                  )}
                  {(creator.city && creator.state && creator.country && (
                    <p className="flex items-center text-[#E34105] mt-2 font-bold">
                      <img
                        src={LocationPin}
                        alt="Localização"
                        className="w-4 h-4 mr-1"
                      />
                      {creator.city}, {creator.state}, {creator.country}
                    </p>
                  )) || (
                    <p className="flex items-center text-[#E34105] mt-2 font-bold">
                      <img
                        src={LocationPin}
                        alt="Localização"
                        className="w-4 h-4 mr-1"
                      />
                      Localização não informada
                    </p>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-3 min-h-[60px]">
                  {creator.bio || "Biografia não informada."}
                </p>

                <div className="text-sm text-gray-800 mb-4">
                  <p>
                    <strong>1 Reels:</strong>{" "}
                    {(creator.feed_price / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    <strong>1 Vídeo + Combo de Fotos UGC:</strong>{" "}
                    {(creator.feed_price / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    <strong>Stories IGC:</strong>{" "}
                    {(creator.stories_price / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </p>
                  <p>
                    <strong>Post no Feed:</strong>{" "}
                    {(creator.feed_price / 100).toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                      minimumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="flex flex-wrap space-x-2 mb-4">
                  {socialLinks.length > 0 ? (
                    socialLinks.map((link) => {
                      const Icon =
                        channelIcons[link.name as keyof typeof channelIcons];
                      return (
                        <a
                          key={link.name}
                          href={link.url!}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <img src={Icon} className="w-5 h-5" alt={link.name} />
                        </a>
                      );
                    })
                  ) : (
                    <p className="text-gray-600 min-h-[20px]"></p>
                  )}
                </div>

                <button
                  className="bg-[#FF672F] text-white px-4 py-2 rounded hover:bg-[#FF672F]/90 font-bold mt-auto disabled:cursor-not-allowed"
                  onClick={() =>
                    handleStartChat(creator.id, pb.authStore.model?.id)
                  }
                  disabled={
                    loadingChatId === creator.id ||
                    creator.id === pb.authStore.model?.id ||
                    loadingChatId !== null
                  }
                >
                  {loadingChatId === creator.id ? (
                    <SpinnerPhosphor className="animate-spin w-6 h-6" />
                  ) : (
                    "Enviar mensagem"
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center space-x-4 items-center">
          <button
            onClick={() => setPage(Math.max(page - 1, 1))}
            disabled={page === 1 || loadingPage}
            className="px-4 py-2 rounded disabled:opacity-50 bg-[#093474] text-white font-semibold w-24 flex justify-center items-center"
          >
            {loadingPage ? (
              <SpinnerPhosphor className="animate-spin w-6 h-6" />
            ) : (
              "Anterior"
            )}
          </button>
          <span className="text-gray-600">
            Página <span className="font-bold">{page}</span> de{" "}
            <span className="font-bold">{totalPages}</span>
          </span>
          <button
            onClick={() => setPage(Math.min(page + 1, totalPages))}
            disabled={page === totalPages || loadingPage}
            className="px-4 py-2  rounded disabled:opacity-50 bg-[disabled:opacity-50] bg-[#093474] text-white font-semibold w-24 flex justify-center items-center"
          >
            {loadingPage ? (
              <SpinnerPhosphor className="animate-spin w-6 h-6" />
            ) : (
              "Próxima"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
