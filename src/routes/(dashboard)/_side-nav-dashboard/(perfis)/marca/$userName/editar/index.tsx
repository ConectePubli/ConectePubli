import { Button } from "@/components/ui/button";
import { ComboboxCountries } from "@/components/ui/ComboboxCountries";
import { ComboboxNiches } from "@/components/ui/ComboBoxNiches";
import { ComboboxStates } from "@/components/ui/ComboboxStates";
import CustomPhoneInput from "@/components/ui/CustomPhoneInput";
import DateInput from "@/components/ui/DateInput";
import ProfileEditDropdown from "@/components/ui/ProfileEditDropdown";
import StateSelector from "@/components/ui/StateSelector";
import pb from "@/lib/pb";
import { createFileRoute } from "@tanstack/react-router";
import { Camera, Upload, User } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import MaskedInput from "react-text-mask";

interface Option {
  value: string;
  label: string;
}

const brazilianStates = [
  { name: "Acre", abbr: "AC" },
  { name: "Alagoas", abbr: "AL" },
  { name: "Amapá", abbr: "AP" },
  { name: "Amazonas", abbr: "AM" },
  { name: "Bahia", abbr: "BA" },
  { name: "Ceará", abbr: "CE" },
  { name: "Distrito Federal", abbr: "DF" },
  { name: "Espírito Santo", abbr: "ES" },
  { name: "Goiás", abbr: "GO" },
  { name: "Maranhão", abbr: "MA" },
  { name: "Mato Grosso", abbr: "MT" },
  { name: "Mato Grosso do Sul", abbr: "MS" },
  { name: "Minas Gerais", abbr: "MG" },
  { name: "Pará", abbr: "PA" },
  { name: "Paraíba", abbr: "PB" },
  { name: "Paraná", abbr: "PR" },
  { name: "Pernambuco", abbr: "PE" },
  { name: "Piauí", abbr: "PI" },
  { name: "Rio de Janeiro", abbr: "RJ" },
  { name: "Rio Grande do Norte", abbr: "RN" },
  { name: "Rio Grande do Sul", abbr: "RS" },
  { name: "Rondônia", abbr: "RO" },
  { name: "Roraima", abbr: "RR" },
  { name: "Santa Catarina", abbr: "SC" },
  { name: "São Paulo", abbr: "SP" },
  { name: "Sergipe", abbr: "SE" },
  { name: "Tocantins", abbr: "TO" },
];

const countries = [
  { name: "Brasil", abbr: "BR" },
  { name: "Estados Unidos", abbr: "US" },
  { name: "Canadá", abbr: "CA" },
  { name: "Argentina", abbr: "AR" },
  { name: "México", abbr: "MX" },
  // TODO: ADD TODOS PAÍSES
];

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/marca/$userName/editar/"
)({
  component: Page,
});

