/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  createFileRoute,
  redirect,
  useLoaderData,
  useMatch,
  useNavigate,
} from "@tanstack/react-router";
import { MapPin, Globe, User } from "lucide-react";
import { Hourglass, GenderIntersex, Image, Tag } from "phosphor-react";
import { useMutation } from "@tanstack/react-query";
import { t } from "i18next";
import { Rating as StarRating } from "react-simple-star-rating";
import { RecordModel } from "pocketbase";

import { UserAuth } from "@/types/UserAuth";
import { Influencer } from "@/types/Influencer";
import { Niche } from "@/types/Niche";
import { Rating } from "@/types/Rating";
import SocialNetworks from "@/types/SocialNetworks";

import CreatorIcon from "@/assets/icons/megaphone.svg";
import LocationPin from "@/assets/icons/location-pin.svg";
import EditIcon from "@/assets/icons/edit.svg";

import pb from "@/lib/pb";
import { getUserType } from "@/lib/auth";
import { isInfluencerPremium } from "@/services/influencerPremium";

import AllRatingsModal from "@/components/ui/AllRatingsModal";
import Spinner from "@/components/ui/Spinner";
import TopCreatorBadge from "@/components/ui/top-creator-badge";
import { CreatorPremiumBadge } from "@/components/ui/CreatorPremiumBadge";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/creator/$username/"
)({
  component: InfluencerProfilePage,
  loader: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    }

    const isPremium = await isInfluencerPremium();

    return { isPremium };
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ),
});

