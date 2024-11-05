/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { createFileRoute, useNavigate, useMatch } from "@tanstack/react-router";
import React, { useState, useEffect, useRef } from "react";
import { CaretDown, CaretUp, Plus, X } from "phosphor-react";
import pb from "@/lib/pb";
import { UserAuth } from "@/types/UserAuth";
import { Influencer } from "@/types/Influencer";
import Spinner from "@/components/ui/Spinner";
import { Niche } from "@/types/Niche";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/influenciador/$username/editar/"
)({
  component: InfluencerEditProfilePage,
});

function InfluencerEditProfilePage() {
  const navigate = useNavigate();

  const {
    params: { username },
  } = useMatch({
    from: "/(dashboard)/_side-nav-dashboard/influenciador/$username/editar/",
  });

  const [influencer, setInfluencer] = useState<Influencer | null>(null);
  const [formData, setFormData] = useState<Influencer>();
  const [loading, setLoading] = useState(true);

  // State to manage isFormChanged and loading per section
  const [isFormChangedStates, setIsFormChangedStates] = useState<any>({
    basicData: false,
    about: false,
    address: false,
    socialMedia: false,
    mediaKit: false,
    bankAccount: false,
    portfolio: false,
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
    skills: false,
    accountInfo: false,
  });

  const [addressFieldsDisabled, setAddressFieldsDisabled] = useState(true);

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

        console.log(influencerData);
        if (influencerData.length === 0) {
          navigate({ to: `/influenciador/${username}` });
          return;
        }

        const influencerInfo = influencerData[0] as unknown as Influencer;

        if (user.model.id !== influencerInfo.id) {
          navigate({ to: `/influenciador/${username}` });
          return;
        }

        setInfluencer(influencerInfo);
        setFormData(influencerInfo);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        navigate({ to: `/influenciador/${username}` });
      }
    };

    fetchUserAndInfluencer();
  }, [username]);

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
         if (formData.niche) {
           updateData["niche"] = formData.niche; // Já é um array de IDs
         }
        } else if (section === "about") {
          updateData["name"] = formData.name;
          updateData["birth_date"] = formData.birth_date;
          updateData["email"] = formData.email;
          updateData["cell_phone"] = formData.cell_phone;
          updateData["account_type"] = formData.account_type;
          updateData["gender"] = formData.gender;
          updateData["niche"] = formData.niche;
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
          updateData["previous_work_imgs"] = formData.previous_work_imgs;
        } else if (section === "skills") {
          updateData["languages"] = formData.languages;
        }

        const data = new FormData();
        for (const key in updateData) {
          if (updateData[key] instanceof File) {
            data.append(key, updateData[key]);
          } else if (Array.isArray(updateData[key])) {
            updateData[key].forEach((item: any) => {
              data.append(key, item);
            });
          } else {
            data.append(key, updateData[key]);
          }
        }

        await pb.collection("Influencers").update(influencer!.id, data);

        setIsFormChangedStates((prev: any) => ({ ...prev, [section]: false }));
      } catch (error) {
        console.error("Error updating data:", error);
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
      <Section title="Dados básicos" initiallyOpen>
        <BasicDataSection
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isFormChanged={isFormChangedStates.basicData}
          setIsFormChangedStates={setIsFormChangedStates}
          loading={loadingStates.basicData}
          setLoadingStates={setLoadingStates}
          setFormData={setFormData}
        />
      </Section>
      <Section title="Sobre você">
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

      <Section title="Endereço">
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
      <Section title="Redes sociais">
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
      <Section title="Mídia kit">
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
      <Section title="Conta bancária">
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
      <Section title="Portfólio">
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
      <Section title="Habilidades">
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
      <Section title="Informações da Conta">
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
    </div>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
}

