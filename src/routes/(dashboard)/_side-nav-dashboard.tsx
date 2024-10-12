import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/_side-nav-dashboard')({
  component: SideNavDashboard,
})

import { Outlet } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

export function SideNavDashboard() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="w-64 bg-gray-800 text-white p-4">
        <ul>
          <li className="mb-2">
            <Link to="/dashboard" className="hover:text-gray-300">
              Dashboard Home
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/settings" className="hover:text-gray-300">
              Settings
            </Link>
          </li>
          <li className="mb-2">
            <Link to="/dashboard/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </li>
        </ul>
      </nav>

      {/* Content Area */}
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  )
}
