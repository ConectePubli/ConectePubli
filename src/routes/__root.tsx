import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { isAuthenticatedBrands, isAuthenticatedInfluencer } from "@/lib/auth";
import { PrivateHeader } from "@/components/ui/PrivateHeader";
import { PublicHeader } from "@/components/ui/PublicHeader";

function RootComponent() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      const isBrandAuth = await isAuthenticatedBrands();
      const isInfluencerAuth = await isAuthenticatedInfluencer();

      if (isBrandAuth) {
        setIsAuthenticated(true);
      } else if (isInfluencerAuth) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  return (
    <>
      {isAuthenticated ? <PrivateHeader /> : <PublicHeader />}

      <hr />

      <Outlet />

      {window.location.hostname !== "conectepubli.com.br" && (
        <TanStackRouterDevtools />
      )}
    </>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
