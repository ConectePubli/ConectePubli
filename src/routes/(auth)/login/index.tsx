/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";

import logo from "@/assets/logo.svg";
import loginImage from "@/assets/login.webp";

import pb from "@/lib/pb";
import { getUserType } from "@/lib/auth";
import { t } from "i18next";

export const Route = createFileRoute("/(auth)/login/")({
  component: Page,
  beforeLoad: async () => {
    const userType = await getUserType();

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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginType, setLoginType] = useState<"brand" | "influencer">("brand");

  const mutation = useMutation({
    mutationFn: async () => {
      const collection = loginType === "brand" ? "Brands" : "Influencers";
      await pb
        .collection(collection)
        .authWithPassword(email.toLowerCase(), password);
    },
    onSuccess: () => {
      navigate({ to: "/dashboard" });
    },
    onError: (error: any) => {
      if (error.message === "Failed to authenticate.") {
        setErrorMessage(t("Email e/ou senha incorretos."));
      } else {
        setErrorMessage(error.message || "Ocorreu um erro ao fazer login.");
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    mutation.mutate();
  };

  return (
    <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
      <div
        className="hidden lg:block w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${loginImage})` }}
      ></div>

      <div className="w-full flex flex-col items-center overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
        <div className="w-full">
          <Link to="/" className="mb-8 block w-fit">
            <img src={logo} alt="ConectePubli" className="h-7" />
          </Link>

          <h2 className="text-3xl font-bold mb-4">
            {t("Bem-vindo de volta!")}
          </h2>
          <p className="text-gray-600 mb-6">
            {t(
              "Conecte-se à sua conta e continue construindo parcerias estratégicas com marcas e creators."
            )}
          </p>

          <div className="mb-6">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-semibold ${
                  loginType === "brand"
                    ? "border-b-2 border-blue-600 text-customLinkBlue"
                    : "text-gray-600"
                }`}
                onClick={() => setLoginType("brand")}
              >
                {t("Marca")}
              </button>
              <button
                className={`px-4 py-2 text-sm font-semibold ml-4 ${
                  loginType === "influencer"
                    ? "border-b-2 border-blue-600 text-customLinkBlue"
                    : "text-gray-600"
                }`}
                onClick={() => setLoginType("influencer")}
              >
                {t("Creator")}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              {t(
                "Lembrete: Certifique-se de selecionar a opção correta ao acessar sua conta. Se você se cadastrou como "
              )}
              <strong>{t("Marca")}</strong>
              {t(" ou ")}
              <strong>Creator</strong>
              {t(", escolha a opção correspondente.")}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={t("Informe o e-mail")}
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="senha"
              >
                {t("Senha")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder={t("Informe a senha")}
                />
                <span
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </span>
              </div>
            </div>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}

            <div className="text-right">
              <a
                className="text-customLinkBlue underline text-sm cursor-pointer"
                onClick={() => navigate({ to: "/esquecer-senha" })}
              >
                {t("Esqueci minha senha")}
              </a>
            </div>

            <Button
              variant="blue"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? t("Entrando...")
                : t(
                    `Entrar como ${loginType === "brand" ? "Marca" : "Creator"}`
                  )}
            </Button>

            <div className="text-center">
              <p className="text-sm">
                {t("Novo por aqui?")}{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro" })}
                >
                  {t("Crie sua conta gratuitamente!")}
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
