import { Button } from "@/components/ui/button";
import { ComboboxCountries } from "@/components/ui/ComboboxCountries";
import { ComboboxNiches } from "@/components/ui/ComboBoxNiches";
import { ComboboxStates } from "@/components/ui/ComboboxStates";
import CustomPhoneInput from "@/components/ui/CustomPhoneInput";
import ProfileEditDropdown from "@/components/ui/ProfileEditDropdown";
import { BrazilianStates } from "@/data/Brazillian_States";
import { countries } from "@/data/Countries";
import { getUserType } from "@/lib/auth";
import pb from "@/lib/pb";
import { Brand } from "@/types/Brand";
import { createFileRoute, redirect } from "@tanstack/react-router";
import {
  Camera,
  LoaderIcon,
  MessageCircleWarning,
  Upload,
  User,
} from "lucide-react";
import { ClientResponseError } from "pocketbase";
import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import MaskedInput from "react-text-mask";

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
import { t } from "i18next";

interface Option {
  value: string;
  label: string;
}

const socialMediaFields: Array<keyof Brand> = [
  "instagram_url",
  "facebook_url",
  "twitter_url",
  "linkedin_url",
  "youtube_url",
  "tiktok_url",
  "yourclub_url",
  "pinterest_url",
  "kwai_url",
  "twitch_url",
];

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/marca/$userName/editar/"
)({
  component: Page,
  beforeLoad: async ({ params }) => {
    if (!(await getUserType())) {
      throw redirect({
        to: "/login",
      });
    }
    const { userName } = params;
    if (userName !== pb.authStore.model?.username) {
      throw redirect({
        to: "../",
      });
    }
  },
});

