import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/(perfis)/marca/$userName/editar/"
)({
  component: () => (
    <div>
      Hello /(dashboard)/_side-nav-dashboard/(perfis)/marca/$userName/editar/!
    </div>
  ),
});
