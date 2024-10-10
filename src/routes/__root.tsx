import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.svg";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="container">
        <header className="bg-white py-4">
          <div className="mx-auto lg:px-0 flex justify-between items-center">
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

      <main className="container">
        <div className="mx-auto px-4 lg:px-0">
          <Outlet />
        </div>
      </main>

      <TanStackRouterDevtools />
    </>
  ),
});
