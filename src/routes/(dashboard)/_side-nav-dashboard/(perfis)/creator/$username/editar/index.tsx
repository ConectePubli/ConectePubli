/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  createFileRoute,
  useNavigate,
  useMatch,
  redirect,
} from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import { CaretDown, CaretUp, Image, Plus, User, X } from "phosphor-react";
import pb from "@/lib/pb";
import { UserAuth } from "@/types/UserAuth";
import { Influencer } from "@/types/Influencer";
import Spinner from "@/components/ui/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getUserType } from "@/lib/auth";
import { CheckCircle, Circle, Eye, EyeClosed, Settings } from "lucide-react";
import { ClientResponseError } from "pocketbase";

import FacebookIcon from "@/assets/icons/brands/facebook.svg";
import InstagramIcon from "@/assets/icons/brands/instagram.svg";
import KwaiIcon from "@/assets/icons/brands/kwai.svg";
import LinkedInIcon from "@/assets/icons/brands/linkedin.svg";
import PinterestIcon from "@/assets/icons/brands/pinterest.svg";
import TiktokIcon from "@/assets/icons/brands/tiktok.svg";
import TwitchIcon from "@/assets/icons/brands/twitch.svg";
import TwitterIcon from "@/assets/icons/brands/twitter.svg";
import YourClubIcon from "@/assets/icons/brands/yourclub.svg";
import YouTubeIcon from "@/assets/icons/brands/youtube.svg";
import { ComboboxNiches } from "@/components/ui/ComboBoxNiches";
import { Button } from "@/components/ui/button";
import { formatCentsToCurrency } from "@/utils/formatCentsToCurrency";