// Componente Page
function Page() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [niches, setNiches] = useState<Option[]>([]);
  const [isLoadingNiches, setIsLoadingNiches] = useState(true);
  const [nichesError, setNichesError] = useState<string | null>(null);
  const [cepValue, setCepValue] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const handleCEPChange = (e: { target: { value: any } }) => {
    const value = e.target.value;
    setCepValue(value);

    // Validate CEP when fully entered
    if (value.length === 9) {
      // Remove the hyphen for validation or API requests
      const numericCEP = value.replace("-", "");

      // Example validation: Check if all characters are digits
      if (/^\d{8}$/.test(numericCEP)) {
        // Valid CEP - proceed with API call or other actions
        console.log("Valid CEP:", numericCEP);
      } else {
        // Invalid CEP - show an error message or handle accordingly
        console.error("Invalid CEP");
      }
    }
  };

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

        // Set selected niches after niches are loaded
        if (pb.authStore.model?.niche) {
          setSelectedNiches(pb.authStore.model.niche);
        }
      } catch (error) {
        console.error("Erro ao buscar nichos:", error);
        setNichesError(
          "Falha ao carregar os nichos. Tente novamente mais tarde."
        );
        setIsLoadingNiches(false);
      }
    };

    fetchNiches();
  }, []);

  const [selectedProfileImageFile, setSelectedProfileImageFile] =
    useState<File | null>(null);
  const [selectedCoverImageFile, setSelectedCoverImageFile] =
    useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedNiches, setSelectedNiches] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState<string | null>(
    pb.authStore.model?.state || null
  );

  const isPersonalInfoComplete =
    personalInfo.name !== "" && personalInfo.email !== "";

  const profileImageUrl = pb.authStore.model?.profile_img
    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${pb.authStore.model.collectionName}/${pb.authStore.model.id}/${pb.authStore.model.profile_img}`
    : null;

  const coverImageUrl = pb.authStore.model?.cover_img
    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${pb.authStore.model.collectionName}/${pb.authStore.model.id}/${pb.authStore.model.cover_img}`
    : null;

  return (
    <div className="flex flex-col max-w-[100dvw] mb-12 space-y-4">
      {/* Dados básicos */}
      <div className="mt-1" />
      <ProfileEditDropdown
        sectionName="Dados básicos"
        isComplete={isPersonalInfoComplete}
      >
        <div className="space-y-4">
          <ProfileImageSelector
            defaultImageUrl={profileImageUrl}
            onImageChange={(file) => setSelectedProfileImageFile(file)}
          />
          <p className="text-sm mt-3 font-semibold text-zinc-700">
            Carregar uma nova imagem de perfil
          </p>

          <CoverImageSelector
            defaultCoverImageUrl={coverImageUrl}
            onCoverImageChange={(file) => setSelectedCoverImageFile(file)}
          />

          {/* BIO */}
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-lg font-semibold">Bio</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <textarea
              className="w-full h-24 p-3 border border-gray-300 rounded-md mt-1"
              placeholder="Escreva uma breve descrição sobre a empresa."
            />
          </div>

          <button
            type="button"
            className="text-white mb-4 font-semibold mt-3 text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
            onClick={() => {
              alert("Salvando alterações...");
            }}
          >
            Salvar Alterações
          </button>
        </div>
      </ProfileEditDropdown>

      {/* Sobre você */}
      <ProfileEditDropdown sectionName="Sobre você" isComplete={false}>
        <div className="space-y-4 mt-4">
          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-base font-semibold">Nome da Empresa</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500"
              placeholder="Nome da empresa"
              value={personalInfo.name}
              onChange={(event) =>
                setPersonalInfo({ ...personalInfo, name: event.target.value })
              }
            />
          </div>

          <DateInput
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />

          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-base font-semibold">Registro da empresa</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500"
              placeholder="Insira o CNPJ ou o endereço fiscal no exterior"
              value={personalInfo.email}
              onChange={(event) =>
                setPersonalInfo({ ...personalInfo, email: event.target.value })
              }
            />
          </div>

          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-base font-semibold">Email</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
              placeholder="Email da empresa"
              value={personalInfo.email}
              onChange={(event) =>
                setPersonalInfo({ ...personalInfo, email: event.target.value })
              }
            />
          </div>

          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-base font-semibold">Whatsapp/Telefone</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <PhoneInput
              value={personalInfo.phone}
              onChange={(value: string | undefined) =>
                setPersonalInfo({ ...personalInfo, phone: value || "" })
              }
              defaultCountry="BR"
              inputComponent={CustomPhoneInput}
              className={`w-full p-3 border border-gray-300 rounded-md mt-1 focus:outline-none focus:ring-2  focus:ring-[#10438F] focus:border-transparent`}
            />
          </div>

          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-base font-semibold">Website</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <input
              type="email"
              className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
              placeholder="Insira a URL do website da empresa"
              value={personalInfo.email}
              onChange={(event) =>
                setPersonalInfo({ ...personalInfo, email: event.target.value })
              }
            />
          </div>

          <div>
            <div className="flex flex-row items-center">
              <h2 className="text-base font-semibold">Nicho</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>

            {isLoadingNiches ? (
              <div className="flex items-center justify-center w-full p-3 border rounded-md">
                <p className="text-gray-500 text-center">
                  Carregando nichos...
                </p>
              </div>
            ) : nichesError ? (
              <p className="text-red-500">{nichesError}</p>
            ) : (
              <>
                <ComboboxNiches
                  niches={niches}
                  selectedNiches={selectedNiches}
                  setSelectedNiches={setSelectedNiches}
                />

                <div className="mt-2 flex flex-wrap gap-2 mb-8 ">
                  {selectedNiches.map((value) => (
                    <Button
                      key={value}
                      variant="blue"
                      className="flex items-center gap-2sm:max-w-sm"
                      onClick={() =>
                        setSelectedNiches(
                          selectedNiches.filter((v) => v !== value)
                        )
                      }
                    >
                      <span className="flex-1 min-w-0 truncate">
                        {niches.find((f) => f.value === value)?.label}
                      </span>
                      <span className="ml-1 flex-shrink-0">&times;</span>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            type="button"
            className="text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
            onClick={() => {
              alert("Salvando alterações...");
            }}
          >
            Salvar Alterações
          </button>
        </div>
      </ProfileEditDropdown>

      {/* Endereço */}
      <ProfileEditDropdown sectionName="Endereço" isComplete={false}>
        <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0">
          {/* Campo de País */}
          <div className="flex-1">
            <div>
              <div className="flex items-center mt-4">
                <h2 className="text-base font-semibold">País</h2>
                <p className="text-[#10438F] text-lg">*</p>
              </div>
              <ComboboxCountries
                countries={countries}
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
              />
            </div>
          </div>

          {/* Campo de CEP */}
          <div className="flex-1">
            <div className="flex items-center mt-4">
              <h2 className="text-base font-semibold">CEP</h2>
              <p className="text-[#10438F] text-lg">*</p>
            </div>
            <MaskedInput
              mask={[/\d/, /\d/, /\d/, /\d/, /\d/, "-", /\d/, /\d/, /\d/]}
              value={cepValue}
              onChange={handleCEPChange}
              placeholder="Digite o CEP"
              className="pr-10 w-full p-3 border rounded-md mt-1 placeholder:text-sm placeholder:text-gray-500 focus-visible:ring-0 focus:ring-0 focus:border-black focus:border-2 border-gray-300"
            />
          </div>
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Rua</h2>
            <p className="text-[#10438F] text-lg">*</p>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Digite o nome da rua"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Número</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Digite o número da residência"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Complemento</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Digite o complemento (opcional)"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Bairro</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Digite o nome do bairro"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Cidade</h2>
            <p className="text-[#10438F] text-lg">*</p>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Digite o nome da cidade"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Estado</h2>
            <p className="text-[#10438F] text-lg">*</p>
          </div>
          <div className="mb-6 mt-1">
            <ComboboxStates
              states={brazilianStates}
              selectedState={selectedState}
              setSelectedState={setSelectedState}
            />
          </div>
        </div>

        <button
          type="button"
          className="text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
          onClick={() => {
            alert("Salvando alterações...");
          }}
        >
          Salvar Alterações
        </button>
      </ProfileEditDropdown>

      {/* Redes sociais */}
      <ProfileEditDropdown sectionName="Redes sociais" isComplete={false}>
        <p className="text-sm mt-3 font-semibold text-zinc-700">
          Preencha pelo menos uma rede social. Embora todas sejam opcionais, é
          necessário que pelo menos um campo esteja preenchido.
        </p>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Instagram</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://instagram.com/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Facebook</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://facebook.com/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Twitter [X]</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://twitter.com/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">LinkedIn</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://linkedin.com/in/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Youtube</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://youtube.com/c/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">TikTok</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://tiktok.com/@usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">YourClub</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://pinterest.com/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Pinterest</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://pinterest.com/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Kwai</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://kwai.com/@usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">TwitchTV</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="https://twitch.tv/usuario"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <button
          type="button"
          className="text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
          onClick={() => {
            alert("Salvando alterações...");
          }}
        >
          Salvar Alterações
        </button>
      </ProfileEditDropdown>

      {/* Conta bancária */}
      <ProfileEditDropdown sectionName="Conta bancária" isComplete={false}>
        <p className="text-sm mt-3 font-semibold text-zinc-700">
          Para facilitar o processo de reembolso, caso a campanha expire com
          vagas não preenchidas ou você decida interromper a campanha, forneça
          sua chave Pix. Se necessário, você receberá o reembolso do valor
          correspondente diretamente na conta associada à sua chave Pix.
        </p>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Chave Pix</h2>
            <p className="text-[#10438F] text-lg">*</p>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Insira sua chave Pix"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>
      </ProfileEditDropdown>

      {/* Senha */}
      <ProfileEditDropdown
        sectionName="Informações da Conta"
        isComplete={false}
      >
        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Senha Atual</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Digite sua senha atual"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Nova Senha</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Digite sua nova senha"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <div>
          <div className="flex flex-row items-center mt-4">
            <h2 className="text-base font-semibold">Confirmar Nova Senha</h2>
          </div>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md mt-1 placeholder:text-sm"
            placeholder="Confirme sua nova senha"
            value={personalInfo.email}
            onChange={(event) =>
              setPersonalInfo({ ...personalInfo, email: event.target.value })
            }
          />
        </div>

        <button
          type="button"
          className="text-white mb-4 font-semibold text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
          onClick={() => {
            alert("Salvando alterações...");
          }}
        >
          Salvar Alterações
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
              Escolha uma foto de fundo
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
        <h2 className="text-lg font-semibold">Foto de fundo</h2>
        <p className="text-sm text-zinc-700 mt-1">
          Escolha uma foto de fundo para o perfil. Tamanho recomendado: 1500 x
          600 para garantir melhor qualidade.
        </p>

        <button
          type="button"
          className="text-white mb-4 font-semibold mx-auto mt-3 text-md flex items-center gap-2 bg-[#10438F] px-4 py-2 rounded-md shadow-md hover:shadow-lg hover:bg-[#103c8f] transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-[#10438F] focus:ring-offset-2"
          onClick={handleImageClick}
        >
          <Upload className="mr-2" size={18} />
          Carregar Imagem
        </button>
      </div>
    </div>
  );
};

export default Page;