function Section({ title, children, initiallyOpen = false }: SectionProps) {
  const [isOpen, setIsOpen] = useState(initiallyOpen);

  return (
    <div className="bg-white rounded-lg overflow-hidden border-2">
      <div
        className="flex justify-between items-center cursor-pointer bg-gray-100 px-5 py-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-lg font-bold">{title}</h2>

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
}

function BasicDataSection({
  formData,
  handleInputChange,
  handleSubmit,
  isFormChanged,
  setIsFormChangedStates,
  loading,
  setFormData,
}: FormProps) {
  const [nicheInput, setNicheInput] = useState("");
  const [niches, setNiches] = useState(formData?.expand?.niche || []);
  const [suggestedNiches, setSuggestedNiches] = useState<Niche[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    handleInputChange(e);
    setIsFormChangedStates((prev: any) => ({ ...prev, basicData: true }));
  };

  const fetchNiches = async (query: string) => {
    if (!query) {
      setSuggestedNiches([]);
      setIsDropdownOpen(false);
      return;
    }
    try {
      const response = await pb.collection("Niches").getFullList({
        filter: `niche ~ "${query}"`,
        limit: 10,
      });
      setSuggestedNiches(response as unknown as Niche[]);
      setIsDropdownOpen(response.length > 0);
    } catch (error) {
      console.error("Erro ao buscar nichos:", error);
    }
  };

  useEffect(() => {
    if (nicheInput) {
      fetchNiches(nicheInput);
    } else {
      setSuggestedNiches([]);
      setIsDropdownOpen(false);
    }
  }, [nicheInput]);

  const addNiche = (niche: Niche) => {
    if (!niches.some((n: { id: string }) => n.id === niche.id)) {
      const updatedNiches = [...niches, niche];
      setNiches(updatedNiches);
      setFormData((prev: any) => ({
        ...prev,
        niche: updatedNiches.map((n) => n.id),
      }));
      setNicheInput("");
      setSuggestedNiches([]);
      setIsDropdownOpen(false);
      setIsFormChangedStates((prev: any) => ({ ...prev, basicData: true }));
      
      console.log("atualizou dados")
    }
  };

  const removeNiche = (index: number) => {
    const updatedNiches = niches.filter((_: any, i: number) => i !== index);
    setNiches(updatedNiches);
    setFormData((prev: any) => ({
      ...prev,
      niche: updatedNiches.map((n: { id: any }) => n.id),
    }));

    setIsFormChangedStates((prev: any) => ({ ...prev, basicData: true }));
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Foto de fundo*
          </label>
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
          <img
            src={
              formData.profile_img
                ? formData.profile_img instanceof File
                  ? URL.createObjectURL(formData.profile_img)
                  : pb.getFileUrl(formData, formData.profile_img)
                : "https://via.placeholder.com/80"
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-gray-300"
          />
          <input
            type="file"
            name="profile_img"
            className="border border-gray-300 p-2 rounded-lg mt-4"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nicho
        </label>
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            placeholder="Digite para buscar nichos"
            value={nicheInput}
            onChange={(e) => setNicheInput(e.target.value)}
            className="border border-gray-300 p-2 rounded-lg w-full"
          />

          {isDropdownOpen && suggestedNiches.length > 0 && (
            <div className="absolute bg-white border border-gray-300 rounded-lg mt-1 max-h-40 w-full overflow-y-auto shadow-lg z-10">
              {suggestedNiches.map((niche) => (
                <div
                  key={niche.id}
                  onClick={() => addNiche(niche)}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                >
                  {niche.niche}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {niches.length > 0 ? (
            niches.map((niche: Niche, index: number) => (
              <div
                key={niche.id}
                className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {niche.niche}
                <button
                  onClick={() => removeNiche(index)}
                  className="ml-2 text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhum nicho adicionado</p>
          )}
        </div>
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
  const handleSectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleInputChange(e);
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
      {/* ... Rest of the fields with similar structure ... */}
      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg`}
        onClick={(e) => handleSubmit(e, "about")}
        disabled={!isFormChanged || loading}
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
  addressFieldsDisabled,
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
            Rua*
          </label>
          <input
            type="text"
            name="street"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Rua"
            value={formData.street || ""}
            onChange={handleSectionInputChange}
            disabled={addressFieldsDisabled}
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
            disabled={addressFieldsDisabled}
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
            disabled={addressFieldsDisabled}
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
            disabled={addressFieldsDisabled}
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram
          </label>
          <input
            type="url"
            name="instagram_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.instagram_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Youtube
          </label>
          <input
            type="url"
            name="youtube_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.youtube_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TikTok
          </label>
          <input
            type="url"
            name="tiktok_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.tiktok_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pinterest
          </label>
          <input
            type="url"
            name="pinterest_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.pinterest_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kwai
          </label>
          <input
            type="url"
            name="kwai_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.kwai_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YourClub
          </label>
          <input
            type="url"
            name="yourclub_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.yourclub_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Facebook
          </label>
          <input
            type="url"
            name="facebook_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.facebook_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitter [X]
          </label>
          <input
            type="url"
            name="twitter_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.twitter_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Twitch
          </label>
          <input
            type="url"
            name="twitch_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.twitch_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LinkedIn
          </label>
          <input
            type="url"
            name="linkedin_url"
            className="border border-gray-300 p-2 rounded-lg w-full"
            placeholder="Insira o URL do seu perfil"
            value={formData.linkedin_url || ""}
            onChange={handleSectionInputChange}
          />
        </div>
      </div>
      <button
        className={`${
          isFormChanged ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg`}
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
    if (workImages.length < 8 && e.target.files && e.target.files.length > 0) {
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
        {workImages.map((image: any, index: number) => (
          <div key={index} className="relative">
            <img
              src={
                image instanceof File
                  ? URL.createObjectURL(image)
                  : pb.getFileUrl(formData, image)
              }
              alt="Work"
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              onClick={() => removeWorkImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        ))}
        <input
          type="file"
          accept="image/*"
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
  setIsFormChangedStates,
  loading,
  setLoadingStates,
}: FormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordSubmit = async (
    e: React.FormEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    try {
      await pb.collection("Influencers").update(formData.id, {
        password: newPassword,
      });
      alert("Senha atualizada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setIsFormChangedStates((prev: any) => ({
        ...prev,
        accountInfo: false,
      }));
    } catch (error) {
      console.error("Error updating password:", error);
    } finally {
      setLoadingStates((prev: any) => ({ ...prev, accountInfo: false }));
    }
  };

  const isFormChangedLocal =
    currentPassword !== "" || newPassword !== "" || confirmPassword !== "";

  return (
    <div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Senha Atual
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Digite sua senha atual"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nova Senha
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Digite sua nova senha"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmar Nova Senha
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded-lg w-full"
          placeholder="Confirme sua nova senha"
        />
      </div>

      <button
        className={`${
          isFormChangedLocal ? "bg-blue-600" : "bg-gray-400"
        } text-white py-2 px-4 rounded-lg mt-4`}
        onClick={handlePasswordSubmit}
        disabled={!isFormChangedLocal || loading}
      >
        {loading ? "Salvando..." : "Salvar Alterações"}
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