function Page() {
  const [userData, setUserData] = useState<Partial<Brand> | null>(null);
  const [originalData, setOriginalData] = useState<Partial<Brand> | null>(null);
  const [niches, setNiches] = useState<Option[]>([]);
  const [isLoadingNiches, setIsLoadingNiches] = useState(true);
  const [nichesError, setNichesError] = useState<string | null>(null);
  const [savingStates, setSavingStates] = useState({
    basicData: false,
    aboutYou: false,
    address: false,
    socialMedia: false,
    bankInfo: false,
    accountInfo: false,
  });
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [selectedProfileImageFile, setSelectedProfileImageFile] =
    useState<File | null>(null);
  const [selectedCoverImageFile, setSelectedCoverImageFile] =
    useState<File | null>(null);

  const profileImageUrl = pb.authStore.model?.profile_img
    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${pb.authStore.model.collectionName}/${pb.authStore.model.id}/${pb.authStore.model.profile_img}`
    : null;
  const coverImageUrl = pb.authStore.model?.cover_img
    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${pb.authStore.model.collectionName}/${pb.authStore.model.id}/${pb.authStore.model.cover_img}`
    : null;

  const [profileImageUrlLocal, setProfileImageUrlLocal] = useState<
    string | null
  >(profileImageUrl);
  const [coverImageUrlLocal, setCoverImageUrlLocal] = useState<string | null>(
    coverImageUrl
  );

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Verificar se as seções estão completas para marcação visual
  const isUserDataComplete = userData?.bio ? true : false;
  const isAboutYouComplete = !!(
    userData?.name &&
    userData?.username &&
    userData?.company_register &&
    userData?.email &&
    userData?.cell_phone &&
    userData?.niche &&
    userData?.niche?.length > 0
  );

  const isAddressInfoComplete =
    userData?.country &&
    userData?.cep &&
    userData?.street &&
    userData?.city &&
    userData?.state
      ? true
      : false;

  const isAtLeastOneFilled = useMemo(() => {
    return socialMediaFields.some(
      (field) => userData && userData[field]?.toString().trim() !== ""
    );
  }, [userData]);

  const isSocialMediaComplete = isAtLeastOneFilled || false;
  const isBankAccountComplete = useMemo(() => {
    const hasPix = userData?.pix_key && userData.pix_key.trim() !== "";
    const hasBankData =
      userData?.account_number?.trim() &&
      userData?.agency?.trim() &&
      userData?.bank?.trim();
    return hasPix || hasBankData;
  }, [userData]);

  // show info to user fill necessary fields intented to create campaign
  const [showNotice, setShowNotice] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    if (
      searchParams.has("from") &&
      searchParams.get("from") === "CreateCampaign" &&
      searchParams.has("error") &&
      searchParams.get("error") === "MissingData"
    ) {
      setShowNotice(true);
      router.navigate({
        search: undefined,
        replace: true,
      });
    } else {
      setShowNotice(false);
    }
  }, [router]);

  useEffect(() => {
    if (pb.authStore.model) {
      setUserData(pb.authStore.model);
      setOriginalData(pb.authStore.model);
    }
  }, []);

  useEffect(() => {
    const fetchNiches = async () => {
      try {
        setIsLoadingNiches(true);
        const records = await pb.collection("niches").getFullList({
          sort: "-created",
        });

        const formattedNiches = records.map((record) => ({
          value: record.id,
          label: record.niche,
        }));

        setNiches(formattedNiches);
        setIsLoadingNiches(false);
      } catch (error) {
        console.error("Erro ao buscar nichos:", error);
        setNichesError(
          t("Falha ao carregar os nichos. Tente novamente mais tarde.")
        );
        setIsLoadingNiches(false);
      }
    };

    fetchNiches();
  }, []);

  const formatToE164 = (number: string | undefined) => {
    if (typeof number !== "string" || number.trim() === "") return "";
    const phoneNumber = parsePhoneNumber(number, "BR");
    return phoneNumber ? phoneNumber.format("E.164") : number;
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    const numericCEP = value.replace(/\D/g, "");

    setUserData((prev) => (prev ? { ...prev, cep: numericCEP } : prev));

    if (numericCEP.length === 8) {
      if (/^\d{8}$/.test(numericCEP)) {
        // Futuramente podemos add validation para CEP via API aqui
      } else {
        console.error("CEP inválido");
      }
    }
  };

  const toggleSaving = (
    section: keyof typeof savingStates,
    isLoading: boolean
  ) => {
    setSavingStates((prevState) => ({
      ...prevState,
      [section]: isLoading,
    }));
  };

  function getModifiedFields<T extends object>(
    original: Partial<T>,
    current: Partial<T>,
    fieldsToCompare: (keyof T)[]
  ): Partial<T> {
    const modified: Partial<T> = {};

    fieldsToCompare.forEach((key) => {
      const originalValue = original[key];
      const currentValue = current[key];

      if (originalValue instanceof Date && currentValue instanceof Date) {
        if (originalValue.getTime() !== currentValue.getTime()) {
          modified[key] = currentValue as T[keyof T];
        }
      } else if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
        const originalArray = originalValue as unknown[];
        const currentArray = currentValue as unknown[];
        if (
          originalArray.length !== currentArray.length ||
          !originalArray.every((item, index) => item === currentArray[index])
        ) {
          modified[key] = currentValue as T[keyof T];
        }
      } else if (originalValue !== currentValue) {
        modified[key] = currentValue as T[keyof T];
      }
    });

    return modified;
  }

  const saveBasicData = async () => {
    if (!userData || !originalData) {
      return;
    }

    try {
      toggleSaving("basicData", true);

      const modifiedFields = getModifiedFields<Brand>(originalData, userData, [
        "bio",
      ]);

      if (
        Object.keys(modifiedFields).length === 0 &&
        !selectedProfileImageFile &&
        !selectedCoverImageFile
      ) {
        alert(t("Nenhuma alteração detectada para salvar."));
        return;
      }

      const formData = new FormData();

      Object.entries(modifiedFields).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          formData.append(key, value as string);
        }
      });

      if (selectedProfileImageFile) {
        formData.append("profile_img", selectedProfileImageFile);
        setProfileImageUrlLocal(URL.createObjectURL(selectedProfileImageFile));
      }

      if (selectedCoverImageFile) {
        formData.append("cover_img", selectedCoverImageFile);
        setCoverImageUrlLocal(URL.createObjectURL(selectedCoverImageFile));
      }

      await pb.collection("brands").update(pb.authStore.model?.id, formData);

      const updatedUserData = { ...originalData, ...modifiedFields };
      setUserData(updatedUserData);
      setOriginalData(updatedUserData);

      toast.success(t("Dados pessoais salvos com sucesso!"));
    } catch (e) {
      const error = e as ClientResponseError;
      console.error("Erro ao salvar dados pessoais:", error.data);
      if (error.data.data?.cover_img?.code === "validation_file_size_limit") {
        toast.error(
          t(
            "O tamanho da capa excede o limite permitido. Por favor, tente novamente com um arquivo menor."
          )
        );
      } else if (
        error.data.data?.profile_img?.code === "validation_file_size_limit"
      ) {
        toast.error(
          t(
            "O tamanho da imagem de perfil excede o limite permitido. Por favor, tente novamente com um arquivo menor."
          )
        );
      } else {
        toast.error(t("Erro ao salvar dados pessoais. Tente novamente."));
      }
    } finally {
      toggleSaving("basicData", false);
    }
  };

  const saveAboutYou = async () => {
    if (!userData || !originalData) {
      return;
    }

    setUsernameError(null);
    setEmailError(null);

    if (!userData.username || !usernameRegex.test(userData.username)) {
      setUsernameError(
        t(
          "O username deve ser único e não pode conter espaços ou caracteres especiais. Use apenas letras, números e underscore."
        )
      );
    }

    if (!userData.email || !emailRegex.test(userData.email)) {
      setEmailError(t("Por favor, insira um e-mail válido."));
    }

    if (usernameError || emailError || !userData.username || !userData.email) {
      toast.error(t("Por favor, corrija os erros antes de salvar."));
      return;
    }

    try {
      toggleSaving("aboutYou", true);

      const modifiedFields = getModifiedFields<Brand>(originalData, userData, [
        "name",
        "username",
        "company_register",
        "email",
        "cell_phone",
        "web_site",
        "niche",
      ]);

      if (Object.keys(modifiedFields).length === 0) {
        return;
      }

      const formData = new FormData();

      Object.entries(modifiedFields).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          if (key === "niche" && Array.isArray(value)) {
            value.forEach((nicheId) => {
              formData.append("niche", nicheId);
            });
          } else if (value instanceof Date) {
            const formattedDate = value.toISOString().split("T")[0];
            formData.append(key, formattedDate);
          } else {
            if (value) {
              formData.append(key, value ? value.toString() : "");
            }
          }
        }
      });

      await pb.collection("brands").update(pb.authStore.model?.id, formData);
      await pb.collection("brands").authRefresh();

      const updatedUserData = { ...originalData, ...modifiedFields };
      setUserData(updatedUserData);
      setOriginalData(updatedUserData);

      toast.success(t("Dados 'Sobre você' salvos com sucesso!"));
    } catch (error) {
      console.error("Erro ao salvar dados da seção 'Sobre você':", error);

      const err = error as ClientResponseError;

      if (err && err.data && err.data.data && err.data.data.username) {
        const usernameError = err.data.data.username;
        console.log(usernameError);

        if (
          usernameError.code === "validation_invalid_username" ||
          usernameError.code === "validation_match_invalid"
        ) {
          toast.error(t("O nome de usuário é inválido ou já está em uso."));
        } else {
          toast.error(usernameError.message || "Erro no campo 'username'.");
        }
      } else {
        toast.error(
          t("Erro ao salvar dados da seção 'Sobre você'. Tente novamente.")
        );
      }
    } finally {
      toggleSaving("aboutYou", false);
    }
  };

  const saveAddressInfo = async () => {
    if (!userData || !originalData) {
      return;
    }

    try {
      toggleSaving("address", true);

      const modifiedFields = getModifiedFields<Brand>(originalData, userData, [
        "country",
        "cep",
        "street",
        "address_num",
        "complement",
        "neighborhood",
        "city",
        "state",
      ]);

      if (Object.keys(modifiedFields).length === 0) {
        return;
      }

      const formData = new FormData();

      // Adicionar os campos modificados ao FormData
      Object.entries(modifiedFields).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          if (value) {
            formData.append(key, value ? value.toString() : "");
          }
        }
      });

      await pb.collection("brands").update(pb.authStore.model?.id, formData);

      const updatedUserData = { ...originalData, ...modifiedFields };
      setUserData(updatedUserData);
      setOriginalData(updatedUserData);

      toast.success(t("Endereço salvo com sucesso!"));
    } catch (error) {
      console.error("Erro ao salvar dados da seção 'Endereço':", error);
      toast.error(
        t("Erro ao salvar dados da seção 'Endereço'. Tente novamente.")
      );
    } finally {
      toggleSaving("address", false);
    }
  };

  const saveSocialMedia = async () => {
    if (!userData || !originalData) {
      return;
    }

    const socialMediaFields: Array<keyof Brand> = [
      "instagram_url",
      "facebook_url",
      "twitter_url",
      "linkedin_url",
      "youtube_url",
      "tiktok_url",
      "yourclub_url",
      "pinterest_url",
      "kwai_url",
      "twitch_url",
    ];

    const isAtLeastOneFilled = socialMediaFields.some(
      (field) => userData[field]?.toString().trim() !== ""
    );

    if (!isAtLeastOneFilled) {
      toast.info(t("Por favor, preencha pelo menos uma rede social."));
      return;
    }

    try {
      toggleSaving("socialMedia", true);
      const modifiedFields = getModifiedFields<Brand>(
        originalData,
        userData,
        socialMediaFields
      );

      if (Object.keys(modifiedFields).length === 0) {
        return;
      }

      const formData = new FormData();

      Object.entries(modifiedFields).forEach(([key, value]) => {
        if (value !== undefined && key !== "id") {
          if (value !== null) {
            if (value !== undefined && value !== null && key !== "id") {
              formData.append(key, value ? value.toString() : "");
            }
          }
        }
      });

      await pb.collection("brands").update(pb.authStore.model?.id, formData);

      const updatedUserData = { ...originalData, ...modifiedFields };
      setUserData(updatedUserData);
      setOriginalData(updatedUserData);

      toast.success(t("Redes sociais salvas com sucesso!"));
    } catch (error) {
      console.error("Erro ao salvar dados da seção 'Redes sociais':", error);
      alert(
        t("Erro ao salvar dados da seção 'Redes sociais'. Tente novamente.")
      );
    } finally {
      toggleSaving("socialMedia", false);
    }
  };

  const saveBankAccount = async () => {
    if (!userData || !originalData) return;

    const hasPix = userData.pix_key?.trim();
    const hasBankData =
      userData.account_number?.trim() &&
      userData.agency?.trim() &&
      userData.bank?.trim();

    if (!hasPix && !hasBankData) {
      toast.error("Forneça a chave Pix ou todos os dados bancários.");
      return;
    }

    try {
      toggleSaving("bankInfo", true);
      const modifiedFields: Partial<Brand> = {};

      if (userData.pix_key !== originalData.pix_key) {
        modifiedFields.pix_key = userData.pix_key;
      }
      if (userData.account_number !== originalData.account_number) {
        modifiedFields.account_number = userData.account_number || "";
      }
      if (userData.agency !== originalData.agency) {
        modifiedFields.agency = userData.agency || "";
      }
      if (userData.bank !== originalData.bank) {
        modifiedFields.bank = userData.bank || "";
      }

      if (Object.keys(modifiedFields).length === 0) {
        toast.info("Nenhuma alteração detectada para salvar.");
        return;
      }

      const formData = new FormData();
      for (const key in modifiedFields) {
        formData.append(key, modifiedFields[key as keyof Brand] as string);
      }

      await pb.collection("brands").update(pb.authStore.model?.id, formData);
      setOriginalData({ ...originalData, ...modifiedFields });
      toast.success("Dados bancários salvos com sucesso!");
    } catch (err) {
      console.log("Erro ao salvar dados bancários:", err);
      toast.error("Erro ao salvar dados bancários. Tente novamente.");
    } finally {
      toggleSaving("bankInfo", false);
    }
  };

  const saveAccountInfo = async () => {
    // Validação dos campos
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast.error(t("Por favor, preencha todos os campos de senha."));
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error(t("A nova senha e a confirmação não coincidem."));
      return;
    }

    // (Opcional) Adicionar validações de complexidade de senha
    if (newPassword.length < 8) {
      toast.info(t("A nova senha deve ter pelo menos 8 caracteres."));
      return;
    }

    try {
      toggleSaving("accountInfo", true);
      await pb.collection("brands").update(pb.authStore.model?.id, {
        oldPassword: currentPassword,
        password: newPassword,
        passwordConfirm: confirmNewPassword,
      });
      toast.success(
        <div className="flex items-center gap-2">
          <User className="text-green-500 text-xl" />
          <span className="font-semibold">
            {t("Senha atualizada com sucesso! Faça o login novamente.")}
          </span>
        </div>
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (error) {
      const err = error as ClientResponseError;
      console.error("Erro ao atualizar a senha:", error);

      // Verificar se o erro é devido a senha incorreta
      if (err.data && err.data.message) {
        if (
          err.data.data.oldPassword.code === "validation_invalid_old_password"
        ) {
          toast.error(
            <div className="flex items-center gap-2">
              <MessageCircleWarning className="text-red-500 text-xl" />
              <span className="font-semibold">
                {t("Senha atual incorreta.")}
              </span>
              <p className="text-sm">
                {t("Por favor, verifique e tente novamente.")}
              </p>
            </div>
          );
        }
      } else {
        alert(t("Erro ao atualizar a senha. Por favor, tente novamente."));
      }
    } finally {
      toggleSaving("accountInfo", false);
    }
  };

  if (showNotice) {
    return (
      <div className="min-h-screen min-w-full flex flex-col justify-center items-center relative max-sm:px-4">
        <div className="absolute top-4 left-4">
          <button
            onClick={() => router.navigate({ to: "/dashboard" })}
            className="flex items-center text-blue-500"
          >
            <ArrowLeft className="mr-1" />
            {t("Voltar")}
          </button>
        </div>
        <div className="bg-white p-8 rounded shadow-md text-center rounded-md border-2 border-gray-300">
          <AlertTriangle className="text-yellow-500 mx-auto mb-4" size={48} />
          <h2 className="text-lg font-semibold mb-4">
            {t("Preencha os dados do perfil para criar sua primeira campanha")}
          </h2>
          <Button
            variant={"blue"}
            onClick={() => setShowNotice(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {t("Preencher Perfil")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-[100dvw] mb-12 space-y-4">
      {/* Dados básicos */}
      <div className="mt-1" />

      <p className="text-xs text-gray-500 px-4">
        {t(
          "* É necessário salvar as alterações de cada seção para que elas sejam aplicadas."
        )}
      </p>
      {/* 
      <div className="flex flex-row items-center gap-1 px-4">
        <CheckCircle className="h-3 w-3 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
        <p className="text-base font-semibold ">
          {" "}
          - Indica que todos os dados obrigatórios foram preenchidos, mas não
          necessariamente estão salvos.
        </p>
      </div>

      <div className="flex flex-row items-center gap-1 px-4">
        <Circle className="h-3 w-3 sm:h-5 sm:w-5 text-gray-500 flex-shrink-0" />
        <p className="text-base font-semibold ">
          {" "}
          - Indica que algum dado obrigatório ainda não foi preenchido.
        </p>
      </div> */}

      <ProfileEditDropdown
        sectionName={t("Dados básicos")}
        isComplete={isUserDataComplete}
      >
        <div className="space-y-4">
          <ProfileImageSelector
            defaultImageUrl={profileImageUrlLocal}
            onImageChange={(file) => setSelectedProfileImageFile(file)}
          />
          <p className="text-sm mt-3 font-semibold text-zinc-700">
            {t("Carregar uma nova imagem de perfil")}
          </p>

          <CoverImageSelector
            defaultCoverImageUrl={coverImageUrlLocal}
            onCoverImageChange={(file) => setSelectedCoverImageFile(file)}
          />

          {/* BIO */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-lg font-semibold">{t("Sobre nós")}</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <textarea
              className="w-full h-24 p-3 border border-gray-300 rounded-md mt-1"
              placeholder={t("Escreva uma breve descrição sobre a empresa.")}
              value={userData?.bio || ""}
              maxLength={500}
              onChange={(event) =>
                setUserData({ ...userData, bio: event.target.value })
              }
            />
          </div>

          <button
            type="button"
            className={`text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2 ${
              isUserDataComplete
                ? "hover:shadow-lg hover:bg-[#103c8f]"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={saveBasicData}
            disabled={!isUserDataComplete || savingStates.basicData}
          >
            {savingStates.basicData ? (
              <span className="flex items-center gap-2">
                <LoaderIcon className="animate-spin h-5 w-5" />
                {t("Salvando...")}
              </span>
            ) : (
              t("Salvar Alterações")
            )}
          </button>
          <p className="text-xs text-gray-500">
            {t(
              "* É necessário salvar as alterações de cada seção para que elas sejam aplicadas."
            )}
          </p>
        </div>
      </ProfileEditDropdown>

      {/* Sobre você */}
      <ProfileEditDropdown
        sectionName={t("Sobre você")}
        isComplete={isAboutYouComplete}
      >
        <div className="space-y-4 mt-4">
          {/* Nome da Empresa */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">{t("Nome da Empresa")}</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500"
              placeholder={t("Nome da empresa")}
              value={userData?.name || ""}
              maxLength={65}
              onChange={(event) =>
                setUserData({ ...userData, name: event.target.value })
              }
            />
          </div>

          {/* Username da Empresa */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">{t("Username")}</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500"
              placeholder={t("Nome da empresa")}
              value={userData?.username || ""}
              maxLength={65}
              onChange={(event) =>
                setUserData({ ...userData, username: event.target.value })
              }
            />
            {usernameError && (
              <p className="text-red-500 text-sm mt-1">{usernameError}</p>
            )}
          </div>

          {/* Data de Fundação */}
          {/* <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">Data de Abertura</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <DateInput
              selectedDate={userData?.opening_date || null}
              onDateChange={(date) =>
                setUserData({ ...userData, opening_date: date })
              }
            />
          </div> */}

          {/* Registro da Empresa */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">
                {t("Registro da Empresa (CNPJ ou CPF)")}
              </h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500"
              placeholder={t("Insira o CNPJ ou o endereço fiscal no exterior")}
              value={userData?.company_register || ""}
              onChange={(event) =>
                setUserData({
                  ...userData,
                  company_register: event.target.value,
                })
              }
            />
          </div>

          {/* Email */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">{t("Email")}</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
              placeholder={t("Email da empresa")}
              value={userData?.email || ""}
              onChange={(event) =>
                setUserData({ ...userData, email: event.target.value })
              }
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
          </div>

          {/* Whatsapp/Telefone */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">
                {t("Whatsapp/Telefone")}
              </h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <PhoneInput
              value={formatToE164(userData?.cell_phone || "")}
              onChange={(value: string | undefined) =>
                setUserData({ ...userData, cell_phone: value || "" })
              }
              defaultCountry="BR"
              inputComponent={CustomPhoneInput}
              limitMaxLength={true}
              className={`w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2  focus:ring-[#10438F] focus:border-transparent`}
            />
          </div>

          {/* Website */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">{t("Website")}</h2>
            </div>
            <input
              type="url"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
              placeholder={t("Insira a URL do website da empresa")}
              value={userData?.web_site || ""}
              onChange={(event) =>
                setUserData({ ...userData, web_site: event.target.value })
              }
            />
          </div>

          {/* Nicho */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-sm font-semibold">{t("Nicho")}</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>

            {isLoadingNiches ? (
              <div className="flex items-center justify-center w-full p-3 border rounded-md">
                <p className="text-gray-500 text-center">
                  {t("Carregando nichos...")}
                </p>
                <p className="text-xs text-gray-500">
                  {t(
                    "* É necessário salvar as alterações de cada seção para que elas sejam aplicadas."
                  )}
                </p>
              </div>
            ) : nichesError ? (
              <p className="text-red-500">{nichesError}</p>
            ) : (
              <>
                <ComboboxNiches
                  niches={niches}
                  selectedNiches={userData?.niche || []}
                  setSelectedNiches={(selected) =>
                    setUserData({ ...userData, niche: selected })
                  }
                />

                <div className="mt-2 flex flex-wrap gap-2 mb-8">
                  {userData?.niche?.map((value) => (
                    <Button
                      key={value}
                      variant="blue"
                      className="flex items-center gap-2 sm:max-w-sm"
                      onClick={() =>
                        setUserData({
                          ...userData,
                          niche: userData.niche?.filter((f) => f !== value),
                        })
                      }
                    >
                      <span className="flex-1 min-w-0 truncate">
                        {t(niches.find((f) => f.value === value)?.label || "")}
                      </span>
                      <span className="ml-1 flex-shrink-0">&times;</span>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Botão de Salvar Alterações */}
          <button
            type="button"
            className={`text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2 ${
              isAboutYouComplete
                ? "hover:shadow-lg hover:bg-[#103c8f]"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={saveAboutYou}
            disabled={!isAboutYouComplete || savingStates.aboutYou}
          >
            {savingStates.aboutYou ? (
              <span className="flex items-center gap-2">
                <LoaderIcon className="animate-spin h-5 w-5" />
                {t("Salvando...")}
              </span>
            ) : (
              t("Salvar Alterações")
            )}
          </button>
        </div>
      </ProfileEditDropdown>

      {/* Endereço */}
      <ProfileEditDropdown
        sectionName={t("Endereço")}
        isComplete={isAddressInfoComplete}
      >
        <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0">
          {/* Campo de País */}
          <div className="flex-1">
            <div>
              <div className="flex items-center mt-4">
                <h2 className="text-sm font-semibold">{t("País")}</h2>
                <p className="text-[#10438F] text-lg">*</p>
              </div>
              <ComboboxCountries
                countries={countries}
                selectedCountry={userData?.country || null}
                setSelectedCountry={(country) =>
                  setUserData({ ...userData, country })
                }
              />
            </div>
          </div>

          {/* Campo de CEP */}
          <div className="flex-1">
            <div className="flex items-center mt-4">
              <h2 className="text-sm font-semibold">"{t("CEP")}"</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <MaskedInput
              mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
              value={userData?.cep || ""}
              onChange={handleCEPChange}
              placeholder={t("Digite o CEP")}
              className="pr-10 w-full p-3 border rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500 focus-visible:ring-0 focus:ring-0 focus:border-black focus:border-2 border-gray-300"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">
              {t("Logradouro (Rua, Avenida, Alameda, etc.)")}
            </h2>
            <p className="text-[#10438F] text-lg">*</p>
          </div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Digite o nome da rua")}
            value={userData?.street || ""}
            onChange={(event) =>
              setUserData((prev) =>
                prev ? { ...prev, street: event.target.value } : prev
              )
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Número")}</h2>
          </div>
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Digite o número da residência")}
            value={userData?.address_num || ""}
            onChange={(event) => {
              const value = event.target.value;
              setUserData((prev) =>
                prev
                  ? {
                      ...prev,
                      address_num: value !== "" ? value : undefined,
                    }
                  : prev
              );
            }}
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Complemento")}</h2>
          </div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Digite o complemento (opcional)")}
            value={userData?.complement || ""}
            onChange={(event) =>
              setUserData((prev) =>
                prev ? { ...prev, complement: event.target.value } : prev
              )
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Bairro")}</h2>
          </div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Digite o nome do bairro")}
            value={userData?.neighborhood || ""}
            onChange={(event) =>
              setUserData((prev) =>
                prev ? { ...prev, neighborhood: event.target.value } : prev
              )
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Cidade")}</h2>
            <p className="text-[#10438F] text-lg">*</p>
          </div>
          <input
            type="text" // Corrigido para "text"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Digite o nome da cidade")}
            value={userData?.city || ""}
            onChange={(event) =>
              setUserData((prev) =>
                prev ? { ...prev, city: event.target.value } : prev
              )
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Estado")}</h2>
            <p className="text-[#10438F] text-lg">*</p>
          </div>
          <div className="mb-6 mt-1">
            <ComboboxStates
              states={BrazilianStates}
              selectedState={userData?.state}
              setSelectedState={(state) =>
                setUserData({ ...userData, state: state })
              }
            />
          </div>
        </div>

        <button
          type="button"
          className={`text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2 ${
            isAddressInfoComplete
              ? "hover:shadow-lg hover:bg-[#103c8f]"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={saveAddressInfo}
          disabled={!isAddressInfoComplete || savingStates.address}
        >
          {savingStates.address ? (
            <span className="flex items-center gap-2">
              <LoaderIcon className="animate-spin h-5 w-5" />
              {t("Salvando...")}
            </span>
          ) : (
            t("Salvar Alterações")
          )}
        </button>
      </ProfileEditDropdown>

      {/* Redes sociais */}
      {/* Redes sociais */}
      <ProfileEditDropdown
        sectionName={t("Redes sociais")}
        isComplete={isSocialMediaComplete}
      >
        <p className="text-sm mt-3 font-semibold text-zinc-700">
          {t(
            "Preencha pelo menos uma rede social. Embora todas sejam opcionais, é necessário que pelo menos um campo esteja preenchido."
          )}
        </p>

        {/* Instagram */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Instagram
            </label>
            <div className="relative">
              <input
                type="text"
                name="instagram_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://instagram.com/usuario")}
                value={userData?.instagram_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, instagram_url: event.target.value } : prev
                  )
                }
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
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              YouTube
            </label>
            <div className="relative">
              <input
                type="text"
                name="youtube_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://youtube.com/c/usuario")}
                value={userData?.youtube_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, youtube_url: event.target.value } : prev
                  )
                }
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
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              LinkedIn
            </label>
            <div className="relative">
              <input
                type="text"
                name="linkedin_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://linkedin.com/in/usuario")}
                value={userData?.linkedin_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, linkedin_url: event.target.value } : prev
                  )
                }
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
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              YourClub
            </label>
            <div className="relative">
              <input
                type="text"
                name="yourclub_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://yourclub.io/usuario")}
                value={userData?.yourclub_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, yourclub_url: event.target.value } : prev
                  )
                }
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
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kwai
            </label>
            <div className="relative">
              <input
                type="text"
                name="kwai_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://kwai.com/@usuario")}
                value={userData?.kwai_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, kwai_url: event.target.value } : prev
                  )
                }
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
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              TikTok
            </label>
            <div className="relative">
              <input
                type="text"
                name="tiktok_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://tiktok.com/@usuario")}
                value={userData?.tiktok_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, tiktok_url: event.target.value } : prev
                  )
                }
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
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Facebook
            </label>
            <div className="relative">
              <input
                type="text"
                name="facebook_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://facebook.com/usuario")}
                value={userData?.facebook_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, facebook_url: event.target.value } : prev
                  )
                }
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
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Twitter [X]
            </label>
            <div className="relative">
              <input
                type="text"
                name="twitter_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://twitter.com/usuario")}
                value={userData?.twitter_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, twitter_url: event.target.value } : prev
                  )
                }
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

          {/* TwitchTV */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              TwitchTV
            </label>
            <div className="relative">
              <input
                type="text"
                name="twitch_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://twitch.tv/usuario")}
                value={userData?.twitch_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, twitch_url: event.target.value } : prev
                  )
                }
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img
                  src={TwitchIcon}
                  alt="TwitchTV"
                  className="h-5 w-5 text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Pinterest */}
          <div className="mt-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pinterest
            </label>
            <div className="relative">
              <input
                type="text"
                name="pinterest_url"
                className="w-full p-3 border border-gray-300 rounded-md placeholder:text-sm pl-10"
                placeholder={t("https://pinterest.com/usuario")}
                value={userData?.pinterest_url || ""}
                onChange={(event) =>
                  setUserData((prev) =>
                    prev ? { ...prev, pinterest_url: event.target.value } : prev
                  )
                }
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

        {/* Botão Salvar */}
        <button
          type="button"
          className={`text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2 ${
            isAtLeastOneFilled
              ? "hover:shadow-lg hover:bg-[#103c8f]"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={saveSocialMedia}
          disabled={!isAtLeastOneFilled || savingStates.socialMedia}
        >
          {savingStates.socialMedia ? (
            <span className="flex items-center gap-2">
              <LoaderIcon className="animate-spin h-5 w-5" />
              {t("Salvando...")}
            </span>
          ) : (
            t("Salvar Alterações")
          )}
        </button>
      </ProfileEditDropdown>

      {/* Conta bancária */}
      <ProfileEditDropdown
        sectionName={t("Conta bancária")}
        isComplete={!!isBankAccountComplete}
      >
        <p className="text-sm mt-3 font-semibold text-zinc-700">
          {t(
            "Para facilitar o processo de reembolso, caso a campanha expire com vagas não preenchidas ou você decida interromper a campanha, forneça obrigatoriamente sua chave Pix ou seus dados bancários. Se necessário, você receberá o reembolso do valor correspondente diretamente na conta associada."
          )}
        </p>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Chave Pix")}</h2>
          </div>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Insira sua chave Pix")}
            value={userData?.pix_key || ""}
            onChange={(event) =>
              setUserData({ ...userData, pix_key: event.target.value })
            }
          />
        </div>

        <p className="text-sm mt-3 font-semibold text-zinc-700">
          {t(
            "Caso prefira, você pode fornecer os dados bancários para transferência."
          )}
        </p>

        <div className="mt-4">
          <label className="text-sm font-semibold">
            {t("Número da Conta")}
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-md mt-1"
            placeholder={t("Insira o número da conta")}
            value={userData?.account_number || ""}
            onChange={(e) =>
              setUserData((prev) => ({
                ...prev,
                account_number: e.target.value,
              }))
            }
          />
        </div>

        {/* Agência */}
        <div className="mt-4">
          <label className="text-sm font-semibold">{t("Agência")}</label>
          <input
            type="text"
            className="w-full p-3 border rounded-md mt-1"
            placeholder={t("Insira a agência")}
            value={userData?.agency || ""}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, agency: e.target.value }))
            }
          />
        </div>

        {/* Banco */}
        <div className="mt-4">
          <label className="text-sm font-semibold">{t("Banco")}</label>
          <input
            type="text"
            className="w-full p-3 border rounded-md mt-1"
            placeholder={t("Insira o nome ou código do banco")}
            value={userData?.bank || ""}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, bank: e.target.value }))
            }
          />
        </div>

        <button
          type="button"
          className={`text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2 ${
            isBankAccountComplete
              ? "hover:shadow-lg hover:bg-[#103c8f]"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={saveBankAccount}
          disabled={!isBankAccountComplete || savingStates.bankInfo}
        >
          {savingStates.bankInfo ? (
            <span className="flex items-center gap-2">
              <LoaderIcon className="animate-spin h-5 w-5" />
              {t("Salvando...")}
            </span>
          ) : (
            t("Salvar Alterações")
          )}
        </button>
      </ProfileEditDropdown>

      {/* Config conta */}
      <ProfileEditDropdown
        sectionName={t("Configurações da Conta")}
        isComplete={false}
        showProgress={false}
        isConfig={true}
      >
        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Senha Atual")}</h2>
          </div>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Digite sua senha atual")}
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">{t("Nova Senha")}</h2>
          </div>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Digite sua nova senha")}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-sm font-semibold">
              {t("Confirmar Nova Senha")}
            </h2>
          </div>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder={t("Confirme sua nova senha")}
            value={confirmNewPassword}
            onChange={(event) => setConfirmNewPassword(event.target.value)}
          />
        </div>

        <button
          type="button"
          className={`text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2 ${
            currentPassword && newPassword && confirmNewPassword
              ? "hover:shadow-lg hover:bg-[#103c8f]"
              : "opacity-50 cursor-not-allowed"
          }`}
          onClick={saveAccountInfo}
          disabled={savingStates.accountInfo}
        >
          {savingStates.accountInfo ? (
            <span className="flex items-center gap-2">
              <LoaderIcon className="animate-spin h-5 w-5" />
              {t("Alterando...")}
            </span>
          ) : (
            t("Alterar Senha")
          )}
        </button>
      </ProfileEditDropdown>
    </div>
  );
}

