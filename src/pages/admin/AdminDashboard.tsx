import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Match, Team, Championship } from '../../types'
import { MatchStatus } from '../../types'
import { matchesService, teamsService, championshipsService } from '../../services/api'
import { ensureArray } from '../../hooks/useSafeArrays'
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
  const [teams, setTeams] = useState<Team[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [allMatches, setAllMatches] = useState<Match[]>([])
  const [pendingMatches, setPendingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      setLoading(true)
      const [teamsData, championshipsData, matches, upcoming] = await Promise.all([
        teamsService.getAll(),
        championshipsService.getAll(),
        matchesService.getAll(),
        matchesService.getUpcoming(),
      ])
      
      // Usando ensureArray para maior consistência
      setTeams(ensureArray(teamsData))
      setChampionships(ensureArray(championshipsData))
      setAllMatches(ensureArray(matches))
      setPendingMatches(ensureArray(upcoming))
    } catch (error) {
      console.error('Erro ao carregar dados admin:', error)
      // Em caso de erro, garantir arrays vazios
      setTeams([])
      setChampionships([])
      setAllMatches([])
      setPendingMatches([])
    } finally {
      setLoading(false)
    }
  }

  const activeChampionships = ensureArray(championships).filter(c => c.status === MatchStatus.EM_ANDAMENTO).length
  const completedMatches = ensureArray(allMatches).filter(m => m.status === MatchStatus.CONCLUIDA).length

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
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Painel Administrativo
        </h1>
        <p className="text-gray-400">
          Gerencie campeonatos, partidas e times
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Times</p>
              <p className="text-2xl font-bold text-white">{ensureArray(teams).length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Campeonatos Ativos</p>
              <p className="text-2xl font-bold text-white">{activeChampionships}</p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Partidas</p>
              <p className="text-2xl font-bold text-white">{ensureArray(allMatches).length}</p>
            </div>
            <Gamepad2 className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Partidas Pendentes</p>
              <p className="text-2xl font-bold text-white">{ensureArray(pendingMatches).length}</p>
            </div>
            <Clock className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Partidas Finalizadas</p>
              <p className="text-2xl font-bold text-white">{completedMatches}</p>
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
          {ensureArray(pendingMatches).length > 0 ? (
            <div className="space-y-4">
              {ensureArray(pendingMatches).slice(0, 5).map((match) => (
                <div key={match.id} className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-medium text-white">{match.teamA?.name ?? 'A definir'}</p>
                      <p className="text-gray-400 text-sm">vs</p>
                      <p className="font-medium text-white">{match.teamB?.name ?? 'A definir'}</p>
                    </div>
                    <div className="text-gray-400">
                      {match.location && <p className="text-sm">{match.location.name || match.location.nome}</p>}
                      <p className="text-xs">
                        {match.scheduledDate ? new Date(match.scheduledDate).toLocaleDateString('pt-BR') : 'A definir'}
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
