import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import loginImage from "@/assets/login.svg";

export const Route = createFileRoute("/(auth)/login/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-66px)] flex lg:flex-row flex-col overflow-hidden">
      <div className="hidden lg:block lg:w-[40%] overflow-hidden">
        <img
          src={loginImage}
          alt="Login Image"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="w-full lg:w-[60%] flex flex-col items-center bg-white py-8 px-12 lg:py-7 overflow-y-auto">
        <div className="w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Bem-vindo de volta!</h2>
          <p className="text-gray-600 mb-6">
            Conecte-se à sua conta e continue construindo parcerias estratégicas
            com marcas e influenciadores.
          </p>

          <form className="space-y-6">
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
                  type="password"
                  id="senha"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Informe a senha"
                />
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                  👁️
                </span>
              </div>
            </div>

            <div className="text-right">
              <a
                className="text-blue-600 underline text-sm cursor-pointer"
                onClick={() => navigate({ to: "/esquecer-senha" })}
              >
                Esqueci minha senha
              </a>
            </div>

            <Button variant="blue" size="lg" className="w-full">
              Entrar
            </Button>

            <div className="text-center">
              <p className="text-sm">
                Novo por aqui?{" "}
                <a
                  className="text-blue-600 underline cursor-pointer"
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
