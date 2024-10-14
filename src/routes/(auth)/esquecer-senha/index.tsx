import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import passwordResetImage from "@/assets/password-reset.svg";

export const Route = createFileRoute("/(auth)/esquecer-senha/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-66px)] flex lg:flex-row flex-col overflow-hidden">
      <div className="hidden lg:block lg:w-[40%] overflow-hidden">
        <img
          src={passwordResetImage}
          alt="Redefinir Senha"
          className="w-full h-full object-cover object-center"
        />
      </div>

      <div className="w-full lg:w-[60%] flex flex-col items-center bg-white py-8 px-12 lg:py-7 overflow-y-auto">
        <div className="w-full max-w-lg">
          <h2 className="text-3xl font-bold mb-4">Redefinir Senha</h2>
          <p className="text-gray-600 mb-6">
            Digite o e-mail associado à sua conta e enviaremos um link para
            redefinir sua senha.
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
                placeholder="Digite o e-mail da conta"
              />
            </div>

            <Button variant="blue" size="lg" className="w-full">
              Enviar Link de Recuperação
            </Button>

            <div className="text-left">
              <a
                className="text-blue-600 underline text-sm cursor-pointer"
                onClick={() => navigate({ to: "/login" })}
              >
                Voltar para a página de login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
