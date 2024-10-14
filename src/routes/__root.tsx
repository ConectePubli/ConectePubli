import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="container h-[65px] w-[100%] flex">
        <header className="bg-white flex w-[100%]">
          <div className="mx-auto lg:px-0 w-[100%] flex justify-between items-center">
            <Link to="/">
              <img src={logo} alt="ConectePubli" className="h-10 max-sm:h-8" />
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-black">
                Entrar
              </Link>

              <Button
                variant="orange"
                size="default"
                onClick={() => console.log("Cadastro clicado")}
              >
                Cadastro
              </Button>
            </div>
          </div>
        </header>
      </div>

      <hr />

      <Outlet />

      <TanStackRouterDevtools />
    </>
  ),
});
