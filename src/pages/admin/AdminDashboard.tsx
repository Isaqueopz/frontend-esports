import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { AdminStats, Match } from '../../types'
import { MatchStatus } from '../../types'
import {
  Users,
  Trophy,
  Gamepad2,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Settings
} from 'lucide-react'

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [pendingMatches, setPendingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por chamadas reais à API
      const mockStats: AdminStats = {
        totalTeams: 16,
        totalMatches: 45,
        activeChampionships: 2,
        pendingMatches: 8,
        completedMatches: 23
      }

      const mockPendingMatches: Match[] = [
        {
          id: '1',
          teamA: { id: '1', name: 'Team Alpha', players: [], wins: 0, losses: 0, points: 0, createdAt: '' },
          teamB: { id: '2', name: 'Team Beta', players: [], wins: 0, losses: 0, points: 0, createdAt: '' },
          location: { id: '1', name: 'Arena Principal', address: 'São Paulo, SP', capacity: 100, available: true },
          scheduledDate: '2026-03-10T19:00:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: '1'
        }
      ]

      setStats(mockStats)
      setPendingMatches(mockPendingMatches)
    } catch (error) {
      console.error('Erro ao carregar dados admin:', error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Nova Partida',
      description: 'Agendar nova partida',
      icon: Plus,
      href: '/admin/matches/new',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Gerenciar Partidas',
      description: 'Ver e editar partidas',
      icon: Edit,
      href: '/admin/matches',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'Gerenciar Times',
      description: 'Administrar teams',
      icon: Users,
      href: '/admin/teams',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Campeonatos',
      description: 'Criar e gerenciar',
      icon: Trophy,
      href: '/admin/championships',
      color: 'bg-yellow-500 hover:bg-yellow-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-400">
            Gerencie campeonatos, partidas e times
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Link
            to="/admin/settings"
            className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span>Configurações</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Times</p>
              <p className="text-2xl font-bold text-white">{stats?.totalTeams}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Campeonatos Ativos</p>
              <p className="text-2xl font-bold text-white">{stats?.activeChampionships}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Partidas</p>
              <p className="text-2xl font-bold text-white">{stats?.totalMatches}</p>
            </div>
            <Gamepad2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Partidas Pendentes</p>
              <p className="text-2xl font-bold text-white">{stats?.pendingMatches}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Partidas Finalizadas</p>
              <p className="text-2xl font-bold text-white">{stats?.completedMatches}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.title}
              to={action.href}
              className={`${action.color} rounded-lg p-6 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
            >
              <div className="flex items-center space-x-4">
                <Icon className="w-8 h-8" />
                <div>
                  <h3 className="font-semibold text-lg">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Pending Matches */}
      <div className="bg-dark-800 rounded-lg border border-dark-700">
        <div className="p-6 border-b border-dark-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Partidas Pendentes
            </h2>
            <Link
              to="/admin/matches"
              className="text-primary-500 hover:text-primary-400 font-medium"
            >
              Ver todas
            </Link>
          </div>
        </div>

        <div className="p-6">
          {pendingMatches.length > 0 ? (
            <div className="space-y-4">
              {pendingMatches.map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-medium text-white">{match.teamA.name}</p>
                      <p className="text-gray-400 text-sm">vs</p>
                      <p className="font-medium text-white">{match.teamB.name}</p>
                    </div>
                    <div className="text-gray-400">
                      <p className="text-sm">{match.location.name}</p>
                      <p className="text-xs">
                        {new Date(match.scheduledDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
                      Agendada
                    </span>
                    <Link
                      to={`/admin/matches/${match.id}`}
                      className="p-2 bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              Nenhuma partida pendente
            </p>
          )}
        </div>
      </div>
    </div>
  )
}