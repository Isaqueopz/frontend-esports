import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/ranking', label: 'Ranking', icon: '🏆' },
  { path: '/bracket', label: 'Bracket', icon: '🌳' },
  { path: '/results', label: 'Resultados', icon: '📊' }
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="gaming-title text-3xl">Liga dos Campeões</h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200',
                    location.pathname === item.path
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-dark-800 border-b border-dark-700">
        <div className="container mx-auto px-6 py-3">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={clsx(
                  'flex items-center space-x-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors duration-200',
                  location.pathname === item.path
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-dark-700 hover:text-white'
                )}
              >
                <span>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {children}
      </main>
    </div>
  )
}