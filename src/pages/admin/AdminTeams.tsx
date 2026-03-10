import { useState, useEffect } from 'react'
import type { Team, Player } from '../../types'
import { teamsService } from '../../services/api'
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Users,
  Trophy,
  UserPlus,
  UserMinus,
  Upload,
  Image
} from 'lucide-react'

interface PlayerForm {
  name: string
  nickname: string
  avatar: string
  steamId: string
}

const emptyPlayer: PlayerForm = { name: '', nickname: '', avatar: '', steamId: '' }

export function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([])
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Modal states
  const [showModal, setShowModal] = useState(false)
  const [editingTeam, setEditingTeam] = useState<Team | null>(null)
  const [teamName, setTeamName] = useState('')
  const [teamLogo, setTeamLogo] = useState('')
  const [players, setPlayers] = useState<PlayerForm[]>([{ ...emptyPlayer }])

  useEffect(() => {
    loadTeams()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      setFilteredTeams(
        teams.filter(t =>
          t.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    } else {
      setFilteredTeams(teams)
    }
  }, [teams, searchTerm])

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

  const openNewTeamModal = () => {
    setEditingTeam(null)
    setTeamName('')
    setTeamLogo('')
    setPlayers([{ ...emptyPlayer }])
    setShowModal(true)
  }

  const openEditTeamModal = (team: Team) => {
    setEditingTeam(team)
    setTeamName(team.name)
    setTeamLogo(team.logo || '')
    setPlayers(
      team.players.length > 0
        ? team.players.map(p => ({
            name: p.name,
            nickname: p.nickname || '',
            avatar: p.avatar || '',
            steamId: p.steamId || ''
          }))
        : [{ ...emptyPlayer }]
    )
    setShowModal(true)
  }

  const addPlayer = () => {
    setPlayers(prev => [...prev, { ...emptyPlayer }])
  }

  const removePlayer = (index: number) => {
    setPlayers(prev => prev.filter((_, i) => i !== index))
  }

  const updatePlayer = (index: number, field: keyof PlayerForm, value: string) => {
    setPlayers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p))
  }

  const handleFileToBase64 = (file: File, callback: (base64: string) => void) => {
    const reader = new FileReader()
    reader.onload = () => {
      callback(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileToBase64(file, setTeamLogo)
  }

  const handleAvatarUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileToBase64(file, (base64) => updatePlayer(index, 'avatar', base64))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return

    const validPlayers = players
      .filter(p => p.name.trim())
      .map(p => ({
        name: p.name.trim(),
        nickname: p.nickname.trim() || undefined,
        avatar: p.avatar.trim() || undefined,
        steamId: p.steamId.trim() || undefined
      }))

    try {
      setSaving(true)
      const payload = {
        name: teamName.trim(),
        logo: teamLogo.trim() || undefined,
        players: validPlayers
      }

      if (editingTeam) {
        await teamsService.update(editingTeam.id, payload)
      } else {
        await teamsService.create(payload)
      }
      
      setShowModal(false)
      await loadTeams()
    } catch (error) {
      console.error('Erro ao salvar time:', error)
      alert('Erro ao salvar time. Verifique os dados e tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTeam = async (teamId: number) => {
    if (!confirm('Tem certeza que deseja excluir este time? Esta ação não pode ser desfeita.')) return

    try {
      await teamsService.delete(teamId)
      setTeams(prev => prev.filter(t => t.id !== teamId))
    } catch (error) {
      console.error('Erro ao excluir time:', error)
      alert('Erro ao excluir time. Verifique se o time não está em nenhum campeonato.')
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
            Administre os times e jogadores
          </p>
        </div>

        <button
          onClick={openNewTeamModal}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Time</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar times..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.length > 0 ? (
          filteredTeams.map((team) => (
            <div key={team.id} className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center text-xl font-bold text-primary-500">
                    {team.logo ? (
                      <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      team.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{team.name}</h3>
                    <p className="text-gray-400 text-sm">Rank #{team.ranking}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditTeamModal(team)}
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

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Trophy className="w-4 h-4" />
                  <span className="text-sm font-semibold">{team.pontos} pts</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{team.players.length} jogadores</span>
                </div>
              </div>

              {team.players.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Jogadores</p>
                  <div className="flex flex-wrap gap-1">
                    {team.players.map((player, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-dark-700 rounded text-xs text-gray-300"
                      >
                        {player.nickname || player.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
            <Users className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Nenhum time encontrado</p>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm ? 'Tente ajustar a busca' : 'Crie seu primeiro time para começar'}
            </p>
            {!searchTerm && (
              <button
                onClick={openNewTeamModal}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Time</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-xl font-bold text-white">
                {editingTeam ? 'Editar Time' : 'Novo Time'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Team Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Time *
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Ex: FURIA Esports"
                    className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Logo do Time (opcional)
                  </label>
                  <div className="flex items-center space-x-4">
                    {teamLogo && (
                      <img src={teamLogo} alt="Logo preview" className="w-16 h-16 rounded-full object-cover border-2 border-dark-600" />
                    )}
                    <label className="flex items-center space-x-2 px-4 py-2 bg-dark-600 hover:bg-dark-500 border border-dark-500 rounded-lg cursor-pointer transition-colors">
                      <Upload className="w-4 h-4 text-primary-500" />
                      <span className="text-sm text-gray-300">{teamLogo ? 'Trocar foto' : 'Anexar foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                    {teamLogo && (
                      <button
                        type="button"
                        onClick={() => setTeamLogo('')}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remover
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Players */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Jogadores</h3>
                  <button
                    type="button"
                    onClick={addPlayer}
                    className="flex items-center space-x-1 text-primary-500 hover:text-primary-400 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Adicionar Jogador</span>
                  </button>
                </div>

                {players.map((player, index) => (
                  <div key={index} className="bg-dark-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-300">
                        Jogador {index + 1}
                      </span>
                      {players.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removePlayer(index)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <UserMinus className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={player.name}
                          onChange={(e) => updatePlayer(index, 'name', e.target.value)}
                          placeholder="Nome *"
                          className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          value={player.nickname}
                          onChange={(e) => updatePlayer(index, 'nickname', e.target.value)}
                          placeholder="Nickname"
                          className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary-500"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        {player.avatar && (
                          <img src={player.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-dark-500" />
                        )}
                        <label className="flex items-center space-x-1 px-3 py-2 bg-dark-600 hover:bg-dark-500 border border-dark-500 rounded-lg cursor-pointer transition-colors flex-1">
                          <Image className="w-3 h-3 text-primary-500" />
                          <span className="text-xs text-gray-400">{player.avatar ? 'Trocar' : 'Foto'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleAvatarUpload(index, e)}
                            className="hidden"
                          />
                        </label>
                        {player.avatar && (
                          <button type="button" onClick={() => updatePlayer(index, 'avatar', '')} className="text-red-400 text-xs">X</button>
                        )}
                      </div>
                      <div>
                        <input
                          type="text"
                          value={player.steamId}
                          onChange={(e) => updatePlayer(index, 'steamId', e.target.value)}
                          placeholder="Steam ID"
                          className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || !teamName.trim()}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
