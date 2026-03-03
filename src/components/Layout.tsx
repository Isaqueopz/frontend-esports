import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { 
  Home, 
  Trophy, 
  Brackets, 
  BarChart3, 
  Zap,
  Gamepad2
} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/ranking', label: 'Ranking', icon: Trophy },
  { path: '/bracket', label: 'Bracket', icon: Brackets },
  { path: '/results', label: 'Resultados', icon: BarChart3 }
]

export function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Header */}
      <header className="bg-dark-800/80 backdrop-blur-lg border-b border-dark-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg opacity-30 blur-lg group-hover:blur-xl transition-all duration-300"></div>
              </div>
              <div>
                <h1 className="gaming-title text-2xl md:text-3xl bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  Liga dos Campeões
                </h1>
                <p className="text-xs text-primary-400 font-medium">E-SPORTS CHAMPIONSHIP</p>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'group relative flex items-center space-x-3 px-5 py-3 rounded-xl transition-all duration-300 overflow-hidden',
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
                        : 'text-gray-300 hover:bg-dark-700/80 hover:text-white hover:shadow-lg'
                    )}
                  >
                    <div className={clsx(
                      'relative z-10 transition-transform duration-300',
                      isActive ? 'scale-110' : 'group-hover:scale-110'
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="relative z-10 font-medium">{item.label}</span>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-primary-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full"></div>
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Gaming-style LED indicator */}
            <div className="hidden md:flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-150"></div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-300"></div>
              </div>
              <span className="text-xs text-green-400 font-mono">ONLINE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-dark-800/90 backdrop-blur-lg border-b border-dark-700/50 sticky top-[73px] z-40">
        <div className="container mx-auto px-6 py-3">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'group relative flex flex-col items-center space-y-1 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 min-w-[80px]',
                    isActive
                      ? 'bg-gradient-to-b from-primary-600 to-primary-700 text-white shadow-lg'
                      : 'text-gray-300 hover:bg-dark-700/80 hover:text-white'
                  )}
                >
                  <div className={clsx(
                    'transition-transform duration-300',
                    isActive ? 'scale-110' : 'group-hover:scale-110'
                  )}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                  
                  {isActive && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-white rounded-full"></div>
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-2 h-2 bg-primary-500/30 rounded-full animate-ping"></div>
          <div className="absolute top-32 right-20 w-1 h-1 bg-primary-400/40 rounded-full animate-pulse"></div>
          <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-primary-600/20 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 right-10 w-1 h-1 bg-primary-300/30 rounded-full animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-6 py-8 relative z-10">
          {children}
        </div>
      </main>
    </div>
  )
}