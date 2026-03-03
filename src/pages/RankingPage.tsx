import { useState, useEffect } from 'react'
import type { Ranking, Championship } from '../types'
import { ChampionshipType } from '../types'

export function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChampionship) {
      loadRanking(selectedChampionship)
    }
  }, [selectedChampionship])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por: 
      // const response = await fetch('/api/championships?type=PONTOS_CORRIDOS&active=true')
      // const championships = await response.json()
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
          id: '3',
          name: 'Brasileirão E-sports',
          type: ChampionshipType.PONTOS_CORRIDOS,
          teams: [],
          matches: [],
          startDate: '2024-03-01T00:00:00Z',
          endDate: '2024-11-30T00:00:00Z',
          isActive: true,
          maxTeams: 20,
          currentRound: 8
        }
      ]

      const pointsCorridos = mockChampionships.filter(c => c.type === ChampionshipType.PONTOS_CORRIDOS)
      setChampionships(pointsCorridos)
      
      if (pointsCorridos.length > 0 && !selectedChampionship) {
        setSelectedChampionship(pointsCorridos[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadRanking = async (championshipId: string) => {
    try {
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por: 
      // const response = await fetch(`/api/championships/${championshipId}/rankings`)
      // const rankings = await response.json()
      console.log('Loading ranking for championship:', championshipId)
      const mockRankings: Ranking[] = [
        {
          position: 1,
          team: {
            id: '1',
            name: 'FURIA Esports',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 12,
            losses: 3,
            points: 36,
            createdAt: '2024-01-01T00:00:00Z'
          },
          points: 36,
          wins: 12,
          losses: 3,
          draws: 0,
          goalsFor: 24,
          goalsAgainst: 8,
          goalsDifference: 16
        },
        {
          position: 2,
          team: {
            id: '4',
            name: 'Imperial Esports',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 11,
            losses: 4,
            points: 33,
            createdAt: '2024-01-01T00:00:00Z'
          },
          points: 33,
          wins: 11,
          losses: 4,
          draws: 0,
          goalsFor: 22,
          goalsAgainst: 10,
          goalsDifference: 12
        },
        {
          position: 3,
          team: {
            id: '2',
            name: 'MIBR',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 10,
            losses: 5,
            points: 30,
            createdAt: '2024-01-01T00:00:00Z'
          },
          points: 30,
          wins: 10,
          losses: 5,
          draws: 0,
          goalsFor: 20,
          goalsAgainst: 12,
          goalsDifference: 8
        },
        {
          position: 4,
          team: {
            id: '3',
            name: 'paiN Gaming',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 8,
            losses: 7,
            points: 24,
            createdAt: '2024-01-01T00:00:00Z'
          },
          points: 24,
          wins: 8,
          losses: 7,
          draws: 0,
          goalsFor: 18,
          goalsAgainst: 15,
          goalsDifference: 3
        }
      ]

      setRankings(mockRankings)
    } catch (error) {
      console.error('Erro ao carregar ranking:', error)
    }
  }

  const getPositionBadge = (position: number) => {
    if (position <= 3) {
      const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-yellow-600']
      const icons = ['🥇', '🥈', '🥉']
      return (
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${colors[position - 1]} text-white font-bold`}>
          <span className="text-xs">{icons[position - 1]}</span>
        </div>
      )
    }
    
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-dark-600 text-gray-300 font-bold">
        <span className="text-sm">{position}</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando ranking...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Ranking dos Times
          </h1>
          <p className="text-gray-400">
            Classificação dinâmica para campeonatos de Pontos Corridos
          </p>
        </div>
        
        {championships.length > 1 && (
          <select
            value={selectedChampionship}
            onChange={(e) => setSelectedChampionship(e.target.value)}
            className="mt-4 md:mt-0 bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {championships.map((championship) => (
              <option key={championship.id} value={championship.id}>
                {championship.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Championship Info */}
      {selectedChampionship && (
        <div className="esports-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {championships.find(c => c.id === selectedChampionship)?.name}
              </h2>
              <p className="text-gray-400">Pontos Corridos • Rodada {championships.find(c => c.id === selectedChampionship)?.currentRound}</p>
            </div>
            <span className="text-sm bg-green-500 text-green-900 px-3 py-1 rounded-full">
              Ativo
            </span>
          </div>
        </div>
      )}

      {/* Ranking Table */}
      <div className="esports-card overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 pb-4 border-b border-dark-600 text-sm font-medium text-gray-400">
            <div className="col-span-1 text-center">Pos</div>
            <div className="col-span-4">Time</div>
            <div className="col-span-1 text-center">Pts</div>
            <div className="col-span-1 text-center">V</div>
            <div className="col-span-1 text-center">D</div>
            <div className="col-span-1 text-center">GP</div>
            <div className="col-span-1 text-center">GC</div>
            <div className="col-span-2 text-center">SG</div>
          </div>

          {/* Ranking Items */}
          <div className="space-y-2 pt-4">
            {rankings.map((ranking) => (
              <div
                key={ranking.team.id}
                className="grid grid-cols-12 gap-4 py-3 rounded-lg hover:bg-dark-700 transition-colors duration-200 items-center"
              >
                {/* Position */}
                <div className="col-span-1 flex justify-center">
                  {getPositionBadge(ranking.position)}
                </div>

                {/* Team */}
                <div className="col-span-4 flex items-center space-x-3">
                  {ranking.team.logo && (
                    <img
                      src={ranking.team.logo}
                      alt={ranking.team.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-white">{ranking.team.name}</h3>
                  </div>
                </div>

                {/* Points */}
                <div className="col-span-1 text-center">
                  <span className="text-white font-bold text-lg">{ranking.points}</span>
                </div>

                {/* Wins */}
                <div className="col-span-1 text-center">
                  <span className="text-green-400 font-medium">{ranking.wins}</span>
                </div>

                {/* Losses */}
                <div className="col-span-1 text-center">
                  <span className="text-red-400 font-medium">{ranking.losses}</span>
                </div>

                {/* Goals For */}
                <div className="col-span-1 text-center">
                  <span className="text-gray-300">{ranking.goalsFor}</span>
                </div>

                {/* Goals Against */}
                <div className="col-span-1 text-center">
                  <span className="text-gray-300">{ranking.goalsAgainst}</span>
                </div>

                {/* Goals Difference */}
                <div className="col-span-2 text-center">
                  <span 
                    className={`font-medium ${
                      ranking.goalsDifference > 0 
                        ? 'text-green-400' 
                        : ranking.goalsDifference < 0 
                        ? 'text-red-400' 
                        : 'text-gray-300'
                    }`}
                  >
                    {ranking.goalsDifference > 0 ? '+' : ''}{ranking.goalsDifference}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center">
        <div className="esports-card max-w-sm text-center">
          <h3 className="font-medium text-white mb-3">Legenda</h3>
          <div className="space-y-2 text-gray-400">
            <div><strong className="text-white">Pts:</strong> Pontos (3 por vitória)</div>
            <div><strong className="text-white">V:</strong> Vitórias</div>
            <div><strong className="text-white">D:</strong> Derrotas</div>
          </div>
        </div>
      </div>
    </div>
  )
}