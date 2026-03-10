import { useState, useEffect } from 'react'
import type { Championship, BracketNode } from '../types'
import { ChampionshipType, MatchStatus } from '../types'
import { MatchStatusBadge } from '../components/MatchStatusBadge'
import { formatDateTime } from '../utils/dateUtils.js'
import { championshipsService } from '../services/api'
import { Users } from 'lucide-react'

export function BracketPage() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<number | null>(null)
  const [bracketData, setBracketData] = useState<BracketNode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChampionship != null) {
      loadBracket(selectedChampionship)
    }
  }, [selectedChampionship])

  const loadData = async () => {
    try {
      setLoading(true)
      const all = await championshipsService.getAll()
      const mataMata = all.filter((c: Championship) => c.tipo === ChampionshipType.MATA_MATA)
      setChampionships(mataMata)
      
      if (mataMata.length > 0 && selectedChampionship == null) {
        setSelectedChampionship(mataMata[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadBracket = async (championshipId: number) => {
    try {
      const championship = await championshipsService.getById(championshipId)
      if (championship.bracketNodes) {
        setBracketData(championship.bracketNodes)
      } else {
        setBracketData([])
      }
    } catch (error) {
      console.error('Erro ao carregar bracket:', error)
    }
  }

  const getNodesByRound = (roundName: string) => {
    return bracketData
      .filter(node => node.round === roundName)
      .sort((a, b) => a.posicao - b.posicao)
  }

  const getRoundDisplayName = (round: string) => {
    const names: Record<string, string> = {
      'QUARTAS': 'Quartas de Final',
      'SEMIFINAL': 'Semifinais',
      'FINAL': 'Final'
    }
    return names[round] || round
  }

  const rounds = ['QUARTAS', 'SEMIFINAL', 'FINAL']

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

  const selected = championships.find(c => c.id === selectedChampionship)

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
            value={selectedChampionship ?? ''}
            onChange={(e) => setSelectedChampionship(Number(e.target.value))}
            className="mt-4 md:mt-0 bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {championships.map((championship) => (
              <option key={championship.id} value={championship.id}>
                {championship.nome}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Championship Info */}
      {selected && (
        <div className="esports-card">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {selected.nome}
              </h2>
              <p className="text-gray-400">
                Mata-Mata • {selected.times.length} times
              </p>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full ${
              selected.status === 'EM_ANDAMENTO' ? 'bg-green-500 text-green-900' :
              selected.status === 'AGENDADA' ? 'bg-yellow-500 text-yellow-900' :
              'bg-gray-500 text-gray-900'
            }`}>
              {selected.status === 'EM_ANDAMENTO' ? 'Em Andamento' :
               selected.status === 'AGENDADA' ? 'Agendado' : 'Concluído'}
            </span>
          </div>
        </div>
      )}

      {/* Bracket View */}
      {bracketData.length > 0 ? (
        <div className="overflow-x-auto">
          <div className="flex gap-8 min-w-max p-4">
            {rounds.map((round) => {
              const nodes = getNodesByRound(round)
              if (nodes.length === 0) return null
              return (
                <div key={round} className="flex flex-col">
                  <h3 className="text-lg font-semibold text-primary-400 mb-4 text-center">
                    {getRoundDisplayName(round)}
                  </h3>
                  <div className="flex flex-col justify-around flex-1 gap-4">
                    {nodes.map((node) => {
                      const match = node.match
                      if (!match) {
                        return (
                          <div key={node.id} className="esports-card min-w-[320px]">
                            <div className="text-center py-4 text-gray-500">Partida a definir</div>
                          </div>
                        )
                      }
                      return (
                      <div key={node.id} className="esports-card min-w-[320px]">
                        <div className="flex items-center justify-between mb-2">
                          <MatchStatusBadge status={match.status} />
                          {match.scheduledDate && (
                            <span className="text-xs text-gray-400">
                              {formatDateTime(match.scheduledDate)}
                            </span>
                          )}
                        </div>
                        
                        {/* Team A */}
                        <div className={`flex items-center justify-between p-3 rounded-lg mb-2 ${
                          node.vencedor?.id && match.teamA?.id && node.vencedor.id === match.teamA.id
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-dark-700'
                        }`}>
                          <div className="flex items-center space-x-3">
                            {match.teamA?.logo ? (
                              <img src={match.teamA.logo} alt={match.teamA.name ?? ''} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 bg-dark-500 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <span className={`font-medium ${
                              node.vencedor?.id && match.teamA?.id && node.vencedor.id === match.teamA.id ? 'text-green-400' : 'text-white'
                            }`}>
                              {match.teamA?.name ?? 'A definir'}
                            </span>
                          </div>
                          <span className="text-white font-bold">
                            {match.placarCT ?? '-'}
                          </span>
                        </div>

                        {/* Team B */}
                        <div className={`flex items-center justify-between p-3 rounded-lg ${
                          node.vencedor?.id && match.teamB?.id && node.vencedor.id === match.teamB.id
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-dark-700'
                        }`}>
                          <div className="flex items-center space-x-3">
                            {match.teamB?.logo ? (
                              <img src={match.teamB.logo} alt={match.teamB.name ?? ''} className="w-8 h-8 rounded-full object-cover" />
                            ) : (
                              <div className="w-8 h-8 bg-dark-500 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <span className={`font-medium ${
                              node.vencedor?.id && match.teamB?.id && node.vencedor.id === match.teamB.id ? 'text-green-400' : 'text-white'
                            }`}>
                              {match.teamB?.name ?? 'A definir'}
                            </span>
                          </div>
                          <span className="text-white font-bold">
                            {match.placarTR ?? '-'}
                          </span>
                        </div>

                        {match.map && (
                          <div className="mt-2 text-xs text-gray-500 text-center">
                            Mapa: {match.map}
                          </div>
                        )}
                      </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="esports-card text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum bracket disponível</p>
          <p className="text-gray-500 text-sm mt-2">O campeonato precisa ser iniciado para gerar o bracket.</p>
        </div>
      )}

      {/* Tournament Rules */}
      <div className="esports-card">
        <h3 className="text-lg font-semibold text-white mb-4">Regras do Torneio</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-dark-700 rounded-lg p-4">
            <h4 className="text-primary-400 font-medium mb-2">Formato</h4>
            <p className="text-gray-400">Eliminatórias simples — quem perde está fora.</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <h4 className="text-primary-400 font-medium mb-2">Mapa</h4>
            <p className="text-gray-400">Maps: MIRAGE, DUST2, ANCIENT. Formato CS2.</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <h4 className="text-primary-400 font-medium mb-2">Vitória</h4>
            <p className="text-gray-400">Primeiro a 13 rounds, com overtime até 16.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