interface Option {
  value: string;
  label: string;
}

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/creator/$username/editar/"
)({
  component: InfluencerEditProfilePage,
  beforeLoad: async () => {
    if (!(await getUserType())) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function InfluencerEditProfilePage() {
  const navigate = useNavigate();

  const {
    params: { username },
  } = useMatch({
    from: "/(dashboard)/_side-nav-dashboard/creator/$username/editar/",
  });

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [formData, setFormData] = useState<Influencer>();
  const [loading, setLoading] = useState(true);

  const requiredFields: { [key: string]: string[] } = {
    basicData: ["background_img", "bio"],
    about: [
      "name",
      "birth_date",
      "email",
      "cell_phone",
      "account_type",
      "gender",
    ],
    address: [
      "country",
      "cep",
      "street",
      "neighborhood",
      "city",
      "state",
      "address_num",
    ],
    socialMedia: ["At least one social media field"],
    bankAccount: ["pix_key"],
    mediaKit: ["media_kit_url"],
    skills: ["languages"],
    accountInfo: [],
    portfolio: [],
    prices: ["stories_price", "feed_price", "reels_price", "ugc_price"],
  };

  // State to manage isFormChanged and loading per section
  const [isFormChangedStates, setIsFormChangedStates] = useState<any>({
    basicData: false,
    about: false,
    address: false,
    socialMedia: false,
    mediaKit: false,
    bankAccount: false,
    portfolio: false,
    prices: false,
    skills: false,
    accountInfo: false,
  });

  const [loadingStates, setLoadingStates] = useState<any>({
    basicData: false,
    about: false,
    address: false,
    socialMedia: false,
    mediaKit: false,
    bankAccount: false,
    portfolio: false,
    prices: false,
    skills: false,
    accountInfo: false,
  });

  const [addressFieldsDisabled, setAddressFieldsDisabled] = useState(true);

  // check sections
  const [sectionCompletion, setSectionCompletion] = useState({
    basicData: false,
    about: false,
    address: false,
    socialMedia: false,
    mediaKit: false,
    bankAccount: false,
    portfolio: false,
    prices: false,
    skills: false,
    accountInfo: false,
  });

  // Estados adicionais para nichos
  const [allNiches, setAllNiches] = useState<Option[]>([]);
  const [isLoadingNiches, setIsLoadingNiches] = useState<boolean>(false);
  const [nichesError, setNichesError] = useState<string | null>(null);

  function isFieldEmpty(value: any): boolean {
    if (value === undefined || value === null) {
      return true;
    }
    if (typeof value === "string") {
      return value.trim() === "";
    }
    if (typeof value === "number") {
      return value === 0 || isNaN(value);
    }
    if (typeof value === "boolean") {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    if (value instanceof Date) {
      return isNaN(value.getTime());
    }
    return false;
  }

  const checkSectionCompletion = (section: string) => {
    const missingFields: string[] = [];

    if (formData) {
      if (section !== "portfolio") {
        if (section === "socialMedia") {
          const socialFields = [
            "instagram_url",
            "tiktok_url",
            "facebook_url",
            "youtube_url",
            "pinterest_url",
            "twitter_url",
            "twitch_url",
            "linkedin_url",
            "kwai_url",
            "yourclub_url",
          ];
          const hasAtLeastOne = socialFields.some((field) => {
            const value = formData[field as keyof Influencer];
            return !isFieldEmpty(value);
          });
          if (!hasAtLeastOne) {
            missingFields.push(
              "Pelo menos uma rede social deve ser preenchida."
            );
          }
        } else {
          const fields = requiredFields[section] || [];
          fields.forEach((field) => {
            const value = formData[field as keyof Influencer];
            if (isFieldEmpty(value)) {
              missingFields.push(field);
            }
          });
        }
      } else {
        if (formData["previous_work_imgs"].length === 0) {
          return false;
        }
      }
    }

    return missingFields.length === 0;
  };

  useEffect(() => {
    if (formData) {
      const sections = Object.keys(requiredFields);
      const newSectionCompletion: any = {};
      sections.forEach((section) => {
        newSectionCompletion[section] = checkSectionCompletion(section);
      });
      setSectionCompletion(newSectionCompletion);
    }
  }, [formData]);

  useEffect(() => {
    const fetchUserAndInfluencer = async () => {
      try {
        const userAuthStr = localStorage.getItem("pocketbase_auth");
        if (!userAuthStr) {
          navigate({ to: "/login" });
          return;
        }
        const user: UserAuth = JSON.parse(userAuthStr);

        const influencerData = await pb.collection("Influencers").getFullList({
          filter: `username="${username}"`,
          expand: "niche",
        });

        if (influencerData.length === 0) {
          navigate({ to: `/creator/${username}` });
          return;
        }

        const influencerInfo = influencerData[0] as unknown as Influencer;

        if (user.model.id !== influencerInfo.id) {
          navigate({ to: `/creator/${username}` });
          return;
        }

        if (influencerInfo.birth_date) {
          influencerInfo.birth_date = influencerInfo.birth_date.split(" ")[0];
        }

        if (influencerInfo.expand?.niche) {
          influencerInfo.niche = influencerInfo.expand.niche.map(
            (niche: any) => niche.id
          );
        }

        setInfluencer(influencerInfo);
        setFormData(influencerInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(
          "Erro ao buscar dados do influenciador. Por favor, tente novamente.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );

        navigate({ to: `/creator/${username}` });
      }
    };

    fetchUserAndInfluencer();
  }, [username]);

  // Efeito para buscar todos os nichos disponíveis
  useEffect(() => {
    const fetchAllNiches = async () => {
      setIsLoadingNiches(true);

      try {
        const nichesData = await pb.collection("niches").getFullList({
          sort: "-created",
        });
        const formattedNiches = nichesData.map((niche: any) => ({
          value: niche.id,
          label: niche.niche,
        }));
        setAllNiches(formattedNiches);
        setIsLoadingNiches(false);
      } catch (error) {
        console.error("Erro ao buscar nichos:", error);
        setNichesError("Erro ao carregar nichos.");
        setIsLoadingNiches(false);
      }
    };
    fetchAllNiches();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    let newValue: any = value;
    if (files && files.length > 0) {
      newValue = files[0];
    }

    setFormData((prev: any) => {
      const updatedFormData = { ...prev, [name]: newValue };
      return updatedFormData;
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLButtonElement>,
    section: string
  ) => {
    e.preventDefault();

    // Função para validar campos
    const validateFields = () => {
      const missingFields: string[] = [];

      if (formData) {
        if (section !== "portfolio") {
          if (section === "socialMedia") {
            // Validação para a seção de redes sociais
            const socialFields = [
              "instagram_url",
              "tiktok_url",
              "facebook_url",
              "youtube_url",
              "pinterest_url",
              "twitter_url",
              "twitch_url",
              "linkedin_url",
              "kwai_url",
              "yourclub_url",
            ];
            const hasAtLeastOne = socialFields.some(
              (field) =>
                formData[field as keyof Influencer] &&
                //@ts-expect-error
                formData[field as keyof Influencer]?.trim() !== ""
            );
            if (!hasAtLeastOne) {
              missingFields.push(
                "Pelo menos uma rede social deve ser preenchida."
              );
            }
          } else {
            const fields = requiredFields[section] || [];
            fields.forEach((field) => {
              if (
                !formData[field as keyof Influencer] ||
                (typeof formData[field as keyof Influencer] === "string" &&
                  //@ts-expect-error
                  formData[field as keyof Influencer].trim() === "")
              ) {
                const fieldNames: { [key: string]: string } = {
                  background_img: "Foto de fundo",
                  bio: "Bio",
                  name: "Nome Completo",
                  username: "Username",
                  birth_date: "Data de Nascimento",
                  email: "Email",
                  cell_phone: "Telefone Celular",
                  account_type: "Tipo de Conta",
                  gender: "Gênero",
                  country: "País",
                  cep: "CEP",
                  street: "Rua",
                  neighborhood: "Bairro",
                  city: "Cidade",
                  state: "Estado",
                  address_num: "Número",
                  pix_key: "Chave Pix",
                  media_kit_url: "Mídia Kit",
                  languages: "Idiomas",
                  stories_price: "Preço por stories",
                  feed_price: "Preço por post no feed",
                  reels_price: "Preço por reels",
                  ugc_price: "Preço por vídeo e combo UGC",
                };
                missingFields.push(fieldNames[field] || field);
              }
            });
          }
        }
      }

      return missingFields;
    };

    const missingFields = validateFields();

    if (missingFields.length > 0) {
      toast.warning(
        <div>
          <strong>Campos Obrigatórios:</strong>
          <ul className="list-disc list-inside">
            {missingFields.map((field, index) => (
              <li key={index}>{field}</li>
            ))}
          </ul>
        </div>,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }

    setLoadingStates((prev: any) => ({ ...prev, [section]: true }));

    if (formData) {
      try {
        const updateData: any = {};

        if (section === "basicData") {
          if (formData.background_img) {
            updateData["background_img"] = formData.background_img;
          }
          if (formData.profile_img) {
            updateData["profile_img"] = formData.profile_img;
          }
          if (formData.bio) {
            updateData["bio"] = formData.bio;
          }
          if (influencer && influencer.niche) {
            updateData["niche"] = influencer.niche;
          }
        } else if (section === "about") {
          updateData["name"] = formData.name;
          updateData["username"] = formData.username;
          updateData["birth_date"] = formData.birth_date;
          updateData["email"] = formData.email;
          updateData["cell_phone"] = formData.cell_phone;
          updateData["account_type"] = formData.account_type;
          updateData["gender"] = formData.gender;
        } else if (section === "address") {
          updateData["country"] = formData.country;
          updateData["cep"] = formData.cep;
          updateData["street"] = formData.street;
          updateData["address_num"] = formData.address_num;
          updateData["complement"] = formData.complement;
          updateData["neighborhood"] = formData.neighborhood;
          updateData["city"] = formData.city;
          updateData["state"] = formData.state;
        } else if (section === "socialMedia") {
          updateData["instagram_url"] = formData.instagram_url;
          updateData["tiktok_url"] = formData.tiktok_url;
          updateData["facebook_url"] = formData.facebook_url;
          updateData["youtube_url"] = formData.youtube_url;
          updateData["pinterest_url"] = formData.pinterest_url;
          updateData["twitter_url"] = formData.twitter_url;
          updateData["twitch_url"] = formData.twitch_url;
          updateData["linkedin_url"] = formData.linkedin_url;
          updateData["kwai_url"] = formData.kwai_url;
          updateData["yourclub_url"] = formData.yourclub_url;
        } else if (section === "mediaKit") {
          updateData["media_kit_url"] = formData.media_kit_url;
        } else if (section === "bankAccount") {
          updateData["pix_key"] = formData.pix_key;
        } else if (section === "portfolio") {
          if (
            formData.previous_work_imgs &&
            formData.previous_work_imgs.length > 0
          ) {
            updateData["previous_work_imgs"] = formData.previous_work_imgs;
          } else {
            updateData["previous_work_imgs"] = null;
          }
        } else if (section === "prices") {
          updateData["stories_price"] = formData.stories_price;
          updateData["feed_price"] = formData.feed_price;
          updateData["reels_price"] = formData.reels_price;
          updateData["ugc_price"] = formData.ugc_price;
        } else if (section === "skills") {
          updateData["languages"] = formData.languages;
        }

        const data = new FormData();

        for (const key in updateData) {
          const value = updateData[key];

          if (value === undefined || value === null) {
            data.append(key, "");
          } else if (value instanceof File) {
            data.append(key, value);
          } else if (Array.isArray(value)) {
            if (value.length === 0) {
              data.append(key, "");
            } else {
              value.forEach((item: any) => {
                data.append(key, item);
              });
            }
          } else {
            data.append(key, value);
          }
        }

        await pb.collection("Influencers").update(influencer!.id, data);
        await pb.collection("Influencers").authRefresh();

        setIsFormChangedStates((prev: any) => ({ ...prev, [section]: false }));
      } catch (error) {
        console.error("Error updating data:", error);

        const err = error as ClientResponseError;

        let errorMessage =
          "Erro ao salvar as alterações. Por favor, tente novamente.";

        if (err && err.data && err.data.data && err.data.data.username) {
          const usernameError = err.data.data.username;

          if (usernameError.code === "validation_invalid_username") {
            errorMessage = "O nome de usuário é inválido ou já está em uso.";
          }
        }

        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } finally {
        setLoadingStates((prev: any) => ({ ...prev, [section]: false }));
      }
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const cep = e.target.value;
    setFormData((prev: any) => ({ ...prev, cep }));
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setFormData((prev: any) => ({
            ...prev,
            street: data.logradouro,
            neighborhood: data.bairro,
            city: data.localidade,
            state: data.uf,
          }));
          setAddressFieldsDisabled(false);
        } else {
          setAddressFieldsDisabled(false);
        }
      } catch (error) {
        console.error("Error fetching CEP data:", error);
        toast.error(
          "CEP não encontrado. Por favor, verifique o CEP informado.",
          {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
        setAddressFieldsDisabled(false);
      }
    } else {
      setAddressFieldsDisabled(true);
    }
    setIsFormChangedStates((prev: any) => ({ ...prev, address: true }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Section
        title="Dados básicos"
        initiallyOpen
        completed={sectionCompletion.basicData}
        hasUnsavedChanges={isFormChangedStates.basicData}
      >
        <BasicDataSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.basicData}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.basicData}
          setLoadingStates={setLoadingStates}
          setFormData={setFormData}
          allNiches={allNiches}
          isLoadingNiches={isLoadingNiches}
          nichesError={nichesError}
          influencer={influencer as Influencer}
          setInfluencer={setInfluencer}
        />
      </Section>
      <Section
        title="Sobre você"
        completed={sectionCompletion.about}
        hasUnsavedChanges={isFormChangedStates.about}
      >
        <AboutSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.about}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.about}
          setLoadingStates={setLoadingStates}
        />
      </Section>

      <Section
        title="Endereço"
        completed={sectionCompletion.address}
        hasUnsavedChanges={isFormChangedStates.address}
      >
        <AddressSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleCepChange={handleCepChange}
          addressFieldsDisabled={addressFieldsDisabled}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.address}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.address}
          setLoadingStates={setLoadingStates}
        />
      </Section>
      <Section
        title="Redes sociais"
        completed={sectionCompletion.socialMedia}
        hasUnsavedChanges={isFormChangedStates.socialMedia}
      >
        <SocialMediaSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.socialMedia}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.socialMedia}
          setLoadingStates={setLoadingStates}
        />
      </Section>
      <Section
        title="Mídia kit"
        completed={sectionCompletion.mediaKit}
        hasUnsavedChanges={isFormChangedStates.mediaKit}
      >
        <MediaKitSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.mediaKit}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.mediaKit}
          setLoadingStates={setLoadingStates}
        />
      </Section>
      <Section
        title="Conta bancária"
        completed={sectionCompletion.bankAccount}
        hasUnsavedChanges={isFormChangedStates.bankAccount}
      >
        <BankAccountSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.bankAccount}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.bankAccount}
          setLoadingStates={setLoadingStates}
        />
      </Section>
      <Section
        title="Portfólio"
        completed={sectionCompletion.portfolio}
        hasUnsavedChanges={isFormChangedStates.portfolio}
      >
        <PortfolioSection
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.portfolio}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.portfolio}
          setLoadingStates={setLoadingStates}
        />
      </Section>
      <Section
        title="Preços para cada tipo de conteúdo"
        completed={sectionCompletion.prices}
        hasUnsavedChanges={isFormChangedStates.prices}
      >
        <PricesSection
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.prices}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.prices}
          setLoadingStates={setLoadingStates}
          handleInputChange={handleInputChange}
        />
      </Section>
      <Section
        title="Idiomas"
        completed={sectionCompletion.skills}
        hasUnsavedChanges={isFormChangedStates.skills}
      >
        <SkillsSection
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.skills}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.skills}
          setLoadingStates={setLoadingStates}
        />
      </Section>
      <Section title="Configurações da Conta" isConfig={true}>
        <AccountInfoSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.accountInfo}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.accountInfo}
          setLoadingStates={setLoadingStates}
        />
      </Section>

      <ToastContainer />
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  completed?: boolean;
  isConfig?: boolean;
  hasUnsavedChanges?: boolean;
}

