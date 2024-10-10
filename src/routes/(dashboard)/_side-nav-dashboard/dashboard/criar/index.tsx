import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/_side-nav-dashboard/dashboard/criar/"
)({
  component: () => <div>Hello /_side-nav-dashboard/dashboard/criar/!</div>,
});
