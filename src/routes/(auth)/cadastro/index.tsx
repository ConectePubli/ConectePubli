import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import logo from "@/assets/logo.svg";

import register from "@/assets/register.webp";
import { getUserType } from "@/lib/auth";

export const Route = createFileRoute("/(auth)/cadastro/")({
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

  return (
    <div className="grid lg:grid-cols-2 overflow-hidden items-center min-h-screen">
      <div
        className="hidden lg:block w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${register})` }}
      ></div>

      <div className="w-full flex flex-col justify-start overflow-y-auto px-4 py-6 lg:p-12 mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2x">
        <Link to="/" className="mb-8 block w-fit">
          <img src={logo} alt="ConectePubli" className="h-7" />
        </Link>

        <h2 className="text-3xl font-bold mb-4">Escolha seu Registro</h2>
        <p className="text-gray-600 mb-6">
          Selecione uma das opções abaixo para continuar.
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Button
            variant="orange"
            size="lg"
            className="w-full whitespace-normal h-fit py-4"
            onClick={() => navigate({ to: "/cadastro/marca" })}
          >
            Quero me Cadastrar como uma Marca/Empresa
          </Button>
          <Button
            variant="blue"
            size="lg"
            className="w-full whitespace-normal h-fit py-4"
            onClick={() => navigate({ to: "/cadastro/creator" })}
          >
            Quero me Cadastrar como um Creator
          </Button>
        </div>
      </div>
    </div>
  );
}
