import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { Team, Match } from '../types'
import { MatchCard } from '../components/MatchCard'
import { teamsService } from '../services/api'
import {
  Users,
  Calendar,
  BarChart3
} from 'lucide-react'

export function TeamProfilePage() {
  const { teamId } = useParams<{ teamId: string }>()
  const [team, setTeam] = useState<Team | null>(null)
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (teamId) {
      loadTeamData(Number(teamId))
    }
  }, [teamId])

  const loadTeamData = async (id: number) => {
    try {
      setLoading(true)
      const [teamData, recent, upcoming] = await Promise.all([
        teamsService.getById(id),
        teamsService.getRecentMatches(id),
        teamsService.getUpcomingMatches(id),
      ])
      setTeam(teamData)
      setRecentMatches(recent)
      setUpcomingMatches(upcoming)
    } catch (error) {
      console.error('Erro ao carregar dados do time:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando perfil do time...</p>
        </div>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-white mb-4">Time não encontrado</h2>
        <p className="text-gray-400">O time solicitado não existe ou foi removido.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="esports-card">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Team Logo */}
          <div className="flex-shrink-0">
              {team.logo ? (
              <img
                  src={team.logo}
                  alt={team.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-glow-blue"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center border-4 border-primary-500">
                <Users className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
          
          {/* Team Info */}
          <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
            <p className="text-gray-400 mb-4">
                {team.players.length} jogadores
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary-400">#{team.rankingTeam}</div>
                <div className="text-sm text-gray-400">Ranking</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{team.pontosTeam}</div>
                <div className="text-sm text-gray-400">Pontos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{recentMatches.length + upcomingMatches.length}</div>
                <div className="text-sm text-gray-400">Partidas</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Roster */}
        {team.players.length > 0 && (
        <div className="esports-card">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center mr-3">
              <Users className="w-5 h-5 text-primary-400" />
            </div>
            Elenco Atual
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.players.map((player) => (
              <div key={player.id} className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors">
                <div className="flex items-center space-x-3">
                  {player.avatar ? (
                    <img
                      src={player.avatar}
                      alt={player.nickname || player.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-dark-500 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-white">{player.nickname || player.name}</h3>
                    <p className="text-sm text-gray-400">{player.name}</p>
                    {player.steamId && (
                      <p className="text-xs text-primary-400">Steam: {player.steamId}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Matches */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-3">
            <BarChart3 className="w-5 h-5 text-blue-400" />
          </div>
          Partidas Recentes
        </h2>
        
        {recentMatches.length > 0 ? (
          <div className="space-y-3">
            {recentMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="esports-card text-center py-8">
            <p className="text-gray-400">Nenhuma partida recente encontrada.</p>
          </div>
        )}
      </div>

      {/* Upcoming Matches */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center mr-3">
            <Calendar className="w-5 h-5 text-red-400" />
          </div>
          Próximas Partidas
        </h2>
        
        {upcomingMatches.length > 0 ? (
          <div className="space-y-3">
            {upcomingMatches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <div className="esports-card text-center py-8">
            <p className="text-gray-400">Nenhuma partida agendada no momento.</p>
          </div>
        )}
      </div>
    </div>
  )
}
