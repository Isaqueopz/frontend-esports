import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Ranking, Championship } from '../types'
import { ChampionshipType } from '../types'
import { championshipsService } from '../services/api'

export function RankingPage() {
  const [rankings, setRankings] = useState<Ranking[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (selectedChampionship != null) {
      loadRanking(selectedChampionship)
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

  const loadRanking = async (championshipId: number) => {
    try {
      const championship = await championshipsService.getById(championshipId)
      if (championship.rankings && championship.rankings.length > 0) {
        const sorted = [...championship.rankings].sort((a, b) => a.posicao - b.posicao)
        setRankings(sorted)
      } else {
        setRankings([])
      }
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

  const selected = championships.find(c => c.id === selectedChampionship)

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
              <p className="text-gray-400">Pontos Corridos • {selected.times.length} times</p>
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
      {rankings.length > 0 ? (
        <div className="esports-card overflow-x-auto">
          <div className="min-w-full">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-4 border-b border-dark-600 text-sm font-medium text-gray-400">
              <div className="col-span-1 text-center">Pos</div>
              <div className="col-span-4">Time</div>
              <div className="col-span-1 text-center">Pts</div>
              <div className="col-span-1 text-center">J</div>
              <div className="col-span-1 text-center">V</div>
              <div className="col-span-1 text-center">E</div>
              <div className="col-span-1 text-center">D</div>
              <div className="col-span-2 text-center">Ranking</div>
            </div>

            {/* Ranking Items */}
            <div className="space-y-2 pt-4">
              {rankings.map((ranking) => (
                <Link
                  key={ranking.id}
                  to={`/teams/${ranking.team.id}`}
                  className="grid grid-cols-12 gap-4 py-3 rounded-lg hover:bg-dark-700 transition-colors duration-200 items-center"
                >
                  <div className="col-span-1 flex justify-center">
                    {getPositionBadge(ranking.posicao)}
                  </div>

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

                  <div className="col-span-1 text-center">
                    <span className="text-white font-bold text-lg">{ranking.pontos}</span>
                  </div>

                  <div className="col-span-1 text-center">
                    <span className="text-gray-300">{ranking.jogos}</span>
                  </div>

                  <div className="col-span-1 text-center">
                    <span className="text-green-400 font-medium">{ranking.vitorias}</span>
                  </div>

                  <div className="col-span-1 text-center">
                    <span className="text-yellow-400 font-medium">{ranking.empates}</span>
                  </div>

                  <div className="col-span-1 text-center">
                    <span className="text-red-400 font-medium">{ranking.derrotas}</span>
                  </div>

                  <div className="col-span-2 text-center">
                    <span className="text-primary-400 font-medium">#{ranking.team.ranking}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="esports-card text-center py-12">
          <p className="text-gray-400 text-lg">Nenhuma classificação disponível</p>
          <p className="text-gray-500 text-sm mt-2">O campeonato precisa ser iniciado para gerar a classificação.</p>
        </div>
      )}

      {/* Legend */}
      <div className="esports-card">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Legenda</h3>
        <div className="flex flex-wrap gap-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">Pts</span>
            <span className="text-white">Pontos</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">J</span>
            <span className="text-white">Jogos</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">V</span>
            <span className="text-white">Vitórias</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">E</span>
            <span className="text-white">Empates</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-400">D</span>
            <span className="text-white">Derrotas</span>
          </div>
        </div>
      </div>
    </div>
  )
}
