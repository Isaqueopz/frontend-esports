import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Championship, Match } from '../types'
import { ChampionshipType, MatchStatus } from '../types'
import { MatchCard } from '../components/MatchCard'
import { formatDate } from '../utils/dateUtils.js'

export function HomePage() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Mock data - Em produção, isso virá da API
      const mockChampionships: Championship[] = [
        {
          id: '1',
          name: 'Liga Principal 2024',
          type: ChampionshipType.PONTOS_CORRIDOS,
          teams: [],
          matches: [],
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-06-30T00:00:00Z',
          isActive: true,
          maxTeams: 16,
          currentRound: 5
        },
        {
          id: '2',
          name: 'Copa Elite',
          type: ChampionshipType.MATA_MATA,
          teams: [],
          matches: [],
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-03-15T00:00:00Z',
          isActive: true,
          maxTeams: 8,
          currentRound: 2
        }
      ]

      const mockUpcomingMatches: Match[] = [
        {
          id: '1',
          teamA: {
            id: '1',
            name: 'FURIA Esports',
            players: [],
            wins: 12,
            losses: 3,
            points: 36,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '2',
            name: 'MIBR',
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
          scheduledDate: '2024-03-05T19:00:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: '1'
        },
        {
          id: '2',
          teamA: {
            id: '3',
            name: 'paiN Gaming',
            players: [],
            wins: 8,
            losses: 7,
            points: 24,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '4',
            name: 'Imperial Esports',
            players: [],
            wins: 11,
            losses: 4,
            points: 33,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '2',
            name: 'Gaming House RJ',
            address: 'Rio de Janeiro, RJ',
            capacity: 50,
            available: true
          },
          scheduledDate: '2024-03-06T20:30:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: '2'
        }
      ]

      setChampionships(mockChampionships)
      setUpcomingMatches(mockUpcomingMatches)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getChampionshipTypeLabel = (type: ChampionshipType) => {
    return type === ChampionshipType.PONTOS_CORRIDOS ? 'Pontos Corridos' : 'Mata-Mata'
  }

  const getChampionshipIcon = (type: ChampionshipType) => {
    return type === ChampionshipType.PONTOS_CORRIDOS ? '📊' : '🏆'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-dark-800 to-dark-700 rounded-xl">
        <h1 className="gaming-title text-4xl md:text-6xl mb-4">Liga dos Campeões</h1>
        <p className="text-xl text-gray-300 mb-8">
          Sistema de gestão e agendamento automático de campeonatos de e-sports
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/ranking" className="esports-button">
            Ver Ranking
          </Link>
          <Link to="/bracket" className="esports-button-secondary">
            Ver Brackets
          </Link>
        </div>
      </section>

      {/* Active Championships */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">🏅</span>
          Campeonatos Ativos
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {championships.map((championship) => (
            <div key={championship.id} className="esports-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getChampionshipIcon(championship.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{championship.name}</h3>
                    <p className="text-sm text-gray-400">{getChampionshipTypeLabel(championship.type)}</p>
                  </div>
                </div>
                <span className="text-sm bg-green-500 text-green-900 px-2 py-1 rounded-full">
                  Ativo
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Início</p>
                  <p className="text-white">{formatDate(championship.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Término</p>
                  <p className="text-white">{formatDate(championship.endDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Times</p>
                  <p className="text-white">{championship.teams.length}/{championship.maxTeams}</p>
                </div>
                {championship.currentRound && (
                  <div>
                    <p className="text-gray-400">Rodada</p>
                    <p className="text-white">{championship.currentRound}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-dark-600">
                <Link 
                  to={championship.type === ChampionshipType.PONTOS_CORRIDOS ? '/ranking' : '/bracket'}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  Ver detalhes →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
          <span className="mr-2">⏰</span>
          Próximas Partidas
        </h2>
        
        {upcomingMatches.length > 0 ? (
          <div className="space-y-4">
            {upcomingMatches.map((match) => (
              <MatchCard 
                key={match.id} 
                match={match}
                onClick={() => {
                  // Navigate to match room
                }}
              />
            ))}
          </div>
        ) : (
          <div className="esports-card text-center py-12">
            <p className="text-gray-400 text-lg">Nenhuma partida agendada no momento</p>
          </div>
        )}
      </section>
    </div>
  )
}