interface ProfileImageSelectorProps {
  defaultImageUrl: string | null;
  onImageChange: (file: File) => void;
}

const ProfileImageSelector: React.FC<ProfileImageSelectorProps> = ({
  defaultImageUrl,
  onImageChange,
}) => {
  const [image, setImage] = useState<string | null>(defaultImageUrl);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    setImage(defaultImageUrl);
  }, [defaultImageUrl]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImage(newImageUrl);
      onImageChange(file);
      setObjectUrl(newImageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return (
    <div className="relative w-24 h-24 mt-4">
      {image ? (
        <img
          src={image}
          alt="Profile"
          className="w-full h-full object-cover rounded-md cursor-pointer"
          onClick={handleImageClick}
          onError={() => setImage(null)}
        />
      ) : (
        <div
          className="w-full h-full bg-gray-200 rounded-md flex items-center justify-center text-center p-2 cursor-pointer"
          onClick={handleImageClick}
        >
          <User className="text-gray-500 text-sm" />
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-[#10438F] p-1.5 rounded-full cursor-pointer"
        onClick={handleImageClick}
      >
        <Camera className="text-white" size={18} />
      </div>
    </div>
  );
};

interface CoverImageSelectorProps {
  defaultCoverImageUrl: string | null;
  onCoverImageChange: (file: File) => void;
}

const CoverImageSelector: React.FC<CoverImageSelectorProps> = ({
  defaultCoverImageUrl,
  onCoverImageChange,
}) => {
  const [coverImage, setCoverImage] = useState<string | null>(
    defaultCoverImageUrl
  );
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newCoverImageUrl = URL.createObjectURL(file);
      setCoverImage(newCoverImageUrl);
      onCoverImageChange(file);
      setObjectUrl(newCoverImageUrl);
    }
  };

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  return (
    <div className="border rounded-b-md rounded-t-md">
      <div
        className="relative w-full h-48 bg-gray-200 cursor-pointer"
        onClick={handleImageClick}
      >
        {coverImage ? (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover rounded-t-md"
            onError={() => setCoverImage(null)} // Lida com erros de carregamento
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center">
            <span className="text-gray-500 text-sm">
              <Upload className="mx-auto mb-2" size={24} />
              {t("Escolha uma foto de fundo")}
            </span>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <div className="mt-4 px-4">
        <h2 className="text-lg font-semibold">{t("Foto de fundo")}</h2>
        <p className="text-sm text-zinc-700 mt-1">
          {t(
            "Escolha uma foto de fundo para o perfil. Tamanho recomendado: 1500 x 256 para garantir melhor qualidade. Tamanho máximo permitido: 5MB."
          )}
        </p>

        <button
          type="button"
          className="text-white mb-4 font-semibold mx-auto mt-3 text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
          onClick={handleImageClick}
        >
          <Upload className="mr-2" size={18} />
          {t("Carregar Imagem")}
        </button>
      </div>
    </div>
  );
};

export default Page;
