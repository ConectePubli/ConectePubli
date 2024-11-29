import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/notificacoes/"
)({
  component: () => (
    <div>Hello /(dashboard)/_side-nav-dashboard/notificacoes/!</div>
  ),
});
