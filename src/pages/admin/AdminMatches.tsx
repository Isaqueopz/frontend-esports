import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Match } from '../../types'
import { MatchStatus } from '../../types'
import { formatDate } from '../../utils/dateUtils'
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  Gamepad2,
  Clock,
  CheckCircle2,
  Play
} from 'lucide-react'

export function AdminMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<MatchStatus | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  useEffect(() => {
    filterMatches()
  }, [matches, searchTerm, statusFilter])

  const loadMatches = async () => {
    try {
      setLoading(true)
      
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por: const response = await fetch('/api/admin/matches')\n      
      const mockMatches: Match[] = [
        {
          id: '1',
          teamA: { id: '1', name: 'Luminosity Gaming', players: [], wins: 5, losses: 2, points: 15, createdAt: '' },
          teamB: { id: '2', name: 'FURIA Esports', players: [], wins: 4, losses: 3, points: 12, createdAt: '' },
          location: { id: '1', name: 'Arena Principal', address: 'São Paulo, SP', capacity: 100, available: true },
          scheduledDate: '2026-03-10T19:00:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: '1',
          round: 1
        },
        {
          id: '2',
          teamA: { id: '3', name: 'MIBR', players: [], wins: 3, losses: 4, points: 9, createdAt: '' },
          teamB: { id: '4', name: 'Imperial Esports', players: [], wins: 6, losses: 1, points: 18, createdAt: '' },
          location: { id: '2', name: 'Arena Secundária', address: 'Rio de Janeiro, RJ', capacity: 50, available: true },
          scheduledDate: '2026-03-08T20:00:00Z',
          status: MatchStatus.EM_ANDAMENTO,
          placarCT: 8,
          placarTR: 12,
          championshipId: '1',
          round: 1
        },
        {
          id: '3',
          teamA: { id: '5', name: 'paiN Gaming', players: [], wins: 2, losses: 5, points: 6, createdAt: '' },
          teamB: { id: '6', name: 'Fluxo', players: [], wins: 7, losses: 0, points: 21, createdAt: '' },
          location: { id: '1', name: 'Arena Principal', address: 'São Paulo, SP', capacity: 100, available: true },
          scheduledDate: '2026-03-05T18:00:00Z',
          status: MatchStatus.CONCLUIDA,
          placarCT: 10,
          placarTR: 16,
          championshipId: '1',
          round: 1
        }
      ]

      setMatches(mockMatches)
    } catch (error) {
      console.error('Erro ao carregar partidas:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMatches = () => {
    let filtered = matches

    if (searchTerm) {
      filtered = filtered.filter(match =>
        match.teamA.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.teamB.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.location.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(match => match.status === statusFilter)
    }

    setFilteredMatches(filtered)
  }

  const getStatusBadge = (status: MatchStatus) => {
    const styles = {
      [MatchStatus.AGENDADA]: 'bg-yellow-500/20 text-yellow-500',
      [MatchStatus.EM_ANDAMENTO]: 'bg-blue-500/20 text-blue-500',
      [MatchStatus.CONCLUIDA]: 'bg-green-500/20 text-green-500'
    }

    const labels = {
      [MatchStatus.AGENDADA]: 'Agendada',
      [MatchStatus.EM_ANDAMENTO]: 'Em Andamento',
      [MatchStatus.CONCLUIDA]: 'Concluída'
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getStatusIcon = (status: MatchStatus) => {
    switch (status) {
      case MatchStatus.AGENDADA:
        return <Clock className="w-4 h-4" />
      case MatchStatus.EM_ANDAMENTO:
        return <Play className="w-4 h-4" />
      case MatchStatus.CONCLUIDA:
        return <CheckCircle2 className="w-4 h-4" />
    }
  }

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta partida?')) return

    try {
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // await fetch(`/api/admin/matches/${matchId}`, { method: 'DELETE' })
      
      setMatches(prev => prev.filter(m => m.id !== matchId))
    } catch (error) {
      console.error('Erro ao excluir partida:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Partidas
          </h1>
          <p className="text-gray-400">
            Administre todas as partidas do campeonato
          </p>
        </div>
        
        <Link
          to="/admin/matches/new"
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Nova Partida</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-6 bg-dark-800 rounded-lg border border-dark-700">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por times ou local..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as MatchStatus | 'ALL')}
            className="px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
          >
            <option value="ALL">Todos os Status</option>
            <option value={MatchStatus.AGENDADA}>Agendadas</option>
            <option value={MatchStatus.EM_ANDAMENTO}>Em Andamento</option>
            <option value={MatchStatus.CONCLUIDA}>Concluídas</option>
          </select>
        </div>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => (
            <div key={match.id} className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Match Info */}
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <p className="font-semibold text-white text-lg">{match.teamA.name}</p>
                      <p className="text-gray-400 text-sm">{match.teamA.wins}V - {match.teamA.losses}D</p>
                    </div>
                    
                    <div className="text-center px-4">
                      {match.status === MatchStatus.CONCLUIDA && match.placarCT !== undefined && match.placarTR !== undefined ? (
                        <div>
                          <p className="text-2xl font-bold text-white">
                            {match.placarCT} - {match.placarTR}
                          </p>
                          <p className="text-xs text-gray-400">Final</p>
                        </div>
                      ) : match.status === MatchStatus.EM_ANDAMENTO && match.placarCT !== undefined && match.placarTR !== undefined ? (
                        <div>
                          <p className="text-2xl font-bold text-primary-500">
                            {match.placarCT} - {match.placarTR}
                          </p>
                          <p className="text-xs text-primary-400">Live</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-400 text-sm">vs</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(match.scheduledDate)}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="text-center">
                      <p className="font-semibold text-white text-lg">{match.teamB.name}</p>
                      <p className="text-gray-400 text-sm">{match.teamB.wins}V - {match.teamB.losses}D</p>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="hidden md:flex items-center space-x-4 text-gray-400 text-sm">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{match.location.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(match.scheduledDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                    {match.round && (
                      <span className="px-2 py-1 bg-dark-700 rounded text-xs">
                        Round {match.round}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(match.status)}
                    {getStatusBadge(match.status)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/admin/matches/${match.id}`}
                      className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      title="Editar partida"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    
                    <button
                      onClick={() => handleDeleteMatch(match.id)}
                      className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                      title="Excluir partida"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
            <Gamepad2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">
              Nenhuma partida encontrada
            </p>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || statusFilter !== 'ALL' 
                ? 'Tente ajustar os filtros de busca'
                : 'Crie sua primeira partida para começar'
              }
            </p>
            {!searchTerm && statusFilter === 'ALL' && (
              <Link
                to="/admin/matches/new"
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Partida</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  )
}