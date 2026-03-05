import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Championship } from '../../types'
import { ChampionshipType } from '../../types'
import {
  Trophy,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  Swords,
  ArrowRight,
  RotateCw
} from 'lucide-react'

export function AdminChampionships() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingChampionship, setEditingChampionship] = useState<Championship | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    type: ChampionshipType.MATA_MATA as string,
    maxTeams: 16,
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    loadChampionships()
  }, [])

  const loadChampionships = async () => {
    try {
      setLoading(true)

      // ⚠️ SPRING BOOT INTEGRATION POINT
      const mockChampionships: Championship[] = [
        {
          id: '1',
          name: 'Liga Principal 2024',
          type: ChampionshipType.MATA_MATA,
          teams: Array(8).fill(null).map((_, i) => ({
            id: String(i + 1),
            name: `Team ${i + 1}`,
            players: [],
            wins: 0,
            losses: 0,
            points: 0,
            createdAt: ''
          })),
          matches: [],
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-06-30T00:00:00Z',
          isActive: true,
          maxTeams: 16,
          currentRound: 2
        },
        {
          id: '2',
          name: 'Copa Inverno 2024',
          type: ChampionshipType.PONTOS_CORRIDOS,
          teams: Array(10).fill(null).map((_, i) => ({
            id: String(i + 10),
            name: `Team ${String.fromCharCode(65 + i)}`,
            players: [],
            wins: 0,
            losses: 0,
            points: 0,
            createdAt: ''
          })),
          matches: [],
          startDate: '2024-07-01T00:00:00Z',
          endDate: '2024-12-31T00:00:00Z',
          isActive: false,
          maxTeams: 12,
          currentRound: 5
        }
      ]

      setChampionships(mockChampionships)
    } catch (error) {
      console.error('Erro ao carregar campeonatos:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (championship?: Championship) => {
    if (championship) {
      setEditingChampionship(championship)
      setFormData({
        name: championship.name,
        type: championship.type,
        maxTeams: championship.maxTeams,
        startDate: championship.startDate.slice(0, 10),
        endDate: championship.endDate.slice(0, 10)
      })
    } else {
      setEditingChampionship(null)
      setFormData({
        name: '',
        type: ChampionshipType.MATA_MATA,
        maxTeams: 16,
        startDate: '',
        endDate: ''
      })
    }
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) return

    try {
      if (editingChampionship) {
        // ⚠️ SPRING BOOT INTEGRATION POINT
        setChampionships(prev => prev.map(c =>
          c.id === editingChampionship.id
            ? { ...c, name: formData.name, type: formData.type as ChampionshipType, maxTeams: formData.maxTeams }
            : c
        ))
      } else {
        // ⚠️ SPRING BOOT INTEGRATION POINT
        const newChampionship: Championship = {
          id: String(Date.now()),
          name: formData.name,
          type: formData.type as ChampionshipType,
          teams: [],
          matches: [],
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
          isActive: true,
          maxTeams: formData.maxTeams
        }
        setChampionships(prev => [...prev, newChampionship])
      }

      setShowModal(false)
    } catch (error) {
      console.error('Erro ao salvar campeonato:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este campeonato?')) return

    try {
      // ⚠️ SPRING BOOT INTEGRATION POINT
      setChampionships(prev => prev.filter(c => c.id !== id))
    } catch (error) {
      console.error('Erro ao excluir campeonato:', error)
    }
  }

  const handleGenerateNextRound = async (championship: Championship) => {
    if (!confirm(`Gerar próxima rodada para "${championship.name}"?`)) return

    try {
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Este endpoint no backend deve:
      // 1. Pegar os vencedores da rodada atual
      // 2. Sortear os confrontos da próxima rodada
      // 3. Criar as partidas automaticamente
      // await fetch(`/api/admin/championships/${championship.id}/generate-next-round`, { method: 'POST' })

      alert(`Próxima rodada gerada com sucesso para "${championship.name}"!`)
      loadChampionships()
    } catch (error) {
      console.error('Erro ao gerar próxima rodada:', error)
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
            Campeonatos
          </h1>
          <p className="text-gray-400">
            Crie e gerencie campeonatos
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Campeonato</span>
        </button>
      </div>

      {/* Championships List */}
      <div className="space-y-6">
        {championships.map(championship => (
          <div key={championship.id} className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{championship.name}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-gray-400 text-sm">
                      <span className="px-2 py-0.5 bg-dark-700 rounded text-xs">
                        {championship.type === ChampionshipType.MATA_MATA ? 'Mata-Mata' : 'Pontos Corridos'}
                      </span>
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{championship.teams.length}/{championship.maxTeams} times</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(championship.startDate).toLocaleDateString('pt-BR')} - {new Date(championship.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    championship.isActive 
                      ? 'bg-green-500/20 text-green-500'
                      : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {championship.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </div>

              {/* Current Round */}
              {championship.currentRound && (
                <div className="mt-4 p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Rodada Atual: {championship.currentRound}</p>
                      <p className="text-gray-400 text-sm">
                        {championship.type === ChampionshipType.MATA_MATA
                          ? 'Partidas eliminatórias em andamento'
                          : `Rodada ${championship.currentRound} de ${championship.teams.length - 1}`
                        }
                      </p>
                    </div>

                    {/* Generate Next Round - KEY ADMIN FEATURE */}
                    <button
                      onClick={() => handleGenerateNextRound(championship)}
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all shadow-lg hover:shadow-primary-500/25"
                    >
                      <RotateCw className="w-5 h-5" />
                      <span>Gerar Próxima Rodada</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center space-x-3 mt-4">
                <button
                  onClick={() => openModal(championship)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </button>

                <Link
                  to={`/admin/matches?championship=${championship.id}`}
                  className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                >
                  <Swords className="w-4 h-4" />
                  <span>Ver Partidas</span>
                </Link>

                <button
                  onClick={() => handleDelete(championship.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Excluir</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {championships.length === 0 && (
          <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Nenhum campeonato cadastrado</p>
            <button
              onClick={() => openModal()}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Criar Primeiro Campeonato</span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 w-full max-w-lg mx-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingChampionship ? 'Editar Campeonato' : 'Novo Campeonato'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do campeonato..."
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value={ChampionshipType.MATA_MATA}>Mata-Mata (Eliminatórias)</option>
                  <option value={ChampionshipType.PONTOS_CORRIDOS}>Pontos Corridos</option>
                </select>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Máximo de Times</label>
                <select
                  value={formData.maxTeams}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxTeams: parseInt(e.target.value) }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value={4}>4 times</option>
                  <option value={8}>8 times</option>
                  <option value={16}>16 times</option>
                  <option value={32}>32 times</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Data Início</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Data Fim</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!formData.name.trim()}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-700 text-white rounded-lg transition-colors"
              >
                {editingChampionship ? 'Salvar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