function Section({
  title,
  children,
  initiallyOpen = false,
  completed,
  isConfig,
  hasUnsavedChanges,
}: SectionProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="bg-white rounded-lg overflow-hidden border-2">
      <div
        className="flex justify-between items-center cursor-pointer bg-gray-100 px-5 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-2 sm:space-x-4">
          {completed !== undefined && (
            <div>
              {completed ? (
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
              )}
            </div>
          )}
          {isConfig !== undefined && isConfig && (
            <div>
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
            </div>
          )}
          <span className="text-base sm:text-lg font-medium truncate">
            {title}
          </span>
          {hasUnsavedChanges && (
            <span className="text-red-500 text-sm font-semibold ml-2">
              *Clique em "Salvar Alterações" ao final deste item
            </span>
          )}
        </div>
        {isOpen ? (
          <CaretUp size={22} color="#333" />
        ) : (
          <CaretDown size={22} color="#333" />
        )}
      </div>
      {isOpen && <div className="mt-4 space-y-6 px-5 pb-5">{children}</div>}
    </div>
  );
}
interface FormProps {
  formData: any;
  setFormData?: any;
  handleInputChange?: any;
  handleSubmit: any;
  isFormChanged: any;
  setIsFormChangedStates: any;
  loading: boolean;
  addressFieldsDisabled?: boolean;
  handleCepChange?: any;
  setLoadingStates: React.ComponentState;
  allNiches?: Option[];
  isLoadingNiches?: boolean;
  nichesError?: string | null;
  influencer?: Influencer;
  setInfluencer?: React.ComponentState;
}

