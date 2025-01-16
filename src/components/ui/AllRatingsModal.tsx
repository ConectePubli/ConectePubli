import React, { useMemo } from "react";
import Modal from "./Modal";
import logo from "@/assets/logo.svg";
import { Rating as StarRating } from "react-simple-star-rating";
import { Rating } from "@/types/Rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

interface Props {
  ratings: Rating[];
  // conecteRatings: Rating[];
  userType: "brand" | "influencer";
  onClose: () => void;
}

const AllRatingsModal: React.FC<Props> = ({
  ratings,
  // conecteRatings, TODO: COMENTADO POIS POR ENQUANTO NÃO VAMOS MOSTRAR AS AVALIAÇÕES DA CONECTE
  userType,
  onClose,
}) => {
  const { t } = useTranslation(); // Cálculo da média geral
  const overallAverage = useMemo(() => {
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
  }, [ratings]);

  // const overallAverageConecte = useMemo(() => { TODO: COMENTADO POIS POR ENQUANTO NÃO VAMOS MOSTRAR AS AVALIAÇÕES DA CONECTE
  //   if (conecteRatings.length === 0) return 0;

  //   let totalSum = 0;
  //   let count = 0;

  //   conecteRatings.forEach((rating) => {
  //     if (rating.feedback && rating.feedback.length > 0) {
  //       rating.feedback.forEach((f) => {
  //         totalSum += f.rating;
  //         count++;
  //       });
  //     }
  //   });

  //   return count > 0 ? totalSum / count : 0;
  // }, [conecteRatings]);

  // const totalReviewsConecte = conecteRatings.length; TODO: COMENTADO POIS POR ENQUANTO NÃO VAMOS MOSTRAR AS AVALIAÇÕES DA CONECTE
  const totalReviews = ratings.length;

  //   const renderStars = (value: number) => { TODO: COMENTADO POIS SERIA PARA USAR UM ICON CUSTOM PORÉM NÃO FIZERAM CERTO NO FIGMA E O SVG FICA ERRADO
  //     const fullStars = Math.floor(value);
  //     const hasHalfStar = value - fullStars >= 0.5;
  //     const stars = [];

  //     for (let i = 1; i <= 5; i++) {
  //       if (i <= fullStars) {
  //         stars.push(
  //           <Star key={i} className="text-yellow-500 w-5 h-5 fill-current" />
  //         );
  //       } else if (hasHalfStar && i === fullStars + 1) {
  //         stars.push(<Star key={i} className="text-gray-300 w-5 h-5" />);
  //       } else {
  //         stars.push(<Star key={i} className="text-gray-300 w-5 h-5" />);
  //       }
  //     }
  //     return <div className="flex">{stars}</div>;
  //   };

  // Formatar data
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal onClose={onClose}>
      <div className="flex flex-col gap-4 max-h-[80vh] w-full max-w-3xl overflow-auto p-2 sm:p-4 scrollbar-hide">
        <div>
          <img src={logo} alt="ConectePubli" className="w-52" />
          {/* <div className="flex flex-row items-center"> TODO: COMENTADO POIS POR ENQUANTO NÃO VAMOS MOSTRAR AS AVALIAÇÕES DA CONECTE
            <StarRating
              initialValue={overallAverageConecte}
              readonly={true}
              allowFraction={true}
              size={24}
              SVGclassName={"inline-block"}
              fillColor={"#10438F"}
              emptyColor={"#D1D5DB"}
            />
            <p className="text-sm text-gray-600 mt-[2px] ml-3">
              ({totalReviewsConecte} avaliações da plataforma)
            </p>
          </div> */}
        </div>
        <div className="border-t border-gray-300" />

        {/* Cabeçalho: média geral e número de avaliações */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <StarRating
              initialValue={overallAverage}
              readonly={true}
              allowFraction={true}
              size={24}
              SVGclassName={"inline-block"}
              fillColor={"#eab308"}
              emptyColor={"#D1D5DB"}
            />
          </div>
          <p className="text-sm text-black font-bold ml-1">
            ({totalReviews} {totalReviews === 1 ? "review" : "reviews"}{" "}
            {userType === "brand" ? t("da marca") : t("do usuário")})
          </p>
        </div>

        <div className="border-t border-gray-300" />

        {/* Lista de avaliações */}
        {ratings.length === 0 ? (
          <p className="text-center text-gray-500 mt-4">
            {t("Nenhuma avaliação recebida.")}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            {ratings.map((rating) => {
              const isBrandProfile = userType === "brand";
              const from = isBrandProfile
                ? rating.expand?.from_influencer
                : rating.expand?.from_brand;
              const fromName = from?.name || "Usuário Desconhecido";

              let url = "";
              if (isBrandProfile && rating.expand?.from_influencer) {
                url = `/creator/${rating.expand.from_influencer.username}`;
              } else if (!isBrandProfile && rating.expand?.from_brand) {
                url = `/marca/${rating.expand.from_brand.username}`;
              }

              const fromCollectionName = isBrandProfile
                ? rating.expand?.from_influencer?.collectionName
                : rating.expand?.from_brand?.collectionName;

              const fromProfileImg = isBrandProfile
                ? rating.expand?.from_influencer?.profile_img
                : rating.expand?.from_brand?.profile_img;

              const fromId = isBrandProfile
                ? rating.expand?.from_influencer?.id
                : rating.expand?.from_brand?.id;

              let individualAverage = 0;
              if (rating.feedback && rating.feedback.length > 0) {
                const sum = rating.feedback.reduce(
                  (acc, f) => acc + f.rating,
                  0
                );
                individualAverage = sum / rating.feedback.length;
              }

              const campaignName =
                rating.expand?.campaign?.name || "Campanha Desconhecida";

              return (
                <div
                  key={rating.id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm bg-white scrollbar-hide"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 cursor-default">
                    <div className="flex flex-col">
                      <div className="flex items-center flex-row gap-2">
                        <Avatar
                          className={`hover:cursor-pointer ${isBrandProfile ? "" : "rounded-md"}`}
                          onClick={() => {
                            if (url) {
                              window.open(url, "_blank", "noopener,noreferrer");
                            }
                          }}
                        >
                          <AvatarImage
                            src={`${import.meta.env.VITE_POCKETBASE_URL}/api/files/${fromCollectionName}/${fromId}/${fromProfileImg}`}
                          />
                          <AvatarFallback
                            className={`hover:cursor-pointer ${isBrandProfile ? "" : "rounded-md"}`}
                          >
                            {fromName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {fromName}
                          </span>
                          <p className="text-sm text-gray-600">
                            {formatDate(rating.created)}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating
                        initialValue={individualAverage}
                        readonly={true}
                        allowFraction={true}
                        size={24}
                        SVGclassName={"inline-block"}
                        fillColor={"#eab308"}
                        emptyColor={"#D1D5DB"}
                      />
                      <span className="text-sm text-gray-600">
                        ({individualAverage.toFixed(1)})
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-sm text-gray-800 mt-2 font-bold hover:underline hover:cursor-pointer"
                    onClick={() => {
                      const url = `/dashboard/campanhas/${rating.expand?.campaign?.unique_name}`;
                      window.open(url, "_blank", "noopener,noreferrer");
                    }}
                  >
                    {campaignName}
                  </p>

                  {rating.feedback && rating.feedback.length > 0 && (
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
                      {rating.feedback.map((f, index) => (
                        <React.Fragment key={index}>
                          <span className="text-sm text-gray-700 font-semibold">
                            {f.short_term}: {f.rating.toFixed(0)}/5
                          </span>
                          {index < rating.feedback!.length - 1 && (
                            <span className="text-sm text-gray-700 hidden sm:block">
                              •
                            </span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  )}

                  {rating.comment && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 mt-1">
                        {rating.comment}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AllRatingsModal;
