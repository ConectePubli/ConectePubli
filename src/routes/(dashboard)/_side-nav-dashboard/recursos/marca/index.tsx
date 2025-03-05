/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createFileRoute,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { t } from "i18next";
import { toast } from "react-toastify";
import { useState } from "react";

import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";

import { BrandProduct } from "@/types/BrandProduct";

import Spinner from "@/components/ui/Spinner";
import GatewayPaymentModal from "@/components/ui/GatewayPaymentModal";
import Modal from "@/components/ui/Modal";

import guia_completo_marcas from "@/assets/contents_creators/guia_completo_marcas.png";
import dicionario_creator_economy360 from "@/assets/contents_creators/dicionario_creator_economy360.png";
import guia_precificacao from "@/assets/contents_creators/guia_precificacao.png";

import dicionario_creator_economy360_pdf from "@/assets/contents_creators/downloads/Dicionário da Creators Economy.pdf";
import guia_precificacao_pdf from "@/assets/contents_creators/downloads/GuiaTabela de Precificação UGC e IGC Marcas.pdf";
import guia_completo_marcas_pdf from "@/assets/contents_creators/downloads/Ebook Creator Economy 360° - Um Guia Completo Para Marcas.pdf";

const medias = [
  {
    id: "zjogyr78a6kgwko",
    image: guia_completo_marcas,
    file: guia_completo_marcas_pdf,
  },
  {
    id: "ya0gwnz36ymmqs6",
    image: dicionario_creator_economy360,
    file: dicionario_creator_economy360_pdf,
  },
  {
    id: "qm4ae9d9hpvm802",
    image: guia_precificacao,
    file: guia_precificacao_pdf,
  },
];

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/recursos/marca/"
)({
  component: Page,
  loader: async () => {
    const userType = await getUserType();

    if (!userType) {
      throw redirect({
        to: "/login",
      });
    }

    if (userType !== "Brands") {
      throw redirect({
        to: "/dashboard",
      });
    }

    try {
      const brandProducts = await pb.collection("brand_products").getFullList();
      const brandProductsData = brandProducts as unknown as BrandProduct[];

      const userId = pb.authStore.model?.id;
      let purchasedProducts = [] as BrandProduct[];
      if (userId) {
        purchasedProducts = await pb
          .collection("purchased_brand_products")
          .getFullList({ filter: `brand="${userId}"` });
      }

      return { brandProducts: brandProductsData, purchasedProducts };
    } catch (error) {
      console.error("Erro no loader:", error);
      throw new Error(t("Erro ao carregar os produtos"));
    }
  },
  pendingComponent: () => (
    <div className="flex justify-center items-center h-screen">
      <Spinner />
    </div>
  ),
  errorComponent: () => (
    <div className="p-4">
      {t(
        "Aconteceu um erro ao carregar essa página, não se preocupe o erro é do nosso lado e vamos trabalhar para resolve-lo!"
      )}
    </div>
  ),
});

function Page() {
  const [paymentModal, setPaymentModal] = useState(false);
  const [setLoadingPayment] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<BrandProduct>();

  const { brandProducts, purchasedProducts } = useLoaderData({
    from: Route.id,
  }) as {
    brandProducts: BrandProduct[];
    purchasedProducts: any[];
  };

  const getMediaByProductId = (productId: string) =>
    medias.find((m) => m.id === productId);

  const purchasedProductsDetails = purchasedProducts.map((record) => {
    const product = brandProducts.find((p) => p.id === record.brand_product);
    const media = product ? getMediaByProductId(product.id) : null;
    return { ...record, product, media };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {paymentModal && (
        <Modal onClose={() => setPaymentModal(false)}>
          <GatewayPaymentModal
            type="brand_product"
            unit_amount={selectedProduct?.pagseguro_price}
            toast={toast}
            setLoadingPayment={setLoadingPayment}
            product={selectedProduct}
          />
        </Modal>
      )}

      <h1 className="text-2xl font-bold text-left">
        {t("Creator Economy 360º: Estratégia e Conhecimento para Marcas")}
      </h1>
      <p className="text-left text-gray-700 mb-8 mt-3">
        {t(
          "Descubra como transformar suas campanhas com os produtos essenciais Creator Economy"
        )}
      </p>

      {/* PRODUTOS COMPRADOS */}
      {purchasedProductsDetails.length > 0 && (
        <div className="pb-10 mb-10 border-b border-gray-400">
          <h2 className="text-2xl font-semibold text-green-600 mb-4">
            Itens Comprados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {purchasedProductsDetails.map((item) => {
              if (!item.product || !item.media) return null;
              return (
                <div
                  key={item.product.id}
                  className="bg-white border border-green-400 shadow-md rounded-lg overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative">
                    <img
                      src={item.media.image}
                      alt={item.product.stripe_product_name}
                      className="w-full h-60 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold flex-grow mb-2 text-left">
                      {t(item.product.stripe_product_name)}
                    </h3>
                    <div className="mt-auto">
                      <a
                        href={item.media.file}
                        download
                        className="w-full bg-blue-500 text-white py-2 rounded-md text-center block hover:bg-blue-600 transition"
                      >
                        {t("Download")}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {brandProducts
          .filter(
            (dbProduct) =>
              !purchasedProducts.find(
                (record) => record.brand_product === dbProduct.id
              )
          )
          .map((dbProduct) => {
            const media = medias.find((m) => m.id === dbProduct.id);
            if (!media) return null;

            return (
              <div
                key={dbProduct.id}
                className="bg-white border border-gray-300 shadow-md rounded-lg overflow-hidden flex flex-col justify-between"
              >
                <div className="relative">
                  <img
                    src={media.image}
                    alt={dbProduct.stripe_product_name}
                    className="w-full h-60 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold flex-grow mb-2 text-left">
                    {t(dbProduct.stripe_product_name)}
                  </h3>
                  <div className="mt-auto">
                    <button
                      className="w-full bg-orange-500 text-white py-2 rounded-md text-center block hover:bg-orange-600 transition"
                      onClick={() => {
                        console.log(dbProduct);
                        setSelectedProduct(dbProduct);
                        setPaymentModal(true);
                      }}
                    >
                      {`${(dbProduct.pagseguro_price / 100).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}`}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default Page;
