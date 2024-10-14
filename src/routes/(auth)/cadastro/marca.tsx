import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import register_marca from "@/assets/register-marca.svg";

export const Route = createFileRoute("/(auth)/cadastro/marca")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-66px)] flex lg:flex-row flex-col overflow-hidden">
      <div className="hidden lg:block lg:w-[50%] overflow-hidden">
        <img
          src={register_marca}
          alt="Edifício"
          className="w-full h-full object-cover object-bottom"
        />
      </div>

      <div className="w-full lg:w-[50%] flex flex-col items-center bg-white py-8 px-12 lg:py-7 overflow-y-auto">
        <div className="w-full min-2xl:max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Cadastro para Marcas</h2>
          <p className="text-gray-600 mb-6">
            Junte-se à ConectePubli e conecte sua marca a influenciadores que
            podem amplificar sua mensagem de forma autêntica.
          </p>

          <form className="space-y-6">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="marca"
              >
                Nome da Marca/Empresa
              </label>
              <input
                type="text"
                id="marca"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Digite o nome da sua marca ou empresa"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                E-mail de Contato
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Informe o e-mail de contato da empresa"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+55 11 96123-4567"
              />
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                id="termos"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="termos"
                className="ml-2 block text-sm text-gray-900"
              >
                Eu aceito os{" "}
                <a href="#" className="text-blue-600 underline">
                  termos de uso
                </a>{" "}
                e a{" "}
                <a href="#" className="text-blue-600 underline">
                  política de privacidade
                </a>
                .
              </label>
            </div>

            <Button variant="blue" size="lg" className="w-full">
              Pré-Cadastro Marcas
            </Button>

            <div className="text-left">
              <p className="text-sm">
                Já tem uma conta?{" "}
                <a href="/login" className="text-blue-600 underline">
                  Faça login
                </a>
                .
              </p>
              <p className="text-sm mt-1">
                É influenciador? Acesse o{" "}
                <a
                  className="text-blue-600 underline cursor-pointer"
                  onClick={() => navigate({ to: "/cadastro/influenciador" })}
                >
                  formulário de influenciadores
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
