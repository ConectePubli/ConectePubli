import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import register_marca from "@/assets/register-marca.webp";
import pb from "@/lib/pb";

import { formatPhoneNumber } from "@/utils/formatPhoneNumber";
import { validateEmail } from "@/utils/validateEmail";
import { getUserType } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { ClientResponseError } from "pocketbase";

export const Route = createFileRoute("/(auth)/cadastro/marca")({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

    console.log(userType);

    if (userType === "Brands") {
      throw redirect({
        to: "/dashboard-marca",
      });
    } else if (userType === "Influencers") {
      throw redirect({
        to: "/dashboard-creator",
      });
    }
  },
});

interface Data {
  name: string;
  responsible_name: string;
  email: string;
  phone: string;
  knownFrom: string;
  knownFromDetails: string;
  password: string;
  confirmPassword: string;
}

function Page() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Data>({
    name: "",
    responsible_name: "",
    email: "",
    phone: "",
    knownFrom: "",
    knownFromDetails: "",
    password: "",
    confirmPassword: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!termsAccepted) {
        setErrorMessage("Você deve aceitar os termos e condições.");
        throw new Error("Você deve aceitar os termos e condições.");
      }

      if (!validateEmail(formData.email)) {
        setErrorMessage("O e-mail inserido não é válido.");
        throw new Error("O e-mail inserido não é válido.");
      }

      const data = {
        name: formData.name,
        responsible_name: formData.responsible_name,
        email: formData.email,
        cell_phone: formData.phone.replace(/\D/g, ""),
        known_from: formData.knownFrom,
        known_from_details: formData.knownFromDetails,
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      };

      await pb.collection("Brands").create(data);
    },
    onSuccess: () => {
      navigate({ to: "/login" });
      setErrorMessage("");
    },
    onError: (error) => {
      const err = error as ClientResponseError;
      console.error("Erro ao criar conta de marca:", JSON.stringify(err));
      if (err.data.data.email.code === "validation_invalid_email") {
        setErrorMessage("Este e-mail já está em uso ou é inválido.");
      } else {
        setErrorMessage(`Ocorreu um erro ao criar a conta. ${err.message}`);
      }
      mutation.reset();
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formattedPhone });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setErrorMessage("Você deve aceitar os termos e condições.");
      return;
    }

    if (
      (formData.knownFrom === "indAmigos" ||
        formData.knownFrom === "indUsuario" ||
        formData.knownFrom === "outra") &&
      !formData.knownFromDetails.trim()
    ) {
      setErrorMessage(
        "Por favor, especifique como você conheceu a Conecte Publi."
      );
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage("A senha precisa ter mais que 8 caracteres.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("As senhas não coincidem.");
      return;
    }

    // Validação adicional
    if (!formData.knownFrom) {
      setErrorMessage(
        "Por favor, selecione como você conheceu a Conecte Publi."
      );
      return;
    }

    mutation.mutate();
  };

  const knownFromOptions = [
    { value: "indAmigos", label: "Indicação de amigos ou colegas" },
    { value: "indUsuario", label: "Indicação de outro usuário na plataforma" },
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "kwai", label: "Kwai" },
    { value: "twitter", label: "Twitter/X" },
    { value: "yourclub", label: "YourClub" },
    { value: "emailmarketing", label: "E-mail marketing" },
    { value: "midia", label: "Mídia" },
    { value: "google", label: "Pesquisa no Google" },
    { value: "outrobuscador", label: "Pesquisa em outro buscador" },
    { value: "outra", label: "Outra" },
  ];

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
        <div
          className="hidden lg:block w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${register_marca})` }}
        ></div>

        <div className="w-full flex flex-col justify-start overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
          <Link to="/" className="mb-8 block w-fit">
            <img src={logo} alt="ConectePubli" className="h-7" />
          </Link>

          <h2 className="text-3xl font-bold mb-4">Cadastro para Marcas</h2>
          <p className="text-gray-600 mb-6">
            Junte-se à ConectePubli e conecte sua marca a creators que podem
            amplificar sua mensagem de forma autêntica.
          </p>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="brandName"
              >
                Nome da Marca/Empresa
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="brandName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o nome da sua marca ou empresa"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="responsibleName"
              >
                Nome do Responsável
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="responsibleName"
                value={formData.responsible_name}
                onChange={(e) =>
                  setFormData({ ...formData, responsible_name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Nome do responsável da marca ou empresa"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                E-mail de Contato
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                onBlur={() =>
                  setFormData((prevData) => ({
                    ...prevData,
                    email: prevData.email.toLowerCase(),
                  }))
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Informe o e-mail de contato da empresa"
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="telefone"
              >
                Número de Celular/Whatsapp
              </label>
              <input
                type="tel"
                id="telefone"
                value={formData.phone}
                onChange={handlePhoneChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="(XX) XXXXX-XXXX"
                maxLength={15}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="knownFrom"
              >
                Como você conheceu a Conecte Publi?{" "}
                <span className="text-red-500">*</span>
              </label>
              <Select
                onValueChange={(value) => {
                  setFormData({
                    ...formData,
                    knownFrom: value,
                    knownFromDetails: "",
                  });
                }}
                value={formData.knownFrom}
              >
                <SelectTrigger className="w-full border border-gray-300 rounded-md">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {knownFromOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(formData.knownFrom === "indAmigos" ||
                formData.knownFrom === "indUsuario" ||
                formData.knownFrom === "outra") && (
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Especifique:
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.knownFromDetails}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        knownFromDetails: e.target.value,
                      })
                    }
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Forneça mais detalhes"
                    required
                  />
                </div>
              )}
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-sm text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirme a Senha <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirme sua senha"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-sm text-gray-500"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="termos"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 text-customLinkBlue border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="termos"
                className="ml-2 block text-sm text-gray-900"
              >
                Eu aceito os{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/termos" })}
                >
                  termos de uso
                </a>{" "}
                e a{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/privacidade" })}
                >
                  política de privacidade
                </a>
                .
              </label>
            </div>

            {mutation.isError ||
              (errorMessage && (
                <p className="text-red-500" style={{ fontSize: "0.92rem" }}>
                  {errorMessage}
                </p>
              ))}

            <Button
              variant="blue"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Enviando..." : "Cadastro Marcas"}
            </Button>

            <div className="text-left">
              <p className="text-sm hidden">
                Já tem uma conta? (opção escondida até o pós lançamento){" "}
                <a href="/login" className="text-customLinkBlue underline">
                  Faça login
                </a>
                .
              </p>
              <p className="text-sm mt-1">
                É creator? Acesse o{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro/creator" })}
                >
                  formulário de creators
                </a>{" "}
                aqui.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