function BasicDataSection({
  formData,
  handleInputChange,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
  allNiches = [],
  isLoadingNiches = false,
  nichesError = null,
  influencer,
  setInfluencer,
}: FormProps) {
  const handleSectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleInputChange(e);
    setIsFormChangedStates((prev: any) => ({ ...prev, basicData: true }));
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de fundo*
          </label>
          {formData.background_img ? (
            <img
              src={
                formData.background_img
                  ? formData.background_img instanceof File
                    ? URL.createObjectURL(formData.background_img)
                    : pb.getFileUrl(formData, formData.background_img)
                  : "https://via.placeholder.com/600"
              }
              alt="Cover"
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
          ) : (
            <div className="w-full h-48 object-cover rounded-lg mb-4 bg-gray-300 flex items-center justify-center">
              <Image size={40} color="#fff" />
            </div>
          )}

          <input
            type="file"
            name="background_img"
            className="border border-gray-300 p-2 rounded-lg w-full"
            onChange={handleSectionInputChange}
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Carregar nova imagem de perfil
          </label>
          {formData.profile_img ? (
            <img
              src={
                formData.profile_img
                  ? formData.profile_img instanceof File
                    ? URL.createObjectURL(formData.profile_img)
                    : pb.getFileUrl(formData, formData.profile_img)
                  : "https://via.placeholder.com/80"
              }
              alt="Profile"
              className="w-20 h-20 object-cover rounded-full border-2 border-gray-300"
            />
          ) : (
            <div className="w-20 h-20 rounded-full border-2 bg-gray-300 flex items-center justify-center">
              <User size={22} color="#fff" />
            </div>
          )}
          <input
            type="file"
            name="profile_img"
            className="border border-gray-300 p-2 rounded-lg mt-4 max-sm: w-full"
            onChange={handleSectionInputChange}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Bio*
        </label>
        <textarea
          name="bio"
          className="border border-gray-300 p-2 rounded-lg w-full"
          rows={3}
          placeholder="Escreva uma breve descrição sobre você"
          value={formData.bio || ""}
          onChange={handleSectionInputChange}
        />
      </div>

      <div className="mt-6">
        <div className="flex flex-row items-center mb-2">
          <h2 className="text-sm font-semibold">Nicho</h2>
          <p className="text-[#10438F] text-lg">*</p>
        </div>

        {isLoadingNiches ? (
          <div className="flex items-center justify-center w-full p-3 border rounded-md">
            <p className="text-gray-500 text-center">Carregando nichos...</p>
            <p className="text-xs text-gray-500">
              * É necessário salvar as alterações de cada seção para que elas
              sejam aplicadas.
            </p>
          </div>
        ) : nichesError ? (
          <p className="text-red-500">{nichesError}</p>
        ) : (
          <>
            <ComboboxNiches
              niches={allNiches}
              selectedNiches={influencer?.niche || []}
              setSelectedNiches={(selected) => {
                setInfluencer({ ...influencer, niche: selected });
              }}
              setIsFormChangedStates={setIsFormChangedStates}
            />

            <div className="mt-2 flex flex-wrap gap-2 mb-8">
              {influencer?.niche?.map((value) => (
                <Button
                  key={value}
                  variant="blue"
                  className="flex items-center gap-2 sm:max-w-sm"
                  onClick={() => {
                    setInfluencer({
                      ...influencer,
                      niche: influencer?.niche?.filter((f) => f !== value),
                    });
                    setIsFormChangedStates((prev: React.ComponentState) => ({
                      ...prev,
                      basicData: true,
                    }));
                  }}
                >
                  <span className="flex-1 min-w-0 truncate">
                    {allNiches.find((f) => f.value === value)?.label}
                  </span>
                  <span className="ml-1 flex-shrink-0">&times;</span>
                </Button>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg mt-4`}
        onClick={(e) => handleSubmit(e, "basicData")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </>
  );
}

function AboutSection({
  formData,
  handleInputChange,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  const [usernameError, setUsernameError] = useState("");
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  const handleSectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleInputChange(e);
    const { name, value } = e.target;

    if (name === "username") {
      if (!usernameRegex.test(value)) {
        setUsernameError(
          "O username deve conter apenas letras, números e underscores, sem espaços."
        );
      } else {
        setUsernameError("");
      }
    }

    setIsFormChangedStates((prev: any) => ({ ...prev, about: true }));
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome Completo*
        </label>
        <input
          type="text"
          name="name"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Nome completo"
          value={formData.name || ""}
          onChange={handleSectionInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Username*
        </label>
        <input
          type="text"
          name="username"
          className={`border ${usernameError ? "border-red-500" : "border-gray-300"} p-2 rounded-lg w-full`}
          placeholder="Username"
          value={formData.username || ""}
          onChange={handleSectionInputChange}
        />
        {usernameError && (
          <p className="text-red-500 text-sm mt-1">{usernameError}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Data de Nascimento*
        </label>
        <input
          type="date"
          name="birth_date"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="DD/MM/AAAA"
          value={formData.birth_date || ""}
          onChange={handleSectionInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email*
        </label>
        <input
          type="email"
          name="email"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Email"
          value={formData.email || ""}
          onChange={handleSectionInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Whatsapp*
        </label>
        <input
          type="tel"
          name="cell_phone"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Número do Whatsapp"
          value={formData.cell_phone || ""}
          onChange={handleSectionInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Conta*
        </label>
        <select
          name="account_type"
          className="border border-gray-300 p-2 rounded-lg w-full"
          value={formData.account_type || ""}
          onChange={handleSectionInputChange}
        >
          <option value="" disabled>
            Selecione o tipo de conta
          </option>
          <option value="UGC">UGC (Creator)</option>
          <option value="IGC">IGC (Nano, Micro e Macro)</option>
          <option value="UGC + IGC">UGC + IGC</option>
        </select>
        <p className="text-sm text-gray-500 mt-2">
          <strong>UGC (Creators):</strong> Você cria vídeos ou fotos que serão
          entregues para as marcas utilizarem em suas campanhas, anúncios ou
          redes sociais.
          <br />
          <strong>IGC (Nano, Micro e Macro influenciadores):</strong> Você cria
          e compartilha o conteúdo diretamente nas suas redes sociais,
          promovendo produtos e serviços para seu público.
          <br />
          <strong>UGC + IGC:</strong> Você tanto cria o conteúdo para as marcas
          utilizarem quanto compartilha esse conteúdo nas suas próprias redes
          sociais, atuando nas duas frentes.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gênero*
        </label>
        <select
          name="gender"
          className="border border-gray-300 p-2 rounded-lg w-full"
          value={formData.gender || ""}
          onChange={handleSectionInputChange}
        >
          <option value="" disabled>
            Selecione o seu gênero
          </option>
          <option value="male">Masculino</option>
          <option value="female">Feminino</option>
          <option value="non_binary">Não binário</option>
          <option value="other">Outro</option>
        </select>
      </div>

      <button
        className={`${
          isFormChanged && !usernameError
            ? "bg-blue-600"
            : "bg-gray-400 cursor-not-allowed"
        } text-white py-2 px-4 rounded-lg mt-4`}
        onClick={(e) => handleSubmit(e, "about")}
        disabled={!isFormChanged || !!usernameError || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </>
  );
}

function AddressSection({
  formData,
  handleInputChange,
  handleCepChange,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  const handleSectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleInputChange(e);
    setIsFormChangedStates((prev: any) => ({ ...prev, address: true }));
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País*
          </label>
          <input
            type="text"
            name="country"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="País"
            value={formData.country || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CEP*
          </label>
          <input
            type="text"
            name="cep"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Digite seu CEP"
            value={formData.cep || ""}
            onChange={handleCepChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Logradouro (Rua, Avenida, Alameda, etc.)*
          </label>
          <input
            type="text"
            name="street"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Rua"
            value={formData.street || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bairro*
          </label>
          <input
            type="text"
            name="neighborhood"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Bairro"
            value={formData.neighborhood || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cidade*
          </label>
          <input
            type="text"
            name="city"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Cidade"
            value={formData.city || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado*
          </label>
          <input
            type="text"
            name="state"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Estado"
            value={formData.state || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Complemento
          </label>
          <input
            type="text"
            name="complement"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Complemento"
            value={formData.complement || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número*
          </label>
          <input
            type="text"
            name="address_num"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Número"
            value={formData.address_num || ""}
            onChange={handleSectionInputChange}
          />
        </div>
      </div>
      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg`}
        onClick={(e) => handleSubmit(e, "address")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </>
  );
}

function SocialMediaSection({
  formData,
  handleInputChange,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  const handleSectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleInputChange(e);
    setIsFormChangedStates((prev: any) => ({ ...prev, socialMedia: true }));
  };

  return (
    <>
      <p className="text-gray-500 text-sm mb-4">
        Preencha pelo menos uma rede social. Todas as redes sociais são
        opcionais, mas é necessário que ao menos um campo esteja preenchido.
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram
          </label>
          <div className="relative">
            <input
              type="url"
              name="instagram_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.instagram_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={InstagramIcon}
                alt="Instagram"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* YouTube */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube
          </label>
          <div className="relative">
            <input
              type="url"
              name="youtube_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.youtube_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={YouTubeIcon}
                alt="YouTube"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn
          </label>
          <div className="relative">
            <input
              type="url"
              name="linkedin_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.linkedin_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={LinkedInIcon}
                alt="LinkedIn"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* YourClub */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YourClub
          </label>
          <div className="relative">
            <input
              type="url"
              name="yourclub_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.yourclub_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={YourClubIcon}
                alt="YourClub"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Kwai */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kwai
          </label>
          <div className="relative">
            <input
              type="url"
              name="kwai_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.kwai_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={KwaiIcon}
                alt="Kwai"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* TikTok */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TikTok
          </label>
          <div className="relative">
            <input
              type="url"
              name="tiktok_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.tiktok_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={TiktokIcon}
                alt="TikTok"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Facebook */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook
          </label>
          <div className="relative">
            <input
              type="url"
              name="facebook_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.facebook_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={FacebookIcon}
                alt="Facebook"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Twitter [X] */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter [X]
          </label>
          <div className="relative">
            <input
              type="url"
              name="twitter_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.twitter_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={TwitterIcon}
                alt="Twitter"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Twitch */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitch
          </label>
          <div className="relative">
            <input
              type="url"
              name="twitch_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.twitch_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={TwitchIcon}
                alt="Twitch"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Pinterest */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pinterest
          </label>
          <div className="relative">
            <input
              type="url"
              name="pinterest_url"
              className="border border-gray-300 p-2 rounded-lg w-full pl-10"
              placeholder="Insira o URL do seu perfil"
              value={formData.pinterest_url || ""}
              onChange={handleSectionInputChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <img
                src={PinterestIcon}
                alt="Pinterest"
                className="h-5 w-5 text-gray-400"
              />
            </div>
          </div>
        </div>
      </div>
      <button
        className={`${
          isFormChanged
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        } text-white py-2 px-4 rounded-lg mt-4`}
        onClick={(e) => handleSubmit(e, "socialMedia")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </>
  );
}

function MediaKitSection({
  formData,
  handleInputChange,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    setIsFormChangedStates((prev: any) => ({ ...prev, mediaKit: true }));
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mídia Kit
        </label>
        <input
          type="url"
          name="media_kit_url"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Insira o URL do seu mídia kit"
          value={formData.media_kit_url || ""}
          onChange={handleSectionInputChange}
        />
      </div>
      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg`}
        onClick={(e) => handleSubmit(e, "mediaKit")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </>
  );
}

function BankAccountSection({
  formData,
  handleInputChange,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    setIsFormChangedStates((prev: any) => ({ ...prev, bankAccount: true }));
  };

  return (
    <>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chave Pix*
        </label>
        <input
          type="text"
          name="pix_key"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Insira sua chave Pix"
          value={formData.pix_key || ""}
          onChange={handleSectionInputChange}
        />
      </div>
      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg`}
        onClick={(e) => handleSubmit(e, "bankAccount")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </>
  );
}

function PortfolioSection({
  formData,
  setFormData,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  const handleSectionInputChange = () => {
    setIsFormChangedStates((prev: any) => ({ ...prev, portfolio: true }));
  };

  return (
    <div className="space-y-8">
      <PreviousWorksSection
        formData={formData}
        setFormData={setFormData}
        handleSectionInputChange={handleSectionInputChange}
      />
      {/* <FAQSection /> */}
      {/* <BrandsSection /> */}
      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg mt-4`}
        onClick={(e) => handleSubmit(e, "portfolio")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </div>
  );
}

function PreviousWorksSection({
  formData,
  setFormData,
  handleSectionInputChange,
}: {
  formData: any;
  setFormData: any;
  handleSectionInputChange: any;
}) {
  const [workImages, setWorkImages] = useState(
    formData.previous_work_imgs || []
  );

  const addWorkImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImage = e.target.files[0];
      const updatedImages = [...workImages, newImage];
      setWorkImages(updatedImages);
      setFormData((prev: any) => ({
        ...prev,
        previous_work_imgs: updatedImages,
      }));
      handleSectionInputChange();
    }
  };

  const removeWorkImage = (index: number) => {
    const updatedImages = workImages.filter((_: any, i: number) => i !== index);
    setWorkImages(updatedImages);
    setFormData((prev: any) => ({
      ...prev,
      previous_work_imgs: updatedImages,
    }));
    handleSectionInputChange();
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Trabalhos anteriores</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {workImages.map((file: any, index: number) => {
          let fileType = "";

          if (file instanceof File) {
            fileType = file.type;
          } else if (typeof file === "string") {
            const extension = (file ?? "").split(".").pop()?.toLowerCase();
            if (extension && ["mp4", "webm", "ogg"].includes(extension)) {
              fileType = "video";
            } else {
              fileType = "image";
            }
          }

          return (
            <div key={index} className="relative">
              {fileType.startsWith("image") || fileType === "image" ? (
                <img
                  src={
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : pb.getFileUrl(formData, file)
                  }
                  alt="Work"
                  className="w-full h-32 object-cover rounded-lg"
                />
              ) : fileType.startsWith("video") || fileType === "video" ? (
                <video
                  src={
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : pb.getFileUrl(formData, file)
                  }
                  className="w-full h-32 object-cover rounded-lg"
                  controls
                />
              ) : null}
              <button
                onClick={() => removeWorkImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          );
        })}

        <input
          type="file"
          accept="image/*,video/*"
          id="workImageUpload"
          className="hidden"
          onChange={addWorkImage}
        />
        <label
          htmlFor="workImageUpload"
          className="w-full h-32 bg-gray-100 flex items-center justify-center rounded-lg text-blue-600 cursor-pointer"
        >
          <Plus size={24} />
        </label>
      </div>
    </div>
  );
}

function PricesSection({
  formData,
  setFormData,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const digits = value.replace(/\D/g, "");
    const numberValue = parseFloat(digits);

    setFormData((prev: any) => {
      const updatedFormData = {
        ...prev,
        [name]: isNaN(numberValue) ? 0 : numberValue,
      };
      return updatedFormData;
    });
  };

  const handleSectionInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange(e);
    setIsFormChangedStates((prev: any) => ({ ...prev, prices: true }));
  };

  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quanto você cobra por um stories IGC?*
        </label>
        <input
          type="text"
          name="stories_price"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Ex: R$50,00"
          value={
            formData.stories_price
              ? formatCentsToCurrency(formData.stories_price)
              : ""
          }
          onChange={handleSectionInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quanto você cobra por um post no feed?*
        </label>
        <input
          type="text"
          name="feed_price"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Ex: R$100,00"
          value={
            formData.feed_price
              ? formatCentsToCurrency(formData.feed_price)
              : ""
          }
          onChange={handleSectionInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quanto você cobra por um reels?*
        </label>
        <input
          type="text"
          name="reels_price"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Ex: R$150,00"
          value={
            formData.reels_price
              ? formatCentsToCurrency(formData.reels_price)
              : ""
          }
          onChange={handleSectionInputChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quanto você cobra por um vídeo e um combo de fotos UGC?*
        </label>
        <input
          type="text"
          name="ugc_price"
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Ex: R$200,00"
          value={
            formData.ugc_price
              ? formatCentsToCurrency(formData.ugc_price)
              : ""
          }
          onChange={handleSectionInputChange}
        />
      </div>

      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"
        } text-white py-2 px-4 rounded-lg mt-4`}
        onClick={(e) => handleSubmit(e, "prices")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </div>
  );
}

function SkillsSection({
  formData,
  setFormData,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
}: FormProps) {
  // Função para garantir que languages é um array
  const parseLanguages = (languages: string) => {
    if (!languages) return [];
    if (typeof languages === "string") {
      try {
        const parsed = JSON.parse(languages);
        return Array.isArray(parsed) ? parsed : [languages];
      } catch (e) {
        console.log(`error parse languages: ${e}`);
        return [languages];
      }
    }
    return Array.isArray(languages) ? languages : [languages];
  };

  const [languages, setLanguages] = useState(
    parseLanguages(formData.languages)
  );
  const [languageInput, setLanguageInput] = useState("");

  useEffect(() => {
    setLanguages(parseLanguages(formData.languages));
  }, [formData.languages]);

  const handleSectionInputChange = () => {
    setIsFormChangedStates((prev: FormData) => ({ ...prev, skills: true }));
  };

  const addLanguage = () => {
    if (languageInput && !languages.includes(languageInput)) {
      const updatedLanguages = [...languages, languageInput];
      setLanguages(updatedLanguages);
      setFormData((prev: FormData) => ({
        ...prev,
        languages: JSON.stringify(updatedLanguages),
      }));
      setLanguageInput("");
      handleSectionInputChange();
    }
  };

  const removeLanguage = (index: number) => {
    const updatedLanguages = languages.filter((_, i) => i !== index);
    setLanguages(updatedLanguages);
    setFormData((prev: FormData) => ({
      ...prev,
      languages: JSON.stringify(updatedLanguages),
    }));
    handleSectionInputChange();
  };

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Idiomas
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Insira os idiomas que você domina"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />

          <button onClick={addLanguage} className="text-blue-600">
            <Plus size={20} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {languages.length > 0 ? (
            languages.map((lang, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {lang}
                <button
                  onClick={() => removeLanguage(index)}
                  className="ml-2 text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma linguagem adicionada</p>
          )}
        </div>
      </div>

      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg mt-7`}
        onClick={(e) => handleSubmit(e, "skills")}
        disabled={!isFormChanged || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
      </button>
    </div>
  );
}

function AccountInfoSection({
  formData,
  setLoadingStates,
  loading,
}: FormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Inside AccountInfoSection component
  const handlePasswordSubmit = async () => {
    // Validate fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warning("Por favor, preencha todos os campos de senha.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.warning("A nova senha e a confirmação não coincidem.");
      return;
    }

    // (Optional) Add password complexity validations
    if (newPassword.length < 8) {
      toast.info("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    try {
      setLoadingStates((prev: any) => ({ ...prev, accountInfo: true }));
      await pb.collection("Influencers").update(formData.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: confirmPassword,
      });
      toast.success(
        <div className="flex items-center gap-2">
          <span className="font-semibold">
            Senha atualizada com sucesso! Faça o login novamente.
          </span>
        </div>,
        {
          autoClose: 2500,
          position: "top-right",
        }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (error) {
      const err = error as ClientResponseError;
      console.error("Erro ao atualizar a senha:", error);

      // Check if the error is due to incorrect current password
      if (err.data && err.data.data && err.data.data.oldPassword) {
        if (
          err.data.data.oldPassword.code === "validation_invalid_old_password"
        ) {
          toast.error(
            <div className="flex flex-col items-start gap-2">
              <span className="font-semibold">Senha atual incorreta.</span>
              <p className="text-sm">Por favor, verifique e tente novamente.</p>
            </div>,
            {
              style: {
                color: "#EF4444",
                background: "#FFEBEB",
              },
              autoClose: 5000,
              position: "top-right",
            }
          );
        }
      } else {
        toast.error("Erro ao atualizar a senha. Por favor, tente novamente.", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } finally {
      setLoadingStates((prev: any) => ({ ...prev, accountInfo: false }));
    }
  };

  return (
    <div>
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Senha Atual
        </label>
        <div className="relative flex items-center">
          <input
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="no-password-eye border border-gray-300 p-2 rounded-lg w-full pr-10"
            placeholder="Digite sua senha atual"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            tabIndex={-1}
          >
            {showCurrentPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nova Senha
        </label>

        <div className="relative flex items-center">
          <input
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="no-password-eye border border-gray-300 p-2 rounded-lg w-full pr-10"
            placeholder="Digite sua nova senha"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword((prev) => !prev)}
            className="absolute inset-y-0 top-50 right-0 pr-3 flex items-center text-gray-500"
            tabIndex={-1}
          >
            {showNewPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <div className="relative mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmar Nova Senha
        </label>

        <div className="relative flex items-center">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="no-password-eye border border-gray-300 p-2 rounded-lg w-full pr-10"
            placeholder="Confirme sua nova senha"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
            tabIndex={-1}
          >
            {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <button
        type="button"
        className={`${
          currentPassword && newPassword && confirmPassword
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
        } text-white py-2 px-4 rounded-lg mt-4`}
        onClick={handlePasswordSubmit}
        disabled={
          !currentPassword || !newPassword || !confirmPassword || loading
        }
      >
        {loading ? "Alterando..." : "Alterar Senha"}
      </button>
    </div>
  );
}

// function FAQSection() {
//   const [faqItems, setFaqItems] = useState([{ question: "", answer: "" }]);

//   const addFAQ = () => {
//     if (faqItems.length < 10) {
//       setFaqItems([...faqItems, { question: "", answer: "" }]);
//     }
//   };

//   const removeFAQ = (index: number) => {
//     if (faqItems.length > 1) {
//       setFaqItems(faqItems.filter((_, i) => i !== index));
//     }
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">Perguntas Frequentes</h3>
//       <p className="text-sm text-gray-500 mb-4">
//         Você pode adicionar quantas perguntas desejar. Uma vez adicionada, a
//         pergunta e a resposta devem ser preenchidas ou removidas antes de
//         atualizar o perfil.
//       </p>
//       {faqItems.map((item, index) => (
//         <div key={index} className="space-y-2 mb-4">
//           <div className="flex items-center">
//             <input
//               type="text"
//               placeholder={`Pergunta #${index + 1}`}
//               className="border border-gray-300 rounded-lg p-2 w-full"
//               value={item.question}
//               onChange={(e) =>
//                 setFaqItems(
//                   faqItems.map((faq, i) =>
//                     i === index ? { ...faq, question: e.target.value } : faq
//                   )
//                 )
//               }
//             />
//             <button
//               onClick={() => removeFAQ(index)}
//               className="ml-2 text-red-500"
//             >
//               <X size={20} />
//             </button>
//           </div>
//           <textarea
//             placeholder={`Resposta #${index + 1}`}
//             className="border border-gray-300 rounded-lg p-2 w-full"
//             rows={3}
//             value={item.answer}
//             onChange={(e) =>
//               setFaqItems(
//                 faqItems.map((faq, i) =>
//                   i === index ? { ...faq, answer: e.target.value } : faq
//                 )
//               )
//             }
//           />
//         </div>
//       ))}
//       <button onClick={addFAQ} className="flex items-center text-blue-600 mt-4">
//         <Plus size={20} className="mr-2" /> Adicionar pergunta
//       </button>
//     </div>
//   );
// }

// function BrandsSection() {
//   const [brandLogos, setBrandLogos] = useState([
//     "https://via.placeholder.com/100",
//   ]);

//   const addBrandLogo = () => {
//     if (brandLogos.length < 10) {
//       setBrandLogos([...brandLogos, "https://via.placeholder.com/100"]);
//     }
//   };

//   const removeBrandLogo = (index: number) => {
//     setBrandLogos(brandLogos.filter((_, i) => i !== index));
//   };

//   return (
//     <div>
//       <h3 className="text-lg font-semibold mb-2">
//         Marcas que já trabalhei com
//       </h3>
//       <p className="text-sm text-gray-500 mb-4">
//         Faça upload dos logos das marcas com as quais você já trabalhou. Tamanho
//         recomendado: 500x500px.
//       </p>
//       <div className="flex flex-wrap gap-4">
//         {brandLogos.map((logo, index) => (
//           <div key={index} className="relative">
//             <img
//               src={logo}
//               alt="Brand Logo"
//               className="w-20 h-20 rounded-lg object-cover"
//             />
//             <button
//               onClick={() => removeBrandLogo(index)}
//               className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
//             >
//               <X size={16} />
//             </button>
//           </div>
//         ))}
//         <button
//           onClick={addBrandLogo}
//           className="w-20 h-20 bg-gray-100 flex items-center justify-center rounded-lg text-blue-600"
//         >
//           <Plus size={20} />
//         </button>
//       </div>
//     </div>
//   );
// }
