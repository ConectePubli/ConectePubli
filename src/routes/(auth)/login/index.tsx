/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { loginWithEmailBrand, loginWithEmailInfluencer } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";

import loginImage from "@/assets/login.svg";

export const Route = createFileRoute("/(auth)/login/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  // Data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Visibility
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Navigation
  const [loginType, setLoginType] = useState<"brand" | "influencer">("brand");

  const mutation = useMutation({
    mutationFn: async () => {
      setErrorMessage("");
      try {
        if (loginType === "brand") {
          await loginWithEmailBrand(email, password);
        } else {
          await loginWithEmailInfluencer(email, password);
        }
        navigate({ to: "/home" });
      } catch (e: any) {
        console.log(`error auth: ${e}`);
        if (e.message == "Failed to authenticate.") {
          setErrorMessage("Email e/ou senha incorretos.");
        } else {
          setErrorMessage("Ocorreu um erro ao fazer login.");
        }
      }
    },
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="h-[calc(100vh-66px)] flex lg:flex-row flex-col overflow-hidden">
      <div className="hidden lg:block lg:w-[40%] overflow-hidden">
        <img
          src={loginImage}
          alt="Login Image"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="w-full lg:w-[60%] flex flex-col items-center bg-white py-8 px-12 lg:py-7 overflow-y-auto max-sm:px-5">
        <div className="w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
          <p className="text-gray-600 mb-6">
            Conecte-se à sua conta e continue construindo parcerias estratégicas
            com marcas e influenciadores.
          </p>

          <div className="flex justify-center mb-6">
            <button
              className={`px-4 py-2 text-sm font-semibold ${
                loginType === "brand"
                  ? "border-b-2 border-blue-600 text-customLinkBlue"
                  : "text-gray-600"
              }`}
              onClick={() => setLoginType("brand")}
            >
              Marca
            </button>
            <button
              className={`px-4 py-2 text-sm font-semibold ml-4 ${
                loginType === "influencer"
                  ? "border-b-2 border-blue-600 text-customLinkBlue"
                  : "text-gray-600"
              }`}
              onClick={() => setLoginType("influencer")}
            >
              Influenciador
            </button>
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
                placeholder="Informe o e-mail"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="senha"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Informe a senha"
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
                Esqueci minha senha
              </a>
            </div>

            <Button
              variant="blue"
              size="lg"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Entrando..." : "Entrar"}
            </Button>

            <div className="text-center">
              <p className="text-sm">
                Novo por aqui?{" "}
                <a
                  className="text-customLinkBlue underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro" })}
                >
                  Crie sua conta gratuitamente!
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
