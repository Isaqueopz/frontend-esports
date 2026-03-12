import { useState, useEffect } from 'react'
import type { Championship, Match } from '../types'
import { ChampionshipType, MatchStatus } from '../types'
import { MatchCard } from '../components/MatchCard'
import { championshipsService } from '../services/api'
import { Calendar, Trophy, Users } from 'lucide-react'

export function LeaguePage() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<number | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRound, setSelectedRound] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChampionship != null) {
      loadMatches(selectedChampionship)
    }
  }, [selectedChampionship])

  const loadData = async () => {
    try {
      setLoading(true)
      const all = await championshipsService.getAll()
      const pontosCorridos = all.filter((c: Championship) => c.tipo === ChampionshipType.PONTOS_CORRIDOS)
      setChampionships(pontosCorridos)

      if (pontosCorridos.length > 0 && selectedChampionship == null) {
        setSelectedChampionship(pontosCorridos[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMatches = async (championshipId: number) => {
    try {
      const championship = await championshipsService.getById(championshipId)
      const tabela = championship.tabela ?? []
      setMatches(tabela)
      setSelectedRound(null)
    } catch (error) {
      console.error('Erro ao carregar partidas:', error)
    }
  }

  const getRounds = (): string[] => {
    const rounds = new Set<string>()
    matches.forEach((m) => {
      if (m.round) rounds.add(m.round)
    })
    return Array.from(rounds).sort((a, b) => {
      const numA = parseInt(a)
      const numB = parseInt(b)
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB
      return a.localeCompare(b)
    })
  }

  const getFilteredMatches = (): Match[] => {
    if (!selectedRound) return matches
    return matches.filter((m) => m.round === selectedRound)
  }

  const getStats = () => {
    const total = matches.length
    const concluidas = matches.filter((m) => m.status === MatchStatus.CONCLUIDA).length
    const agendadas = matches.filter((m) => m.status === MatchStatus.AGENDADA).length
    const emAndamento = matches.filter((m) => m.status === MatchStatus.EM_ANDAMENTO).length
    return { total, concluidas, agendadas, emAndamento }
  }

  const rounds = getRounds()
  const filteredMatches = getFilteredMatches()
  const stats = getStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando campeonato...</p>
        </div>
      </div>
    )
  }

  const selected = championships.find((c) => c.id === selectedChampionship)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Pontos Corridos
          </h1>
          <p className="text-gray-400">
            Tabela de jogos do campeonato por rodada
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
                Pontos Corridos • {selected.times.length} times
              </p>
            </div>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                selected.status === 'EM_ANDAMENTO'
                  ? 'bg-green-500 text-green-900'
                  : selected.status === 'AGENDADA'
                    ? 'bg-yellow-500 text-yellow-900'
                    : 'bg-gray-500 text-gray-900'
              }`}
            >
              {selected.status === 'EM_ANDAMENTO'
                ? 'Em Andamento'
                : selected.status === 'AGENDADA'
                  ? 'Agendado'
                  : 'Concluído'}
            </span>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="esports-card text-center">
          <div className="flex items-center justify-center mb-2">
            <Calendar className="w-5 h-5 text-primary-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-gray-400 text-sm">Total de Jogos</div>
        </div>
        <div className="esports-card text-center">
          <div className="flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">{stats.concluidas}</div>
          <div className="text-gray-400 text-sm">Concluídas</div>
        </div>
        <div className="esports-card text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
          </div>
          <div className="text-2xl font-bold text-yellow-400">{stats.emAndamento}</div>
          <div className="text-gray-400 text-sm">Em Andamento</div>
        </div>
        <div className="esports-card text-center">
          <div className="flex items-center justify-center mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{stats.agendadas}</div>
          <div className="text-gray-400 text-sm">Agendadas</div>
        </div>
      </div>

      {/* Round Filter */}
      {rounds.length > 0 && (
        <div className="esports-card">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Filtrar por Rodada</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedRound(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedRound === null
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                  : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
              }`}
            >
              Todas
            </button>
            {rounds.map((round) => (
              <button
                key={round}
                onClick={() => setSelectedRound(round)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedRound === round
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/30'
                    : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
                }`}
              >
                Rodada {round}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Matches */}
      {filteredMatches.length > 0 ? (
        <div className="space-y-4">
          {selectedRound ? (
            // Single selected round
            <div>
              <h3 className="text-lg font-semibold text-primary-400 mb-4">
                Rodada {selectedRound}
              </h3>
              <div className="space-y-4">
                {filteredMatches.map((match) => (
                  <MatchCard key={match.id} match={match} showLocation={true} />
                ))}
              </div>
            </div>
          ) : (
            // All rounds grouped
            rounds.length > 0 ? (
              rounds.map((round) => {
                const roundMatches = matches.filter((m) => m.round === round)
                if (roundMatches.length === 0) return null
                return (
                  <div key={round}>
                    <h3 className="text-lg font-semibold text-primary-400 mb-4">
                      Rodada {round}
                    </h3>
                    <div className="space-y-4 mb-6">
                      {roundMatches.map((match) => (
                        <MatchCard key={match.id} match={match} showLocation={true} />
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              // No rounds, just show all matches
              matches.map((match) => (
                <MatchCard key={match.id} match={match} showLocation={true} />
              ))
            )
          )}
        </div>
      ) : (
        <div className="esports-card text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma partida disponível</p>
          <p className="text-gray-500 text-sm mt-2">
            O campeonato precisa ser iniciado para gerar as partidas.
          </p>
        </div>
      )}

      {/* Rules */}
      <div className="esports-card">
        <h3 className="text-lg font-semibold text-white mb-4">Regras do Campeonato</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-dark-700 rounded-lg p-4">
            <h4 className="text-primary-400 font-medium mb-2">Formato</h4>
            <p className="text-gray-400">Pontos Corridos — todos jogam contra todos.</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <h4 className="text-primary-400 font-medium mb-2">Pontuação</h4>
            <p className="text-gray-400">Vitória: 3 pts • Empate: 1 pt • Derrota: 0 pts</p>
          </div>
          <div className="bg-dark-700 rounded-lg p-4">
            <h4 className="text-primary-400 font-medium mb-2">Classificação</h4>
            <p className="text-gray-400">O time com mais pontos ao final é o campeão.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
