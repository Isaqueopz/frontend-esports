import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Team } from '../types'
import { teamsService } from '../services/api'
import { Users, Trophy, Search } from 'lucide-react'

export function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const data = await teamsService.getAll()
      setTeams(data)
    } catch (error) {
      console.error('Erro ao carregar times:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando times...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Times</h1>
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar time..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredTeams.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">Nenhum time encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Link
              key={team.id}
              to={`/teams/${team.id}`}
              className="esports-card hover:border-primary-500/50 transition-all duration-300 group"
            >
              <div className="flex items-center space-x-4">
                {team.logo ? (
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/50 group-hover:border-primary-500 transition-colors"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center border-2 border-primary-500/50 group-hover:border-primary-500 transition-colors">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate group-hover:text-primary-400 transition-colors">
                    {team.name}
                  </h3>
                  <p className="text-sm text-gray-400">{team.players.length} jogadores</p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-sm text-primary-400 font-medium">#{team.ranking}</span>
                    <span className="flex items-center text-sm text-yellow-400">
                      <Trophy className="w-3 h-3 mr-1" />
                      {team.pontos} pts
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
