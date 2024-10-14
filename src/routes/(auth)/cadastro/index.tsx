import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

import register from "@/assets/register.svg";

export const Route = createFileRoute("/(auth)/cadastro/")({
  component: Page,
});

function Page() {
  const navigate = useNavigate();

  return (
    <div className="h-[calc(100vh-66px)] flex flex-col lg:flex-row overflow-hidden">
      <div className="hidden lg:block lg:w-[50%] overflow-hidden">
        <img
          src={register}
          alt="Cadastro"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="w-full lg:w-[50%] flex flex-col justify-center items-left p-8 bg-white overflow-hidden">
        <h2 className="text-3xl font-bold mb-4">Escolha seu Registro</h2>
        <p className="text-gray-600 mb-6">
          Selecione uma das opções abaixo para continuar.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Button
            variant="orange"
            size="lg"
            className="w-full"
            onClick={() => navigate({ to: "/cadastro/marca" })}
          >
            Quero me Cadastrar como uma Marca/Empresa
          </Button>
          <Button
            variant="blue"
            size="lg"
            className="w-full"
            onClick={() => navigate({ to: "/cadastro/influenciador" })}
          >
            Quero me Cadastrar como um Influenciador
          </Button>
        </div>
      </div>
    </div>
  );
}
