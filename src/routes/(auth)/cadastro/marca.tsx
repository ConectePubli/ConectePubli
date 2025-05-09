import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo.svg";
import register_marca from "@/assets/register-brands-mockup.png";
import orange_check from "@/assets/orange-check-conecte.png";

import pb from "@/lib/pb";

import { validateEmail } from "@/utils/validateEmail";
import { getUserType } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { ClientResponseError } from "pocketbase";
import { t } from "i18next";

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

  const mutation: UseMutationResult<void, ClientResponseError, void, unknown> =
    useMutation({
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
          email: formData.email,
          password: formData.password,
          passwordConfirm: formData.confirmPassword,
        };

        await pb.collection("Brands").create(data);
      },
      onSuccess: () => {
        navigate({ to: "/login", search: { recentRegister: true } });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setErrorMessage("Você deve aceitar os termos e condições.");
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

    mutation.mutate();
  };

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
        {/* Primeira coluna - com as informações de cadastro */}
        <div className="flex flex-col p-4 lg:p-12 space-y-4 lg:space-y-8">
          <Link to="/" className="mb-6 lg:mb-12 block w-fit">
            <img src={logo} alt="ConectePubli" className="h-8 lg:h-12" />
          </Link>

          <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-8">
            {t("Cadastro para Marcas")}
          </h2>

          <p className="text-lg lg:text-2xl text-gray-600 mb-4 lg:mb-8">
            {t(
              "Faça seu Cadastro, Crie sua primeira Campanha e Encontre Creators em menos de 5 Minutos!"
            )}
          </p>

          <p className="text-lg lg:text-2xl text-gray-600 mb-4 lg:mb-8">
            {t(
              "Conecte-se Rapidamente a Creators prontos para Impulsionar sua Marca!"
            )}
          </p>

          {/* Lista de características */}
          <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-0">
            <div className="flex flex-col gap-4 lg:gap-6 justify-center">
              <div className="flex items-center gap-3">
                <img
                  src={orange_check}
                  alt="Cadastro para Marcas"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <p className="text-base lg:text-xl font-semibold">
                  {t("Crie Campanhas em Minutos")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={orange_check}
                  alt="Cadastro para Marcas"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <p className="text-base lg:text-xl font-semibold">
                  {t("Acesse Creators Verificados")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={orange_check}
                  alt="Cadastro para Marcas"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <p className="text-base lg:text-xl font-semibold">
                  {t("Gerencie Tudo Em Um Só Lugar")}
                </p>
              </div>
            </div>

            {/* Imagem ao lado - visível apenas em telas grandes */}
            <img
              src={register_marca}
              alt="Cadastro para Marcas"
              className="hidden lg:block w-[45%] mx-auto"
            />
          </div>
        </div>

        <div className="w-full flex flex-col justify-start overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="brandName"
              >
                {t("Nome da Marca/Empresa")}
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
                placeholder={t("Digite o nome da sua marca ou empresa")}
                maxLength={50}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                {t("E-mail de Contato")}
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
                placeholder={t("Informe o e-mail de contato da empresa")}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                {t("Senha")} <span className="text-red-500">*</span>
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
                  placeholder={t("Digite sua senha")}
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
                {t("Confirme a Senha")} <span className="text-red-500">*</span>
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
                  placeholder={t("Confirme sua senha")}
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
                htmlFor="erms"
                className="ml-2 block text-sm text-gray-900"
              >
                {t("Eu aceito os")}{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/termos" })}
                >
                  {t("termos de uso")}
                </a>{" "}
                {t("e a")}{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/privacidade" })}
                >
                  {t("política de privacidade")}
                </a>
                .
              </label>
            </div>

            {(mutation.isError || errorMessage) && (
              <p className="text-red-500" style={{ fontSize: "0.92rem" }}>
                {errorMessage}
              </p>
            )}

            <Button
              variant="blue"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("Enviando...") : t("Cadastro Marcas")}
            </Button>

            <div className="text-left">
              <p className="text-sm hidden">
                {t(
                  "Já tem uma conta? (opção escondida até o pós lançamento) Faça login."
                ).replace("Faça login", "")}
                <a href="/login" className="text-customLinkBlue underline">
                  {t("Faça login")}
                </a>
                .
              </p>
              <p className="text-sm mt-1">
                {t("É creator? Acesse o")}{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro/creator" })}
                >
                  {t("formulário de creators")}
                </a>{" "}
                {t("aqui.")}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
