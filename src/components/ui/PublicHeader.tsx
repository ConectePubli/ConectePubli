import { Link } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

import logo from "@/assets/logo.svg";

export const PublicHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white h-[65px] flex justify-between items-center px-4">
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
    </header>
  );
};
