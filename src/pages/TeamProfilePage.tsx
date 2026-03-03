import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { Team, Match } from '../types'
import { MatchStatus } from '../types'
import { MatchCard } from '../components/MatchCard'
import { formatDate } from '../utils/dateUtils.js'

export function TeamProfilePage() {
  const { teamId } = useParams<{ teamId: string }>()
  const [team, setTeam] = useState<Team | null>(null)
  const [recentMatches, setRecentMatches] = useState<Match[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (teamId) {
      loadTeamData(teamId)
    }
  }, [teamId])

  const loadTeamData = async (id: string) => {
    try {
      setLoading(true)
      
      // Mock data - Em produção, consumirá endpoint /api/teams/{id}
      console.log('Loading team data for:', id)
      const mockTeam: Team = {
        id: '1',
        name: 'FURIA Esports',
        logo: 'https://via.placeholder.com/120',
        players: [
          {
            id: '1',
            name: 'Gabriel Toledo',
            nickname: 'FalleN',
            avatar: 'https://via.placeholder.com/60',
            steamId: 'fallen_csgo'
          },
          {
            id: '2', 
            name: 'Yuri Boian',
            nickname: 'yuurih',
            avatar: 'https://via.placeholder.com/60',
            steamId: 'yuurih_furia'
          },
          {
            id: '3',
            name: 'Kaike Cerato',
            nickname: 'KSCERATO',
            avatar: 'https://via.placeholder.com/60',
            steamId: 'kscerato'
          },
          {
            id: '4',
            name: 'André Backes',
            nickname: 'drop',
            avatar: 'https://via.placeholder.com/60',
            steamId: 'drop_furia'
          },
          {
            id: '5',
            name: 'Andrei Piovezan',
            nickname: 'skullz',
            avatar: 'https://via.placeholder.com/60',
            steamId: 'skullz_csgo'
          }
        ],
        wins: 12,
        losses: 3,
        points: 36,
        createdAt: '2021-01-15T00:00:00Z'
      }

      const mockRecentMatches: Match[] = [
        {
          id: '1',
          teamA: mockTeam,
          teamB: {
            id: '2',
            name: 'MIBR',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 10,
            losses: 5,
            points: 30,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '1',
            name: 'Arena São Paulo',
            address: 'São Paulo, SP',
            capacity: 100,
            available: true
          },
          scheduledDate: '2024-02-28T19:00:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 16,
          placarTR: 12,
          championshipId: '1'
        },
        {
          id: '2',
          teamA: {
            id: '3',
            name: 'Imperial Esports',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 11,
            losses: 4,
            points: 33,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: mockTeam,
          location: {
            id: '2',
            name: 'Gaming House RJ',
            address: 'Rio de Janeiro, RJ',
            capacity: 50,
            available: true
          },
          scheduledDate: '2024-02-25T20:30:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 14,
          placarTR: 16,
          championshipId: '1'
        }
      ]

      const mockUpcomingMatches: Match[] = [
        {
          id: '3',
          teamA: mockTeam,
          teamB: {
            id: '4',
            name: 'paiN Gaming',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 8,
            losses: 7,
            points: 24,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '3',
            name: 'E-sports Arena BH',
            address: 'Belo Horizonte, MG',
            capacity: 75,
            available: true
          },
          scheduledDate: '2024-03-10T19:00:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: '1'
        }
      ]

      setTeam(mockTeam)
      setRecentMatches(mockRecentMatches)
      setUpcomingMatches(mockUpcomingMatches)
    } catch (error) {
      console.error('Erro ao carregar dados do time:', error)
    } finally {
      setLoading(false)
    }
  }

  const getWinRate = () => {
    if (!team) return 0
    const totalMatches = team.wins + team.losses
    return totalMatches > 0 ? ((team.wins / totalMatches) * 100).toFixed(1) : '0.0'
  }

  const getTeamStats = () => {
    if (!team) return { totalMatches: 0, avgScore: 0 }
    
    const totalMatches = recentMatches.length
    const totalScore = recentMatches.reduce((sum, match) => {
      const isTeamA = match.teamA.id === team.id
      const teamScore = isTeamA ? (match.placarCT || 0) : (match.placarTR || 0)
      return sum + teamScore
    }, 0)
    
    return {
      totalMatches,
      avgScore: totalMatches > 0 ? (totalScore / totalMatches).toFixed(1) : '0.0'
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

  const stats = getTeamStats()

  return (
    <div className="space-y-6">
      {/* Team Header */}
      <div className="esports-card">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          {/* Team Logo */}
          <div className="flex-shrink-0">
            <img
              src={team.logo}
              alt={team.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-primary-500 shadow-glow-blue"
            />
          </div>
          
          {/* Team Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-white mb-2">{team.name}</h1>
            <p className="text-gray-400 mb-4">
              Fundado em {formatDate(team.createdAt)} • {team.players.length} jogadores
            </p>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-400">{team.wins}</div>
                <div className="text-sm text-gray-400">Vitórias</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{team.losses}</div>
                <div className="text-sm text-gray-400">Derrotas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary-400">{team.points}</div>
                <div className="text-sm text-gray-400">Pontos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-400">{getWinRate()}%</div>
                <div className="text-sm text-gray-400">Taxa de Vitórias</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Roster */}
      <div className="esports-card">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">👥</span>
          Elenco Atual
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.players.map((player) => (
            <div key={player.id} className="bg-dark-700 rounded-lg p-4 hover:bg-dark-600 transition-colors">
              <div className="flex items-center space-x-3">
                {player.avatar && (
                  <img
                    src={player.avatar}
                    alt={player.nickname}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-white">{player.nickname}</h3>
                  <p className="text-sm text-gray-400">{player.name}</p>
                  {player.steamId && (
                    <p className="text-xs text-primary-400">@{player.steamId}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="esports-card">
          <h3 className="text-lg font-semibold text-white mb-4">Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Partidas Jogadas:</span>
              <span className="text-white font-semibold">{stats.totalMatches}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Média de Rounds:</span>
              <span className="text-white font-semibold">{stats.avgScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sequência Atual:</span>
              <span className="text-green-400 font-semibold">3 vitórias</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Melhor Sequência:</span>
              <span className="text-primary-400 font-semibold">7 vitórias</span>
            </div>
          </div>
        </div>

        <div className="esports-card">
          <h3 className="text-lg font-semibold text-white mb-4">Rankings</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Liga Principal 2024:</span>
              <span className="text-yellow-400 font-semibold">1º lugar</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Copa Elite:</span>
              <span className="text-gray-300 font-semibold">Semifinalista</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ranking Nacional:</span>
              <span className="text-primary-400 font-semibold">Top 3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Pontuação HLTV:</span>
              <span className="text-white font-semibold">1,245</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Matches */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">📊</span>
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
          <span className="mr-2">⏰</span>
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

      {/* Team Achievements */}
      <div className="esports-card">
        <h2 className="text-xl font-bold text-white mb-4 flex items-center">
          <span className="mr-2">🏆</span>
          Conquistas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🥇</div>
              <div>
                <h3 className="font-semibold text-white">Liga Principal 2023</h3>
                <p className="text-sm text-gray-400">Campeão • Dezembro 2023</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🥈</div>
              <div>
                <h3 className="font-semibold text-white">Copa Elite 2023</h3>
                <p className="text-sm text-gray-400">Vice-campeão • Novembro 2023</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">🏅</div>
              <div>
                <h3 className="font-semibold text-white">Masters Regional</h3>
                <p className="text-sm text-gray-400">3º lugar • Outubro 2023</p>
              </div>
            </div>
          </div>
          
          <div className="bg-dark-700 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⭐</div>
              <div>
                <h3 className="font-semibold text-white">Melhor Time BR</h3>
                <p className="text-sm text-gray-400">Ranking 2023 • HLTV</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}