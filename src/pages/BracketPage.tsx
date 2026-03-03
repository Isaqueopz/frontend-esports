import { useState, useEffect } from 'react'
import type { Championship, Match, BracketNode } from '../types'
import { ChampionshipType, MatchStatus } from '../types'
import { MatchCard } from '../components/MatchCard'

export function BracketPage() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<string>('')
  const [bracketData, setBracketData] = useState<BracketNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChampionship) {
      loadBracket(selectedChampionship)
    }
  }, [selectedChampionship])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por: 
      // const response = await fetch('/api/championships?type=MATA_MATA')
      // const championships = await response.json()
      const mockChampionships: Championship[] = [
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
        },
        {
          id: '4',
          name: 'Torneio dos Campeões',
          type: ChampionshipType.MATA_MATA,
          teams: [],
          matches: [],
          startDate: '2024-04-01T00:00:00Z',
          endDate: '2024-05-15T00:00:00Z',
          isActive: false,
          maxTeams: 16,
          currentRound: 4
        }
      ]

      const mataMata = mockChampionships.filter(c => c.type === ChampionshipType.MATA_MATA)
      setChampionships(mataMata)
      
      if (mataMata.length > 0 && !selectedChampionship) {
        setSelectedChampionship(mataMata[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBracket = async (championshipId: string) => {
    try {
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por: 
      // const response = await fetch(`/api/championships/${championshipId}/bracket`)
      // const bracket = await response.json()
      const mockMatches: Match[] = [
        // Quartas de Final
        {
          id: 'qf1',
          teamA: {
            id: '1',
            name: 'FURIA Esports',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 2,
            losses: 0,
            points: 6,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '8',
            name: 'Team Liquid',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 1,
            losses: 1,
            points: 3,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '1',
            name: 'Arena São Paulo',
            address: 'São Paulo, SP',
            capacity: 100,
            available: true
          },
          scheduledDate: '2024-03-01T19:00:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 16,
          placarTR: 12,
          championshipId: championshipId,
          round: 1
        },
        {
          id: 'qf2',
          teamA: {
            id: '2',
            name: 'MIBR',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 1,
            losses: 1,
            points: 3,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '7',
            name: 'RED Canids',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 0,
            losses: 2,
            points: 0,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '2',
            name: 'Gaming House RJ',
            address: 'Rio de Janeiro, RJ',
            capacity: 50,
            available: true
          },
          scheduledDate: '2024-03-01T20:00:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 16,
          placarTR: 8,
          championshipId: championshipId,
          round: 1
        },
        {
          id: 'qf3',
          teamA: {
            id: '3',
            name: 'paiN Gaming',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 1,
            losses: 1,
            points: 3,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '6',
            name: 'Fluxo',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 1,
            losses: 1,
            points: 3,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '3',
            name: 'E-sports Arena BH',
            address: 'Belo Horizonte, MG',
            capacity: 75,
            available: true
          },
          scheduledDate: '2024-03-02T19:00:00Z',
          status: MatchStatus.EM_ANDAMENTO,
          placarCT: 12,
          placarTR: 10,
          championshipId: championshipId,
          round: 1
        },
        {
          id: 'qf4',
          teamA: {
            id: '4',
            name: 'Imperial Esports',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 2,
            losses: 0,
            points: 6,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '5',
            name: '9z Team',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 1,
            losses: 1,
            points: 3,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '4',
            name: 'Gaming Center RS',
            address: 'Porto Alegre, RS',
            capacity: 60,
            available: true
          },
          scheduledDate: '2024-03-02T20:00:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: championshipId,
          round: 1
        },
        // Semifinais
        {
          id: 'sf1',
          teamA: {
            id: '1',
            name: 'FURIA Esports',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 3,
            losses: 0,
            points: 9,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '2',
            name: 'MIBR',
            logo: 'https://via.placeholder.com/40',
            players: [],
            wins: 2,
            losses: 1,
            points: 6,
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
          championshipId: championshipId,
          round: 2
        },
        {
          id: 'sf2',
          teamA: {
            id: '3',
            name: 'TBD',
            players: [],
            wins: 0,
            losses: 0,
            points: 0,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '4',
            name: 'TBD',
            players: [],
            wins: 0,
            losses: 0,
            points: 0,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '2',
            name: 'Gaming House RJ',
            address: 'Rio de Janeiro, RJ',
            capacity: 50,
            available: true
          },
          scheduledDate: '2024-03-05T20:30:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: championshipId,
          round: 2
        },
        // Final
        {
          id: 'final',
          teamA: {
            id: 'tbd1',
            name: 'TBD',
            players: [],
            wins: 0,
            losses: 0,
            points: 0,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: 'tbd2',
            name: 'TBD',
            players: [],
            wins: 0,
            losses: 0,
            points: 0,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '1',
            name: 'Arena São Paulo',
            address: 'São Paulo, SP',
            capacity: 100,
            available: true
          },
          scheduledDate: '2024-03-08T20:00:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: championshipId,
          round: 3
        }
      ]

      // Organizar matches por rodada para exibição em bracket
      const nodes: BracketNode[] = mockMatches.map((match, index) => ({
        id: match.id,
        match,
        round: match.round || 1,
        position: index
      }))

      setBracketData(nodes)
    } catch (error) {
      console.error('Erro ao carregar bracket:', error)
    }
  }

  const getMatchesByRound = (round: number) => {
    return bracketData.filter(node => node.round === round)
  }

  const getRoundName = (round: number) => {
    const roundNames = {
      1: 'Quartas de Final',
      2: 'Semifinais',
      3: 'Final'
    }
    return roundNames[round as keyof typeof roundNames] || `Rodada ${round}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando bracket...</p>
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
             Bracket dos Torneios
          </h1>
          <p className="text-gray-400">
            Árvore interativa para campeonatos Mata-Mata
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
              <p className="text-gray-400">
                Mata-Mata • {getRoundName(championships.find(c => c.id === selectedChampionship)?.currentRound || 1)}
              </p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full ${
              championships.find(c => c.id === selectedChampionship)?.isActive
                ? 'bg-green-500 text-green-900'
                : 'bg-gray-500 text-gray-900'
            }`}>
              {championships.find(c => c.id === selectedChampionship)?.isActive ? 'Ativo' : 'Finalizado'}
            </span>
          </div>
        </div>
      )}

      {/* Bracket Visualization */}
      <div className="space-y-8">
        {[1, 2, 3].map((round) => {
          const roundMatches = getMatchesByRound(round)
          
          if (roundMatches.length === 0) return null

          return (
            <div key={round} className="space-y-4">
              {/* Round Title */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-primary-400 mb-2">
                  {getRoundName(round)}
                </h3>
                <div className="w-24 h-1 bg-primary-500 mx-auto rounded-full"></div>
              </div>

              {/* Matches Grid */}
              <div className={`grid gap-6 ${
                round === 1 ? 'md:grid-cols-2 lg:grid-cols-2' :
                round === 2 ? 'md:grid-cols-2' :
                'md:grid-cols-1 max-w-2xl mx-auto'
              }`}>
                {roundMatches.map((node) => (
                  <div key={node.id} className="relative">
                    {node.match && (
                      <MatchCard
                        match={node.match}
                        showLocation={round === 3}
                        onClick={() => {
                          // Navigate to match room
                        }}
                      />
                    )}
                    
                    {/* Connector Lines for Visual Effect */}
                    {round < 3 && (
                      <div className="hidden lg:block absolute -right-8 top-1/2 w-8 h-0.5 bg-dark-600 transform -translate-y-1/2"></div>
                    )}
                  </div>
                ))}
              </div>

              {/* Visual Separator */}
              {round < 3 && (
                <div className="flex justify-center">
                  <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-dark-600 to-transparent"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Tournament Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
        <div className="esports-card">
          <h3 className="font-medium text-white mb-3 flex items-center">
            <span className="mr-2">📋</span>
            Regras do Torneio
          </h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <div>• Sistema de eliminação simples</div>
            <div>• Melhor de 1 (BO1) até as semifinais</div>
            <div>• Final em melhor de 3 (BO3)</div>
            <div>• Overtime em caso de empate 15x15</div>
          </div>
        </div>
        
        <div className="esports-card">
          <h3 className="font-medium text-white mb-3 flex items-center">
            <span className="mr-2">🏆</span>
            Premiação
          </h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <div><strong className="text-yellow-400">1º Lugar:</strong> R$ 50.000</div>
            <div><strong className="text-gray-300">2º Lugar:</strong> R$ 20.000</div>
            <div><strong className="text-yellow-600">3º Lugar:</strong> R$ 10.000</div>
            <div><strong className="text-gray-400">4º Lugar:</strong> R$ 5.000</div>
          </div>
        </div>
      </div>
    </div>
  )
}