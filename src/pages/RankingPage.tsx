import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Championship, Team } from '../types'
import { championshipsService, teamsService } from '../services/api'
import { Globe, Trophy, Users } from 'lucide-react'

type Tab = 'geral' | 'campeonato'

export function RankingPage() {
  const [tab, setTab] = useState<Tab>('geral')
  const [allTeams, setAllTeams] = useState<Team[]>([])
  const [championshipTeams, setChampionshipTeams] = useState<Team[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (tab === 'campeonato' && selectedChampionship != null) {
      loadChampionshipRanking(selectedChampionship)
    }
  }, [selectedChampionship, tab])

  const loadData = async () => {
    try {
      setLoading(true)
      const [teams, allChampionships] = await Promise.all([
        teamsService.getAll(),
        championshipsService.getAll(),
      ])
      const sorted = [...teams].sort((a, b) => a.ranking - b.ranking)
      setAllTeams(sorted)
      setChampionships(allChampionships)

      if (allChampionships.length > 0 && selectedChampionship == null) {
        setSelectedChampionship(allChampionships[0].id)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadChampionshipRanking = async (championshipId: number) => {
    try {
      const championship = await championshipsService.getById(championshipId)
      if (championship.tipo === 'MATA_MATA' && championship.bracketNodes) {
        // Mata-Mata: campeão, vice, semifinalistas, etc
        // 1. Final: vencedor é campeão, perdedor é vice
        // 2. Semifinais: perdedores são semifinalistas
        // 3. Quartas: perdedores são quartas
        const finalNode = championship.bracketNodes.find(n => n.round === 'FINAL')
        const semifinalNodes = championship.bracketNodes.filter(n => n.round === 'SEMIFINAL')
        const quartasNodes = championship.bracketNodes.filter(n => n.round === 'QUARTAS')
        let champion: Team | undefined
        let vice: Team | undefined
        let semifinalists: Team[] = []
        let quartas: Team[] = []
        if (finalNode && finalNode.match) {
          champion = finalNode.vencedor ?? undefined
          // Vice: perdedor da final
          if (finalNode.match.teamA && finalNode.match.teamB) {
            if (champion && finalNode.match.teamA.id === champion.id) {
              vice = finalNode.match.teamB
            } else if (champion && finalNode.match.teamB.id === champion.id) {
              vice = finalNode.match.teamA
            }
          }
        }
        // Semifinalistas: perdedores das semifinais
        for (const node of semifinalNodes) {
          if (node.match && node.match.teamA && node.match.teamB && node.vencedor) {
            const loser = node.match.teamA.id === node.vencedor.id ? node.match.teamB : node.match.teamA
            semifinalists.push(loser)
          }
        }
        // Quartas: perdedores das quartas
        for (const node of quartasNodes) {
          if (node.match && node.match.teamA && node.match.teamB && node.vencedor) {
            const loser = node.match.teamA.id === node.vencedor.id ? node.match.teamB : node.match.teamA
            quartas.push(loser)
          }
        }
        // Monta lista final
        const ordered: Team[] = []
        if (champion) ordered.push(champion)
        if (vice) ordered.push(vice)
        ordered.push(...semifinalists)
        ordered.push(...quartas)
        // Adiciona demais times (não classificados)
        const allIds = ordered.map(t => t.id)
        const others = (championship.times || []).filter(t => !allIds.includes(t.id))
        ordered.push(...others)
        setChampionshipTeams(ordered)
      } else {
        // Pontos Corridos: ordena por pontos
        const teams = await championshipsService.getTabela(championshipId)
        if (teams && teams.length > 0) {
          const sorted = [...teams].sort((a, b) => b.pontos - a.pontos)
          setChampionshipTeams(sorted)
        } else if (championship.times && championship.times.length > 0) {
          const sorted = [...championship.times].sort((a, b) => b.pontos - a.pontos)
          setChampionshipTeams(sorted)
        } else {
          setChampionshipTeams([])
        }
      }
    } catch (error) {
      console.error('Erro ao carregar ranking do campeonato:', error)
      setChampionshipTeams([])
    }
  }

  const getPositionBadge = (position: number) => {
    if (position <= 3) {
      const colors = ['bg-yellow-500', 'bg-gray-400', 'bg-yellow-600']
      const icons = ['🥇', '🥈', '🥉']
      return (
        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${colors[position - 1]} text-white font-bold shadow-lg`}>
          <span className="text-sm">{icons[position - 1]}</span>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-dark-600 text-gray-300 font-bold">
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

  const selected = championships.find(c => c.id === selectedChampionship)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Ranking dos Times
        </h1>
        <p className="text-gray-400">
          Classificação geral e por campeonato
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setTab('geral')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'geral'
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Ranking Geral</span>
        </button>
        <button
          onClick={() => setTab('campeonato')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
            tab === 'campeonato'
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/30'
              : 'bg-dark-700 text-gray-300 hover:bg-dark-600 hover:text-white'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Por Campeonato</span>
        </button>
      </div>

      {/* ===== TAB: RANKING GERAL ===== */}
      {tab === 'geral' && (
        <>
          {allTeams.length > 0 ? (
            <div className="space-y-3">
              {allTeams.map((team, index) => {
                const position = index + 1
                return (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className={`group esports-card flex items-center gap-4 py-4 hover:border-primary-500/50 transition-all duration-300 ${
                      position <= 3 ? 'border-l-4' : ''
                    } ${
                      position === 1 ? 'border-l-yellow-500' :
                      position === 2 ? 'border-l-gray-400' :
                      position === 3 ? 'border-l-yellow-600' : ''
                    }`}
                  >
                    {/* Position */}
                    <div className="flex-shrink-0">
                      {getPositionBadge(position)}
                    </div>

                    {/* Team Logo */}
                    <div className="flex-shrink-0">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-dark-600 group-hover:border-primary-500/50 transition-colors duration-300"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors duration-300 truncate">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {team.players?.length ?? 0} jogadores
                      </p>
                    </div>

                    {/* Points */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-black text-primary-400">{team.pontos}</div>
                      <div className="text-xs text-gray-500">pontos</div>
                    </div>

                    {/* Ranking Badge */}
                    <div className="flex-shrink-0 hidden md:block">
                      <div className={`px-4 py-2 rounded-lg text-center ${
                        position <= 3
                          ? 'bg-primary-500/20 border border-primary-500/30'
                          : 'bg-dark-700'
                      }`}>
                        <div className="text-xs text-gray-400">Rank</div>
                        <div className={`text-lg font-bold ${
                          position <= 3 ? 'text-primary-400' : 'text-gray-300'
                        }`}>#{team.ranking}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="esports-card text-center py-12">
              <p className="text-gray-400 text-lg">Nenhum time cadastrado</p>
              <p className="text-gray-500 text-sm mt-2">Cadastre times para ver o ranking geral.</p>
            </div>
          )}
        </>
      )}

      {/* ===== TAB: POR CAMPEONATO ===== */}
      {tab === 'campeonato' && (
        <>
          {/* Championship Selector */}
          {championships.length > 0 && (
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <select
                value={selectedChampionship ?? ''}
                onChange={(e) => setSelectedChampionship(Number(e.target.value))}
                className="bg-dark-700 border border-dark-600 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {championships.map((championship) => (
                  <option key={championship.id} value={championship.id}>
                    {championship.nome} ({championship.tipo === 'PONTOS_CORRIDOS' ? 'Pontos Corridos' : 'Mata-Mata'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Championship Info */}
          {selected && (
            <div className="esports-card">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {selected.nome}
                  </h2>
                  <p className="text-gray-400">
                    {selected.tipo === 'PONTOS_CORRIDOS' ? 'Pontos Corridos' : 'Mata-Mata'} • {selected.times.length} times
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

          {/* Ranking Table */}
          {championshipTeams.length > 0 ? (
            <div className="space-y-3">
              {championshipTeams.map((team, index) => {
                const position = index + 1
                return (
                  <Link
                    key={team.id}
                    to={`/teams/${team.id}`}
                    className={`group esports-card flex items-center gap-4 py-4 hover:border-primary-500/50 transition-all duration-300 ${
                      position <= 3 ? 'border-l-4' : ''
                    } ${
                      position === 1 ? 'border-l-yellow-500' :
                      position === 2 ? 'border-l-gray-400' :
                      position === 3 ? 'border-l-yellow-600' : ''
                    }`}
                  >
                    {/* Position */}
                    <div className="flex-shrink-0">
                      {getPositionBadge(position)}
                    </div>

                    {/* Team Logo */}
                    <div className="flex-shrink-0">
                      {team.logo ? (
                        <img
                          src={team.logo}
                          alt={team.name}
                          className="w-12 h-12 rounded-xl object-cover border-2 border-dark-600 group-hover:border-primary-500/50 transition-colors duration-300"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors duration-300 truncate">
                        {team.name}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {team.players?.length ?? 0} jogadores
                      </p>
                    </div>

                    {/* Points */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-black text-primary-400">{team.pontos}</div>
                      <div className="text-xs text-gray-500">pontos</div>
                    </div>

                    {/* Ranking Badge */}
                    <div className="flex-shrink-0 hidden md:block">
                      <div className={`px-4 py-2 rounded-lg text-center ${
                        position <= 3
                          ? 'bg-primary-500/20 border border-primary-500/30'
                          : 'bg-dark-700'
                      }`}>
                        <div className="text-xs text-gray-400">Rank</div>
                        <div className={`text-lg font-bold ${
                          position <= 3 ? 'text-primary-400' : 'text-gray-300'
                        }`}>#{team.ranking}</div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="esports-card text-center py-12">
              <p className="text-gray-400 text-lg">Nenhuma classificação disponível</p>
              <p className="text-gray-500 text-sm mt-2">O campeonato precisa ser iniciado para gerar a classificação.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
