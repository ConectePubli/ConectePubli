import { useState } from "react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";
import register_creators from "@/assets/register-creators-mockup.png";
import pb from "@/lib/pb";
import { validateEmail } from "@/utils/validateEmail";
import { getUserType } from "@/lib/auth";
import { ClientResponseError } from "pocketbase";
import { Eye, EyeOff } from "lucide-react";
import { t } from "i18next";
import orange_check from "@/assets/orange-check-conecte.png";

export const Route = createFileRoute("/(auth)/cadastro/creator")({
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

function Page() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
        setErrorMessage(t("Você deve aceitar os termos e condições."));
        throw new Error("Você deve aceitar os termos e condições.");
      }

      if (!validateEmail(formData.email)) {
        setErrorMessage(t("O e-mail inserido não é válido."));
        throw new Error("O e-mail inserido não é válido.");
      }

      const data = {
        name: formData.name,
        email: formData.email,
        cell_phone: formData.phone.replace(/\D/g, ""),
        password: formData.password,
        passwordConfirm: formData.confirmPassword,
      };

      await pb.collection("Influencers").create(data);
    },
    onSuccess: () => {
      navigate({ to: "/login", search: { recentRegister: true } });
      setErrorMessage("");
    },
    onError: (error) => {
      const err = error as ClientResponseError;
      console.error("Erro ao criar conta de marca:", JSON.stringify(err));
      if (err.data.data.email.code === "validation_invalid_email") {
        setErrorMessage(t("Este e-mail já está em uso ou é inválido."));
      } else {
        setErrorMessage(t(`Ocorreu um erro ao criar a conta. ${err.message}`));
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      setErrorMessage(t("Você deve aceitar os termos e condições."));
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage(t("O e-mail inserido não é válido."));
      return;
    }

    if (formData.password.length < 8) {
      setErrorMessage(t("A senha precisa ter mais que 8 caracteres."));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage(t("As senhas não coincidem."));
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
        <div className="flex flex-col p-4 lg:p-12 space-y-4 lg:space-y-8">
          <Link to="/" className="mb-6 lg:mb-12 block w-fit">
            <img src={logo} alt="ConectePubli" className="h-8 lg:h-12" />
          </Link>

          <h2 className="text-3xl lg:text-5xl font-bold mb-4 lg:mb-8">
            {t("Cadastro para Creators")}
          </h2>

          <p className="text-lg lg:text-2xl text-gray-600 mb-4 lg:mb-8">
            {t(
              "Ganhe dinheiro criando conteúdos autênticos, sem precisar ser famoso!"
            )}
          </p>

          <p className="text-lg lg:text-2xl text-gray-600 mb-4 lg:mb-8">
            {t(
              "Cadastre-se agora e descubra campanhas reais para gerar sua renda extra. Comece em menos de 2 minutos!"
            )}
          </p>

          {/* Lista de características */}
          <div className="flex flex-col lg:flex-row justify-center gap-6 lg:gap-0">
            {/* Imagem ao lado - visível apenas em telas grandes */}
            <img
              src={register_creators}
              alt="Cadastro para Creators"
              className="hidden lg:block w-[20%] mr-12"
            />

            <div className="flex flex-col gap-4 lg:gap-6 justify-center">
              <div className="flex items-center gap-3">
                <img
                  src={orange_check}
                  alt="Cadastro para Creator"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <p className="text-base lg:text-xl font-semibold">
                  {t("Receba produtos de marcas reais")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={orange_check}
                  alt="Cadastro para Creator"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <p className="text-base lg:text-xl font-semibold">
                  {t("Crie conteúdos simples e seja pago")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={orange_check}
                  alt="Cadastro para Creator"
                  className="h-6 w-6 lg:h-8 lg:w-8"
                />
                <p className="text-base lg:text-xl font-semibold">
                  {t("Ganhe dinheiro sem precisar postar nas suas redes")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col justify-start overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="influencerName"
              >
                {t("Nome Completo")}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="influencerName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("Digite o seu nome completo")}
                maxLength={50}
                required
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="influencerEmail"
              >
                {t("E-mail de Contato")}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="influencerEmail"
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
                placeholder={t("Informe o e-mail de contato")}
                required
              />
            </div>

            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="creatorPassword"
              >
                {t("Senha")} <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="creatorPassword"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("Digite sua senha")}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500" // Ajuste a posição conforme necessário
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Campo de Confirmar Senha */}
            <div className="relative">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="creatorConfirmPassword"
              >
                {t("Confirme a Senha")} <span className="text-red-500">*</span>
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="creatorConfirmPassword"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                className="mt-1 block w-full pr-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("Confirme sua senha")}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-8 text-gray-500" // Ajuste a posição conforme necessário
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword ? "Ocultar senha" : "Mostrar senha"
                }
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="influencerTerms"
                checked={termsAccepted}
                onChange={() => setTermsAccepted(!termsAccepted)}
                className="h-4 w-4 text-customLinkBlue border-gray-300 rounded focus:ring-blue-500"
                required
              />
              <label
                htmlFor="influencerTerms"
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
              variant="orange"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? t("Enviando...") : t("Cadastro Creators")}
            </Button>

            <div className="text-left">
              <p className="text-sm hidden">
                {t("Já tem uma conta? (opção escondida até o pós lançamento)")}{" "}
                <a href="/login" className="text-customLinkBlue underline">
                  {t("Faça login")}
                </a>
                .
              </p>
              <p className="text-sm mt-1">
                {t("É uma marca? Acesse o")}{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro/marca" })}
                >
                  {t("formulário de cadastro para marcas")}
                </a>{" "}
                {t("aqui.")}
              </p>

              <p className="text-sm mt-2">
                {t("Já tem uma conta? ")}{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/login" })}
                >
                  {t("Faça login")}
                </a>{" "}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Page;
