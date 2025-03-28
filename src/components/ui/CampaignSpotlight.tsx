import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addDays, formatISO } from "date-fns";
import { useTranslation } from "react-i18next";
import pb from "@/lib/pb";

import GoBack from "@/assets/icons/go-back.svg";

import { Campaign } from "@/types/Campaign";
import { SpotlightCampaignPlan } from "@/types/SpotlightCampaignPlan";

import { getPlans } from "@/services/spotightCampaign";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";

import GatewayPaymentModal from "./GatewayPaymentModal";
import Modal from "./Modal";
import Spinner from "./Spinner";
import { Button } from "./button";

interface Props {
  campaign: Campaign;
  setSpotlightCampaignPlans: React.ComponentState;
  spotlightCampaignPlans: React.ComponentState;
}

const CampaignSpotlight: React.FC<Props> = ({
  campaign,
  setSpotlightCampaignPlans,
  spotlightCampaignPlans,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedOption, setSelectedOption] = useState<string>("0");
  const [plans, setPlans] = useState<SpotlightCampaignPlan[]>([]);
  const [paymentModal, setPaymentModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const [loadingSpotlightPremium, setLoadingSpotlightPremium] = useState(false);

  const getPlansMutate = useMutation({
    mutationFn: async () => {
      await getPlans(setPlans, pb, setIsPremium);
    },
  });

  useEffect(() => {
    getPlansMutate.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 w-[80%] max-sm:w-[100%] max-sm:p-2">
      <div className="flex items-center gap-1 mb-2">
        <button
          className="bg-white pr-1 rounded-full"
          onClick={() => {
            setSpotlightCampaignPlans({
              ...spotlightCampaignPlans,
              state: false,
            });
          }}
        >
          <img src={GoBack} alt="Go Back" className="w-5 h-5" />
        </button>
        <button
          className="text-black/75 font-semibold translate-y-0.4"
          onClick={() => {
            setSpotlightCampaignPlans({
              ...spotlightCampaignPlans,
              state: false,
            });
          }}
        >
          {t("Voltar")}
        </button>
      </div>

      {paymentModal && (
        <Modal onClose={() => setPaymentModal(false)}>
          <GatewayPaymentModal
            plans={plans}
            selectedOption={selectedOption}
            campaign={campaign}
            type="buy_spotlight"
          />
        </Modal>
      )}

      <h1 className="text-xl font-bold mb-4">{t("Comprar Destaque")}</h1>
      <p className="mb-4 text-gray-600">
        {t(
          "Quer deixar sua campanha em destaque na plataforma e receber mais candidatos? Destaque sua campanha."
        )}
      </p>

      {getPlansMutate.isPending ? (
        <div className="w-full flex justify-center items-center mt-10">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-4">
          <div
            className={`border p-4 max-sm:p-3 rounded-lg cursor-pointer ${
              selectedOption === "0"
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            }`}
            onClick={() => setSelectedOption("0")}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg max-sm:text-base font-medium">
                {t("Sem Destaque")}
              </span>
              <span className="text-lg max-sm:text-base font-medium">
                R$ 0,00
              </span>
            </div>
            <p className="text-gray-500 max-sm:text-sm">
              {t("Sua campanha não receberá destaque.")}
            </p>
          </div>

          {isPremium && (
            <div
              className={`border p-4 max-sm:p-3 rounded-lg cursor-pointer ${
                selectedOption === "premium"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              }`}
              onClick={() => setSelectedOption("premium")}
            >
              <div className="flex justify-between items-center">
                <span className="text-lg max-sm:text-base font-medium">
                  {t("Destaque da assinatura")}{" "}
                  <span className="text-[#FF672F]">Premium</span>
                </span>
                <span className="text-lg max-sm:text-base font-medium">
                  R$ 0,00
                </span>
              </div>
              <p className="text-gray-500 max-sm:text-sm">
                {t("Sua campanha receberá um destaque de 5 dias.")}
              </p>
            </div>
          )}

          {plans.map((plan) => {
            // caso seja premium, mostrar apenas o plano de destaque de 10 dias
            if (isPremium && plan.id !== "kquityadsmxv3x3") {
              return;
            }

            return (
              <div
                key={plan.id}
                className={`border p-4 max-sm:p-3 rounded-lg cursor-pointer ${
                  selectedOption === plan.id
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedOption(plan.id)}
              >
                <div className="flex justify-between items-center">
                  <span className="text-lg max-sm:text-base font-medium">
                    {t(plan.stripe_product_name)}
                  </span>
                  <span className="text-lg max-sm:text-base font-medium">
                    {formatCentsToCurrency(plan.pagseguro_price)}
                  </span>
                </div>
                <p className="text-gray-500 max-sm:text-sm">
                  {t("Sua campanha ficará no topo por {{days}} dias.", {
                    days: plan.stripe_product_name.match(/\d+/)?.[0] || 0,
                  })}
                </p>
              </div>
            );
          })}

          <Button
            variant={"blue"}
            className="mt-6 w-full text-white py-2 rounded-lg"
            onClick={async () => {
              const selectedPlan = plans.find(
                (plan) => plan.id === selectedOption
              );

              if (selectedPlan) {
                setPaymentModal(true);
              } else {
                // plano de 5 dias automaticamente para marcas premium
                if (isPremium && selectedOption === "premium") {
                  setLoadingSpotlightPremium(true);
                  const spotlightEndDate = formatISO(addDays(new Date(), 5));

                  try {
                    await pb
                      .collection("purchased_campaigns_spotlights")
                      .create({
                        campaign: campaign.id,
                        spotlight: "9e5ytgp87a8ykwz", // destaque por 5 dias
                        spotlight_end: spotlightEndDate,
                      });
                  } catch (e) {
                    console.log(`error buy spotlight plan by premium`);
                    console.log(e);
                  } finally {
                    setLoadingSpotlightPremium(false);
                    navigate({
                      to: "/dashboard-marca",
                    });
                  }
                } else {
                  navigate({
                    to: "/dashboard-marca",
                  });
                }
              }
            }}
          >
            {selectedOption === "0" || selectedOption === "premium"
              ? `${selectedOption === "premium" ? `${loadingSpotlightPremium ? "Aguarde..." : "Destacar por 5 dias"}` : "Sem destaque"}`
              : `Destacar por (${
                  plans.find((plan) => plan.id === selectedOption)
                    ? formatCentsToCurrency(
                        plans.find((plan) => plan.id === selectedOption)!
                          .pagseguro_price
                      )
                    : "N/A"
                })`}
          </Button>

          <p className="mt-4 text-sm text-gray-500">
            {t(
              "O pagamento da campanha deverá ser realizado somente após a marca selecionar e aprovar todos os creators que deseja incluir na campanha. O valor final será calculado com base na multiplicação do valor definido por creator pelo número de creators aprovados. Após a confirmação do pagamento, a campanha será iniciada conforme o planejamento aprovado. Nota: Caso algum influenciador não cumpra os requisitos ou ocorra um problema comprovado, você poderá solicitar o reembolso de 100% do valor pago referente àquele influenciador. O valor do destaque, no entanto, não é reembolsável, pois corresponde ao serviço já prestado."
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default CampaignSpotlight;
