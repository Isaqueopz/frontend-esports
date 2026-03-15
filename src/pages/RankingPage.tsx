
import { useState, useEffect } from 'react'
import type { Championship, Team } from '../types'
import { championshipsService } from '../services/api'
import { Globe, Trophy } from 'lucide-react'



type Tab = 'geral' | 'campeonato'

export function RankingPage() {



  const [tab, setTab] = useState<Tab>('geral')
  const [allRankings, setAllRankings] = useState<Team[]>([])
  const [championshipRankings, setChampionshipRankings] = useState<Team[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [rankings, allChampionships] = await Promise.all([
          championshipsService.getTabelaGeral(),
          championshipsService.getAll(),
        ])
        setAllRankings(rankings)
        setChampionships(allChampionships)
        if (allChampionships.length > 0 && !selectedChampionship) {
          setSelectedChampionship(allChampionships[0].id)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchChampionshipRanking = async () => {
      if (tab === 'campeonato' && selectedChampionship) {
        try {
          setLoading(true)
          const rankings = await championshipsService.getTabela(selectedChampionship)
          setChampionshipRankings(rankings)
        } catch (error) {
          setChampionshipRankings([])
          console.error('Erro ao carregar ranking do campeonato:', error)
        } finally {
          setLoading(false)
        }
      }
    }
    fetchChampionshipRanking()
  }, [selectedChampionship, tab])

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
          {allRankings.length > 0 ? (
            <div className="space-y-3">
              {allRankings.map((team, index) => {
                const position = index + 1
                return (
                  <div
                    key={team.id}
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
                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors duration-300 truncate">
                        {team.name}
                      </h3>
                    </div>
                    {/* Points */}
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-black text-primary-400">{team.pontosTeam}</div>
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
                        }`}>#{team.rankingTeam}</div>
                      </div>
                    </div>
                  </div>
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
          {championshipRankings.length > 0 ? (
            <div className="space-y-3">
              {championshipRankings.map((team, index) => {
                const position = index + 1
                return (
                    <div
                      key={team.id}
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
                      {/* Team Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors duration-300 truncate">
                          {team.name}
                        </h3>
                      </div>
                      {/* Points */}
                      <div className="flex-shrink-0 text-right">
                        <div className="text-2xl font-black text-primary-400">{team.pontosTeam}</div>
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
                          }`}>#{team.rankingTeam ?? position}</div>
                        </div>
                      </div>
                    </div>
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
