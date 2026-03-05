import { Link, useLocation, Outlet } from 'react-router-dom'
import { clsx } from 'clsx'
import {
  LayoutDashboard,
  Gamepad2,
  Users,
  Trophy,
  LogOut,
  ChevronLeft,
  Shield
} from 'lucide-react'

const adminNavItems = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/matches', label: 'Partidas', icon: Gamepad2 },
  { path: '/admin/teams', label: 'Times', icon: Users },
  { path: '/admin/championships', label: 'Campeonatos', icon: Trophy },
]

export function AdminLayout() {
  const location = useLocation()

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Admin</h1>
              <p className="text-xs text-primary-400">Painel de Controle</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {adminNavItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.path, item.exact)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary-500/10 text-primary-500 border-l-4 border-primary-500'
                    : 'text-gray-400 hover:text-white hover:bg-dark-700'
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-dark-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Voltar ao site</span>
          </Link>

          <button
            onClick={() => {
              // ⚠️ SPRING BOOT INTEGRATION POINT
              // Implementar logout real
              localStorage.removeItem('adminToken')
              window.location.href = '/admin/login'
            }}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
