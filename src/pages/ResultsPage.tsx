import { useState, useEffect } from 'react'
import type { Match, Championship } from '../types'
import { MatchStatus } from '../types'
import { MatchCard } from '../components/MatchCard'
import { formatDate } from '../utils/dateUtils.js'

interface FilterOptions {
  championship: string
  team: string
  dateRange: 'all' | 'week' | 'month' | 'season'
}

export function ResultsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [teams, setTeams] = useState<string[]>([])
  const [filters, setFilters] = useState<FilterOptions>({
    championship: 'all',
    team: 'all',
    dateRange: 'all'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadFilteredResults()
  }, [filters])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Mock data - Em produção, virá da API Spring Boot
      const mockChampionships: Championship[] = [
        {
          id: '1',
          name: 'Liga Principal 2024',
          type: 'PONTOS_CORRIDOS' as any,
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
          type: 'MATA_MATA' as any,
          teams: [],
          matches: [],
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-03-15T00:00:00Z',
          isActive: true,
          maxTeams: 8,
          currentRound: 2
        }
      ]

      const mockTeams = [
        'FURIA Esports',
        'MIBR',
        'Imperial Esports', 
        'paiN Gaming',
        'Team Liquid',
        'RED Canids',
        'Fluxo',
        '9z Team'
      ]

      setChampionships(mockChampionships)
      setTeams(mockTeams)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFilteredResults = async () => {
    try {
      // Mock data - Partidas finalizadas
      const mockMatches: Match[] = [
        {
          id: '1',
          teamA: {
            id: '1',
            name: 'FURIA Esports',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 12,
            losses: 3,
            points: 36,
            createdAt: '2024-01-01T00:00:00Z'
          },
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
            id: '2',
            name: 'Gaming House RJ',
            address: 'Rio de Janeiro, RJ',
            capacity: 50,
            available: true
          },
          scheduledDate: '2024-02-27T20:30:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 16,
          placarTR: 8,
          championshipId: '1'
        },
        {
          id: '3',
          teamA: {
            id: '5',
            name: 'Team Liquid',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 6,
            losses: 9,
            points: 18,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '6',
            name: 'RED Canids',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 5,
            losses: 10,
            points: 15,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '3',
            name: 'E-sports Arena BH',
            address: 'Belo Horizonte, MG',
            capacity: 75,
            available: true
          },
          scheduledDate: '2024-02-25T21:00:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 16,
          placarTR: 14,
          championshipId: '2'
        },
        {
          id: '4',
          teamA: {
            id: '7',
            name: 'Fluxo',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 7,
            losses: 8,
            points: 21,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '8',
            name: '9z Team',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 9,
            losses: 6,
            points: 27,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '4',
            name: 'Gaming Center RS',
            address: 'Porto Alegre, RS',
            capacity: 60,
            available: true
          },
          scheduledDate: '2024-02-24T18:00:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 12,
          placarTR: 16,
          championshipId: '1'
        }
      ]

      // Aplicar filtros básicos
      let filteredMatches = mockMatches

      if (filters.championship !== 'all') {
        filteredMatches = filteredMatches.filter(m => m.championshipId === filters.championship)
      }

      if (filters.team !== 'all') {
        filteredMatches = filteredMatches.filter(m => 
          m.teamA.name === filters.team || m.teamB.name === filters.team
        )
      }

      // Ordenar por data mais recente
      filteredMatches.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())

      setMatches(filteredMatches)
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
    }
  }

  const getWinner = (match: Match) => {
    if (!match.placarCT || !match.placarTR) return null
    return match.placarCT > match.placarTR ? match.teamA : match.teamB
  }

  const getMatchResult = (match: Match) => {
    if (!match.placarCT || !match.placarTR) return 'Sem resultado'
    
    const winner = getWinner(match)
    if (!winner) return 'Empate'
    
    return `Vitória de ${winner.name}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando resultados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          📊 Resultados das Partidas
        </h1>
        <p className="text-gray-400">
          Histórico geral de partidas com status CONCLUÍDA
        </p>
      </div>

      {/* Filters */}
      <div className="esports-card">
        <h2 className="text-lg font-semibold text-white mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Championship Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Campeonato
            </label>
            <select
              value={filters.championship}
              onChange={(e) => setFilters(prev => ({ ...prev, championship: e.target.value }))}
              className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos os campeonatos</option>
              {championships.map((championship) => (
                <option key={championship.id} value={championship.id}>
                  {championship.name}
                </option>
              ))}
            </select>
          </div>

          {/* Team Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time
            </label>
            <select
              value={filters.team}
              onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
              className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos os times</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Período
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todo período</option>
              <option value="week">Última semana</option>
              <option value="month">Último mês</option>
              <option value="season">Temporada atual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="esports-card text-center">
          <div className="text-2xl font-bold text-primary-400">{matches.length}</div>
          <div className="text-gray-400">Partidas Finalizadas</div>
        </div>
        
        <div className="esports-card text-center">
          <div className="text-2xl font-bold text-green-400">
            {championships.filter(c => c.isActive).length}
          </div>
          <div className="text-gray-400">Campeonatos Ativos</div>
        </div>
        
        <div className="esports-card text-center">
          <div className="text-2xl font-bold text-yellow-400">{teams.length}</div>
          <div className="text-gray-400">Times Participando</div>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {matches.length > 0 ? (
          matches.map((match) => (
            <div key={match.id} className="esports-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-400">
                    {formatDate(match.scheduledDate)}
                  </span>
                  <span className="text-sm bg-gray-500 text-gray-900 px-2 py-1 rounded-full">
                    {championships.find(c => c.id === match.championshipId)?.name}
                  </span>
                </div>
                <div className="text-sm text-green-400 font-medium">
                  {getMatchResult(match)}
                </div>
              </div>
              
              <MatchCard match={match} showLocation={false} />
              
              {/* Match Details */}
              <div className="mt-4 pt-4 border-t border-dark-600 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Local:</span>
                  <span className="text-white ml-2">{match.location.name}</span>
                </div>
                <div>
                  <span className="text-gray-400">Placar Final:</span>
                  <span className="text-white ml-2 font-bold">
                    {match.placarCT} x {match.placarTR}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Vencedor:</span>
                  <span className="text-primary-400 ml-2 font-medium">
                    {getWinner(match)?.name || 'Empate'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="esports-card text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Nenhum resultado encontrado
            </h3>
            <p className="text-gray-400">
              Ajuste os filtros para ver mais resultados ou aguarde as próximas partidas.
            </p>
          </div>
        )}
      </div>

      {/* Statistics */}
      {matches.length > 0 && (
        <div className="esports-card">
          <h3 className="text-lg font-semibold text-white mb-4">Estatísticas do Período</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Média de Gols por Partida</h4>
              <div className="text-2xl font-bold text-primary-400">
                {matches.length > 0 
                  ? (matches.reduce((sum, match) => sum + (match.placarCT || 0) + (match.placarTR || 0), 0) / matches.length).toFixed(1)
                  : '0.0'
                }
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-300 mb-3">Partidas por Local</h4>
              <div className="space-y-1 text-sm">
                {Array.from(new Set(matches.map(m => m.location.name))).map(location => (
                  <div key={location} className="flex justify-between">
                    <span className="text-gray-400">{location}:</span>
                    <span className="text-white">
                      {matches.filter(m => m.location.name === location).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}