function InfluencerProfilePage() {
  const navigate = useNavigate();

  const { isPremium } = useLoaderData({ from: Route.id });

  const {
    params: { username },
  } = useMatch({
    from: "/(dashboard)/_side-nav-dashboard/creator/$username/",
  });

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [userLogged, setUserLogged] = useState<UserAuth | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  // const [conecteRatings, setConecteRatings] = useState<Rating[]>([]); TODO: COMENTADO POIS POR ENQUANTO NÃO VAMOS MOSTRAR AS AVALIAÇÕES DA CONECTE
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const returnGender = (gender: string) => {
    switch (gender) {
      case "male":
        return t("Homem");
      case "female":
        return t("Mulher");
      case "non-binary":
        return t("Não-binário");
    }
  };

  const getUserInfo = async () => {
    const user: UserAuth = JSON.parse(
      localStorage.getItem("pocketbase_auth") as string
    );

    setUserLogged(user);

    try {
      const influencerData = await pb.collection("Influencers").getFullList({
        filter: `username="${username}"`,
        expand: "niche",
      });

      return influencerData[0];
    } catch (e) {
      console.log(`error get user info: ${e}`);
      throw e;
    }
  };

  const getUserRating = async (influencer: RecordModel) => {
    try {
      const ratings = await pb.collection("ratings").getFullList({
        filter: `to_influencer~"${influencer?.id}"`,
        expand: "from_brand,campaign",
      });

      // const conecteRatings = await pb.collection("ratings").getFullList({
      //   filter: `to_conectepubli=true`,
      // }); TODO: COMENTADO POIS POR ENQUANTO NÃO VAMOS MOSTRAR AS AVALIAÇÕES DA CONECTE

      // setConecteRatings(conecteRatings as unknown as Rating[]); TODO: COMENTADO POIS POR ENQUANTO NÃO VAMOS MOSTRAR AS AVALIAÇÕES DA CONECTE
      setRatings(ratings as unknown as Rating[]);
      return ratings;
    } catch (e) {
      console.log(`error get user rating: ${e}`);
      throw e;
    }
  };

  const calculateOverallAverage = () => {
    if (ratings.length === 0) return 0;

    let totalSum = 0;
    let count = 0;

    ratings.forEach((rating) => {
      if (rating.feedback && rating.feedback.length > 0) {
        rating.feedback.forEach((f) => {
          totalSum += f.rating;
          count++;
        });
      }
    });

    return count > 0 ? totalSum / count : 0;
  };

  const totalReviews = ratings.length;
  const overallAverage = calculateOverallAverage();

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return "N/A";
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const mutate = useMutation({
    mutationFn: async () => {
      const data = await getUserInfo();
      setInfluencer(data as unknown as Influencer);

      const ratings = await getUserRating(data);
      setRatings(ratings as unknown as Rating[]);

      return data;
    },
    onError: (error) => {
      console.log(`Mutation error: ${error}`);
    },
  });

  useEffect(() => {
    mutate.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  // const toggleFAQ = (index: number) => {
  //   setOpenFAQ(openFAQ === index ? null : index);
  // };

  // const faqs = [
  //   {
  //     question: "What is the difference between a UI and UX Designer?",
  //     answer:
  //       "UI refers to User Interface, which deals with the visual aspects of a design, while UX stands for User Experience, focusing on the overall feel and functionality of a product.",
  //   },
  //   {
  //     question: "How can I improve my UX design skills?",
  //     answer:
  //       "Improving UX design skills requires practicing empathy with users, conducting usability tests, learning design principles, and keeping up with industry trends.",
  //   },
  //   {
  //     question: "What tools do UI/UX designers use?",
  //     answer:
  //       "UI/UX designers commonly use tools like Figma, Sketch, Adobe XD, and InVision for design, prototyping, and collaboration.",
  //   },
  //   {
  //     question: "What is user research?",
  //     answer:
  //       "User research involves gathering insights about user needs, behaviors, and motivations through interviews, surveys, and usability tests to inform design decisions.",
  //   },
  //   {
  //     question: "How do you handle accessibility in design?",
  //     answer:
  //       "Accessibility in design ensures that products are usable by people with disabilities, by following guidelines like WCAG, ensuring proper contrast, and providing assistive technology support.",
  //   },
  // ];

  const niches = influencer?.expand?.niche || [];

  if (mutate.isPending) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (mutate.isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center">
          {t("Erro ao carregar as informações do Creator")}
        </p>
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center">
          {t("Esta página ou não existe ou foi removida, tente novamente!")}
        </p>
      </div>
    );
  }

  const isOne = totalReviews === 1;
  const review = isOne
    ? t("avaliacao_one", { count: totalReviews })
    : t("avaliacao_other", { count: totalReviews });

  return (
    <div className="flex p-0 flex-col">
      {/* COVER IMAGE */}
      {influencer.background_img ? (
        <img
          src={pb.getFileUrl(influencer, influencer.background_img)}
          alt="Cover Image"
          className="w-full max-w-full h-64 object-cover mx-auto"
        />
      ) : (
        <div className="w-full h-64 bg-[#10438F] flex items-center justify-center">
          <Image color="#fff" size={40} />
        </div>
      )}

      <div className="px-2 sm-medium:px-4">
        {/* PROFILE IMAGE */}
        <div className="flex flex-row items-center mt-4">
          {influencer.profile_img ? (
            <img
              src={pb.getFileUrl(influencer, influencer.profile_img)}
              alt={influencer.full_name}
              className="w-20 h-20 rounded-[100%] object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-[100%] bg-gray-300 flex items-center justify-center">
              <User color="#fff" size={20} />
            </div>
          )}

          {/* BASIC INFO */}
          <div className="ml-3">
            <p className="text-gray-700 text-sm font-bold flex flex-row items-center">
              <img
                src={CreatorIcon}
                alt="creator icon"
                className="w-3 h-3 mr-2"
              />{" "}
              {t("Creator/Influencer")}
            </p>
            <h1 className="text-xl font-bold flex flex-col sm:flex-row sm:items-center">
              <span className="break-words break-all">
                {influencer.name || "..."}
              </span>

              <div className="mt-2 sm:mt-0 sm:ml-4">
                {influencer.top_creator ? (
                  <TopCreatorBadge status={true} />
                ) : userLogged?.model?.username === username ? (
                  <TopCreatorBadge status={false} />
                ) : null}
              </div>

              {isPremium ? (
                <div className="sm:ml-4">
                  <CreatorPremiumBadge />
                </div>
              ) : null}
            </h1>
          </div>
        </div>

        {/* TYPE */}
        {influencer.account_type && (
          <p className="text-gray-800 text-sm font-bold flex flex-row items-center mt-4">
            <Tag size={18} color="#10438F" className="mr-1" />{" "}
            {influencer.account_type}
          </p>
        )}

        {/* LOCATION */}
        {(influencer.city || influencer.state || influencer.country) && (
          <div className="flex flex-row items-center mt-3">
            <img
              src={LocationPin}
              alt="location pin"
              className="w-5 h-5 mr-1"
            />
            <p className="text-orange-600 font-bold text-md truncate max-w-xs">
              {influencer.city}, {influencer.state}, {influencer.country}
            </p>
          </div>
        )}

        {/* Média de Avaliações e Total de Reviews */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mt-2 mb-3">
          {/* Estrelas da Média */}
          <StarRating
            initialValue={overallAverage}
            readonly={true}
            allowFraction={true}
            size={24}
            SVGclassName={"inline-block"}
            fillColor={"#eab308"}
            emptyColor={"#D1D5DB"}
          />

          <div className="flex flex-col sm:flex-row sm:items-center mt-2 sm:mt-1">
            <span className="text-black/75 text-sm ml-0 sm:ml-3">{review}</span>

            <div className="flex items-center mt-2 sm:mt-0">
              <div className="w-[6px] h-[6px] bg-orange-600 rounded-full ml-0 sm:ml-3"></div>
              <button
                className="ml-2 sm:ml-3 text-[#10438F] hover:underline font-bold"
                onClick={() => setIsRatingModalOpen(true)}
              >
                {t("Ver Reviews do Usuário")}
              </button>
            </div>
          </div>
        </div>

        {/* SOCIAL LINKS */}
        <div className="flex flex-wrap gap-2 mt-2 sm-medium:gap-2">
          {SocialNetworks.map((network) => {
            const url = network.url(influencer as any);
            if (!url) return null;

            return (
              <a
                key={network.name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center border border-[#10438F] text-[#10438F] px-2 py-1 text-sm sm-medium:text-base rounded-md font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200 sm-medium:px-3 sm-medium:py-2 sm-medium:text-md"
              >
                <img
                  src={network.icon}
                  alt={`Ícone do ${network.name}`}
                  className="w-4 h-4 mr-1 sm-medium:w-5 sm-medium:h-5 sm-medium:mr-2"
                />
                {network.name}
              </a>
            );
          })}
        </div>

        <div className="flex flex-wrap space-x-3">
          {/* MEDIA KIT LINK */}
          <div
            className={`mt-4 sm-medium:gap-2 ${influencer.media_kit_url ? "gap-3" : ""}`}
          >
            {influencer.media_kit_url && (
              <a
                href={influencer.media_kit_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
                  {t("Acessar mídia kit")}
                </button>
              </a>
            )}
          </div>

          {/* EDIT BUTTON */}
          {userLogged?.model?.id?.includes(influencer.id) && (
            <div className="flex mt-4">
              <button
                className="text-white font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-lg shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
                onClick={() => navigate({ to: `/creator/${username}/editar` })}
              >
                <img
                  src={EditIcon}
                  alt="company icon"
                  className="w-4 h-4 text-white fill-current"
                  style={{ filter: "brightness(0) invert(1)" }}
                />
                {t("Editar Perfil")}
              </button>
            </div>
          )}
        </div>
      </div>

      <hr className="border my-4" />

      <div className="px-2 sm-medium:px-4">
        <h3 className="text-lg font-semibold mb-2">{t("Biografia")}</h3>

        <div className="flex items-center gap-4 flex-wrap mb-1">
          {/* COUNTRY AND STATE */}
          {(influencer.country || influencer.state) && (
            <p className="text-sm text-gray-600 font-medium flex items-center">
              <MapPin className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
              {influencer.country}
              {influencer.state ? `, ${influencer.state}` : ""}
            </p>
          )}

          {/* LANGUAGES */}
          {influencer.languages && influencer.languages.length > 0 && (
            <p className="text-sm text-gray-600 font-medium flex items-center">
              <Globe className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
              {t("Idioma:")} {influencer.languages.join(", ")}
            </p>
          )}

          {/* AGE */}
          {influencer.birth_date && (
            <p className="text-sm text-gray-600 font-medium flex items-center">
              <Hourglass className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
              {t("Idade:")} {calculateAge(influencer.birth_date)}
            </p>
          )}

          {/* GENDER */}
          {influencer.gender && (
            <p className="text-sm text-gray-600 font-medium flex items-center">
              <GenderIntersex className="inline-block w-4 h-4 text-gray-500 mr-1" />{" "}
              {returnGender(influencer.gender)}
            </p>
          )}
        </div>

        {/* BIO */}
        {influencer.bio ? (
          <p className="text-base text-black leading-relaxed">
            {influencer.bio}
          </p>
        ) : (
          <p className="text-gray-500">
            {t("Este usuário ainda não adicionou uma biografia.")}
          </p>
        )}

        {/* HASHTAGS */}
        {niches.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {niches.map((niche: Niche, index) => (
              <button
                key={index}
                className="bg-[#10438F] cursor-default text-white px-3 py-2 text-md rounded-md flex items-center font-semibold hover:bg-[#10438F] hover:text-white transition-colors duration-200"
                title={niche.niche}
              >
                <span>#{t(niche.niche)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <hr className="border my-4" />

      <div className="px-2 sm-medium:px-4">
        <h4 className="text-lg font-semibold mb-2">{t("Portfólio")}</h4>
        {/* PORTFOLIO MEDIA */}
        {influencer.previous_work_imgs &&
        influencer.previous_work_imgs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {influencer.previous_work_imgs.map((media, index) => {
              const fileExtension = (media ?? "")
                .split(".")
                .pop()
                ?.toLowerCase();
              const imageExtensions = [
                "jpg",
                "jpeg",
                "png",
                "gif",
                "bmp",
                "webp",
                "heic",
              ];
              const videoExtensions = ["mp4", "webm", "ogg", "mov"];

              const mediaUrl = pb.getFileUrl(influencer, media);

              if (fileExtension && imageExtensions.includes(fileExtension)) {
                return (
                  <img
                    key={index}
                    src={mediaUrl}
                    alt={`Portfolio ${index}`}
                    className="w-full h-[500px] rounded-md object-cover"
                  />
                );
              } else if (
                fileExtension &&
                videoExtensions.includes(fileExtension)
              ) {
                return (
                  <video
                    key={index}
                    src={mediaUrl}
                    controls
                    className="w-full h-[500px] rounded-md object-cover"
                  />
                );
              } else {
                return null;
              }
            })}
          </div>
        ) : (
          <p className="text-gray-500">
            {t(
              "Este usuário ainda não adicionou nenhum trabalho ao portfólio."
            )}
          </p>
        )}
      </div>
      {isRatingModalOpen && (
        <AllRatingsModal
          ratings={ratings}
          // conecteRatings={conecteRatings}
          onClose={() => setIsRatingModalOpen(false)}
          userType="influencer"
        />
      )}

      <div className="mt-12" />
    </div>
  );
}

export default InfluencerProfilePage;
