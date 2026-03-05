import { useState, useEffect } from 'react'
import type { Team } from '../../types'
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Shield
} from 'lucide-react'

export function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [teamName, setTeamName] = useState('')

  useEffect(() => {
    loadTeams()
  }, [])

  const loadTeams = async () => {
    try {
      setLoading(true)

      // ⚠️ SPRING BOOT INTEGRATION POINT
      const mockTeams: Team[] = [
        { id: '1', name: 'Luminosity Gaming', players: [], wins: 5, losses: 2, points: 15, createdAt: '2024-01-01T00:00:00Z' },
        { id: '2', name: 'FURIA Esports', players: [], wins: 4, losses: 3, points: 12, createdAt: '2024-01-01T00:00:00Z' },
        { id: '3', name: 'MIBR', players: [], wins: 3, losses: 4, points: 9, createdAt: '2024-01-01T00:00:00Z' },
        { id: '4', name: 'Imperial Esports', players: [], wins: 6, losses: 1, points: 18, createdAt: '2024-01-01T00:00:00Z' },
        { id: '5', name: 'paiN Gaming', players: [], wins: 2, losses: 5, points: 6, createdAt: '2024-01-01T00:00:00Z' },
        { id: '6', name: 'Fluxo', players: [], wins: 7, losses: 0, points: 21, createdAt: '2024-01-01T00:00:00Z' }
      ]

      setTeams(mockTeams)
    } catch (error) {
      console.error('Erro ao carregar times:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (team?: Team) => {
    if (team) {
      setEditingTeam(team)
      setTeamName(team.name)
    } else {
      setEditingTeam(null)
      setTeamName('')
    }
    setShowModal(true)
  }

  const handleSaveTeam = async () => {
    if (!teamName.trim()) return

    try {
      if (editingTeam) {
        // ⚠️ SPRING BOOT INTEGRATION POINT
        // await fetch(`/api/admin/teams/${editingTeam.id}`, { method: 'PUT', ... })
        setTeams(prev => prev.map(t => t.id === editingTeam.id ? { ...t, name: teamName } : t))
      } else {
        // ⚠️ SPRING BOOT INTEGRATION POINT
        // await fetch('/api/admin/teams', { method: 'POST', ... })
        const newTeam: Team = {
          id: String(Date.now()),
          name: teamName,
          players: [],
          wins: 0,
          losses: 0,
          points: 0,
          createdAt: new Date().toISOString()
        }
        setTeams(prev => [...prev, newTeam])
      }

      setShowModal(false)
      setTeamName('')
      setEditingTeam(null)
    } catch (error) {
      console.error('Erro ao salvar time:', error)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Tem certeza que deseja excluir este time?')) return

    try {
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // await fetch(`/api/admin/teams/${teamId}`, { method: 'DELETE' })
      setTeams(prev => prev.filter(t => t.id !== teamId))
    } catch (error) {
      console.error('Erro ao excluir time:', error)
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
            Gerenciar Times
          </h1>
          <p className="text-gray-400">
            Administre os times do campeonato
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Time</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar times..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
          />
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map(team => (
          <div key={team.id} className="bg-dark-800 rounded-lg border border-dark-700 p-6 hover:border-primary-500/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                  <p className="text-gray-400 text-sm">
                    {team.players.length} jogadores
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => openModal(team)}
                  className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  title="Editar time"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteTeam(team.id)}
                  className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  title="Excluir time"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="bg-dark-700 rounded-lg p-3">
                <p className="text-green-500 font-bold text-lg">{team.wins}</p>
                <p className="text-gray-400 text-xs">Vitórias</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <p className="text-red-500 font-bold text-lg">{team.losses}</p>
                <p className="text-gray-400 text-xs">Derrotas</p>
              </div>
              <div className="bg-dark-700 rounded-lg p-3">
                <p className="text-primary-500 font-bold text-lg">{team.points}</p>
                <p className="text-gray-400 text-xs">Pontos</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
          <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">
            {searchTerm ? 'Nenhum time encontrado' : 'Nenhum time cadastrado'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Criar Primeiro Time</span>
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingTeam ? 'Editar Time' : 'Novo Time'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Nome do Time
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Nome do time..."
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowModal(false)
                  setEditingTeam(null)
                  setTeamName('')
                }}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveTeam}
                disabled={!teamName.trim()}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {editingTeam ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
