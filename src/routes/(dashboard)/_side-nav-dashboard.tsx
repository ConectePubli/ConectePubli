import { createFileRoute } from "@tanstack/react-router";
import { Link, Outlet } from "@tanstack/react-router";
import { Folder, LayoutGrid, Users, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/(dashboard)/_side-nav-dashboard")({
  component: SideNavDashboard,
});

export function SideNavDashboard() {
  return (
    <div className="flex min-h-screen border-r-2">
      <nav className="w-64 bg-white p-4 shadow-lg">
        <ul className="space-y-4">
          <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-200">
            <Folder className="w-6 h-6" />
            <Link to="/dashboard" className="text-black font-medium">
              Minhas Participações
            </Link>
          </li>
          <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-200">
            <LayoutGrid className="w-6 h-6" />
            <Link to="/dashboard/settings" className="text-black font-medium">
              Vitrine de Campanhas
            </Link>
          </li>
          <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-200">
            <Users className="w-6 h-6" />
            <Link to="/dashboard/profile" className="text-black font-medium">
              Vitrine de Creators
            </Link>
          </li>
          <li className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 transition duration-200">
            <MessageCircle className="w-6 h-6" />
            <Link to="/dashboard/support" className="text-black font-medium">
              Suporte/Whatsapp
            </Link>
          </li>
        </ul>
      </nav>

      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
