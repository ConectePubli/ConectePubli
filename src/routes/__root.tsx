import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="p-2 flex justify-between gap-2">
        <Link to="/">ConectePubli</Link>

        <Link to="/pre-cadastro" className="[&.active]:font-bold">
          Pré-cadastro
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
