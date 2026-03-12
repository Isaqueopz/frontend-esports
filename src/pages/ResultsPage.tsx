import { useState, useEffect } from 'react'
import type { Match, Championship, Team } from '../types'
import { MatchCard } from '../components/MatchCard'
import { formatDate } from '../utils/dateUtils.js'
import { matchesService, championshipsService, teamsService } from '../services/api'

export function ResultsPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedChampionship, setSelectedChampionship] = useState<string>('all')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    loadFilteredResults()
  }, [selectedChampionship, selectedTeam])

  const loadData = async () => {
    try {
      setLoading(true)
      const [allChampionships, allTeams, completedMatches] = await Promise.all([
        championshipsService.getAll(),
        teamsService.getAll(),
        matchesService.getCompleted(),
      ])
      setChampionships(allChampionships)
      setTeams(allTeams)
      setMatches(completedMatches)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFilteredResults = async () => {
    try {
      const filters: { championshipId?: number; teamId?: number } = {}
      if (selectedChampionship !== 'all') filters.championshipId = Number(selectedChampionship)
      if (selectedTeam !== 'all') filters.teamId = Number(selectedTeam)
      
      const completedMatches = await matchesService.getCompleted(filters)
      const sorted = [...completedMatches].sort(
        (a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
      )
      setMatches(sorted)
    } catch (error) {
      console.error('Erro ao carregar resultados:', error)
    }
  }

  const getWinner = (match: Match) => {
    return match.winner ?? null
  }

  const getMatchResult = (match: Match) => {
    if (match.winner) return `Vitória de ${match.winner.name}`
    if (match.placarCT != null && match.placarTR != null) {
      if (match.placarCT > match.placarTR) return `Vitória de ${match.teamA?.name ?? 'Time A'}`
      if (match.placarTR > match.placarCT) return `Vitória de ${match.teamB?.name ?? 'Time B'}`
      return 'Empate'
    }
    return 'Sem resultado'
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
          Resultados das Partidas
        </h1>
        <p className="text-gray-400">
          Histórico geral de partidas com status CONCLUÍDA
        </p>
      </div>

      {/* Filters */}
      <div className="esports-card">
        <h2 className="text-lg font-semibold text-white mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Championship Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Campeonato
            </label>
            <select
              value={selectedChampionship}
              onChange={(e) => setSelectedChampionship(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos os campeonatos</option>
              {championships.map((championship) => (
                <option key={championship.id} value={championship.id}>
                  {championship.nome}
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
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-dark-700 border border-dark-600 text-white rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Todos os times</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
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
            {championships.length}
          </div>
          <div className="text-gray-400">Campeonatos</div>
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
                    {match.scheduledDate ? formatDate(match.scheduledDate) : '—'}
                  </span>
                  {match.map && (
                    <span className="text-sm bg-dark-700 text-gray-300 px-2 py-1 rounded-full">
                      {match.map}
                    </span>
                  )}
                </div>
                <div className="text-sm text-green-400 font-medium">
                  {getMatchResult(match)}
                </div>
              </div>
              
              <MatchCard match={match} showLocation={true} />
            </div>
          ))
        ) : (
          <div className="esports-card text-center py-12">
            <p className="text-gray-400 text-lg">Nenhum resultado encontrado</p>
            <p className="text-gray-500 text-sm mt-2">
              Ajuste os filtros ou aguarde partidas serem finalizadas.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
