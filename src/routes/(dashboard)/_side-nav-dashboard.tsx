import { createFileRoute } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";
import { Folder, LayoutGrid, Users, MessageCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheetStore } from "@/store/useDashSheetStore";
import pb from "@/lib/pb";

export const Route = createFileRoute("/(dashboard)/_side-nav-dashboard")({
  component: SideNavDashboard,
});

export function SideNavDashboard() {
  const isBrand = pb.authStore.model?.collectionName === "Brands";

  return (
    <div className="flex h-[calc(100vh-66px)]">
      {/* Desktop Sidebar */}
      <nav className="md:w-64 hidden md:block bg-white border-r border-gray-200 fixed h-full">
        <ul className="space-y-4 p-4">
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link
                to={`${`/${pb.authStore.model?.collectionName === "Brands" ? "dashboard-marca" : "dashboard-influenciador"}`}`}
                className="flex items-center gap-2"
              >
                <Folder className="w-6 h-6" /> Minhas{" "}
                {pb.authStore.model?.collectionName === "Brands"
                  ? "Campanhas"
                  : "Participações"}
              </Link>
            </Button>
          </li>
          {/* Conditionally render Vitrine de Campanhas for non-brand users */}
          {!isBrand && (
            <li>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link
                  to="/vitrine-de-campanhas"
                  className="flex items-center gap-2"
                >
                  <LayoutGrid className="w-6 h-6" />
                  Vitrine de Campanhas
                </Link>
              </Button>
            </li>
          )}

          {/* Conditionally render "Criar Campanha" for brands */}
          {isBrand && (
            <li>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link
                  to="/dashboard-marca/criar-campanha"
                  className="flex items-center gap-2"
                >
                  <Plus className="w-6 h-6" />
                  Criar Campanha
                </Link>
              </Button>
            </li>
          )}

          {/* WhatsApp Support Link */}
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <a
                href="https://api.whatsapp.com/send?phone=5511913185849"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle className="w-6 h-6" />
                Suporte/Whatsapp
              </a>
            </Button>
          </li>
        </ul>
      </nav>
      {/* Main Content */}
      <main className="md:ml-64 w-full">
        <Outlet />
      </main>
      <Sheet /> {/* Mobile Sidebar */}
    </div>
  );
}

const Sheet = () => {
  const { isOpen, closeSheet } = useSheetStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Background overlay */}
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={closeSheet}
      ></div>

      {/* Drawer content */}
      <div className="relative z-50 w-64 bg-white p-4 shadow-lg transform transition-transform duration-300">
        <button className="mb-4 text-right" onClick={closeSheet}>
          Close
        </button>
        <ul className="space-y-4">
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link
                to={`${`/${pb.authStore.model?.collectionName === "Brands" ? "dashboard-marca" : "dashboard-influenciador"}`}`}
                className="flex items-center gap-2"
              >
                <Folder className="w-6 h-6" />
                Minhas{" "}
                {pb.authStore.model?.collectionName === "Brands"
                  ? "Campanhas"
                  : "Participações"}
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-2"
              >
                <LayoutGrid className="w-6 h-6" />
                Vitrine de Campanhas
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/profile" className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Vitrine de Creators
              </Link>
            </Button>
          </li>
          <li>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link to="/dashboard/support" className="flex items-center gap-2">
                <MessageCircle className="w-6 h-6" />
                Suporte/Whatsapp
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
};
