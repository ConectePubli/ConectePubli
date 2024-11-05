import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import logo from "@/assets/logo.svg";

export const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b-[1px]">
      <div className="h-[66px] flex justify-between items-center mx-auto max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl px-4">
        <Link to="/">
          <img src={logo} alt="ConectePubli" className="h-10" />
        </Link>
        <Button
          variant="orange"
          size="default"
          onClick={() => navigate({ to: "/cadastro" })}
        >
          Fazer Pré Cadastro
        </Button>
      </div>
    </header>
  );
};
