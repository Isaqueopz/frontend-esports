import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Match, Team, Location, Championship } from '../../types'
import { MatchStatus } from '../../types'
import {
  Save,
  ArrowLeft,
  Play,
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  Trophy
} from 'lucide-react'

export function AdminMatchEdit() {
  const { matchId } = useParams()
  const navigate = useNavigate()
  const isNewMatch = matchId === 'new'

  const [teams, setTeams] = useState<Team[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    teamAId: '',
    teamBId: '',
    locationId: '',
    championshipId: '',
    scheduledDate: '',
    placarCT: 0,
    placarTR: 0,
    status: MatchStatus.AGENDADA as MatchStatus,
    round: 1
  })

  useEffect(() => {
    loadData()
  }, [matchId])

  const loadData = async () => {
    try {
      setLoading(true)

      // ⚠️ SPRING BOOT INTEGRATION POINTS
      const mockTeams: Team[] = [
        { id: '1', name: 'Luminosity Gaming', players: [], wins: 5, losses: 2, points: 15, createdAt: '' },
        { id: '2', name: 'FURIA Esports', players: [], wins: 4, losses: 3, points: 12, createdAt: '' },
        { id: '3', name: 'MIBR', players: [], wins: 3, losses: 4, points: 9, createdAt: '' },
        { id: '4', name: 'Imperial Esports', players: [], wins: 6, losses: 1, points: 18, createdAt: '' }
      ]

      const mockLocations: Location[] = [
        { id: '1', name: 'Arena Principal', address: 'São Paulo, SP', capacity: 100, available: true },
        { id: '2', name: 'Arena Secundária', address: 'Rio de Janeiro, RJ', capacity: 50, available: true },
        { id: '3', name: 'Arena Norte', address: 'Belo Horizonte, MG', capacity: 75, available: true }
      ]

      const mockChampionships: Championship[] = [
        {
          id: '1',
          name: 'Liga Principal 2024',
          type: 'MATA_MATA' as any,
          teams: [],
          matches: [],
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-06-30T00:00:00Z',
          isActive: true,
          maxTeams: 16
        }
      ]

      setTeams(mockTeams)
      setLocations(mockLocations)
      setChampionships(mockChampionships)

      if (!isNewMatch) {
        const mockMatch: Match = {
          id: matchId!,
          teamA: mockTeams[0],
          teamB: mockTeams[1],
          location: mockLocations[0],
          scheduledDate: '2026-03-10T19:00:00Z',
          status: MatchStatus.AGENDADA,
          placarCT: 0,
          placarTR: 0,
          championshipId: '1',
          round: 1
        }

        setFormData({
          teamAId: mockMatch.teamA.id,
          teamBId: mockMatch.teamB.id,
          locationId: mockMatch.location.id,
          championshipId: mockMatch.championshipId,
          scheduledDate: mockMatch.scheduledDate.slice(0, 16),
          placarCT: mockMatch.placarCT || 0,
          placarTR: mockMatch.placarTR || 0,
          status: mockMatch.status,
          round: mockMatch.round || 1
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.teamAId === formData.teamBId) {
      alert('Os times devem ser diferentes!')
      return
    }

    try {
      setSaving(true)

      if (isNewMatch) {
        // ⚠️ SPRING BOOT INTEGRATION POINT
        // const response = await fetch('/api/admin/matches', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // })
        console.log('Criando nova partida:', formData)
      } else {
        // ⚠️ SPRING BOOT INTEGRATION POINT
        // await fetch(`/api/admin/matches/${matchId}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(formData)
        // })
        console.log('Atualizando partida:', { matchId, ...formData })
      }

      navigate('/admin/matches')
    } catch (error) {
      console.error('Erro ao salvar partida:', error)
      alert('Erro ao salvar partida. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleStatusChange = (newStatus: MatchStatus) => {
    setFormData(prev => ({ ...prev, status: newStatus }))
  }

  const getStatusButton = (status: MatchStatus, currentStatus: MatchStatus) => {
    const isActive = status === currentStatus
    const styles = {
      [MatchStatus.AGENDADA]: 'bg-yellow-500 hover:bg-yellow-600',
      [MatchStatus.EM_ANDAMENTO]: 'bg-blue-500 hover:bg-blue-600',
      [MatchStatus.CONCLUIDA]: 'bg-green-500 hover:bg-green-600'
    }

    const icons = {
      [MatchStatus.AGENDADA]: Calendar,
      [MatchStatus.EM_ANDAMENTO]: Play,
      [MatchStatus.CONCLUIDA]: CheckCircle
    }

    const labels = {
      [MatchStatus.AGENDADA]: 'Agendada',
      [MatchStatus.EM_ANDAMENTO]: 'Iniciar',
      [MatchStatus.CONCLUIDA]: 'Finalizar'
    }

    const Icon = icons[status]

    return (
      <button
        type="button"
        onClick={() => handleStatusChange(status)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          isActive
            ? `${styles[status]} text-white`
            : 'bg-dark-700 hover:bg-dark-600 text-gray-300'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span>{labels[status]}</span>
      </button>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  const teamA = teams.find(t => t.id === formData.teamAId)
  const teamB = teams.find(t => t.id === formData.teamBId)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/matches')}
          className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {isNewMatch ? 'Nova Partida' : 'Editar Partida'}
          </h1>
          <p className="text-gray-400">
            {isNewMatch
              ? 'Configure uma nova partida para o campeonato'
              : 'Atualize informações e resultados da partida'
            }
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Team Selection */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team A */}
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Time A</span>
            </h3>

            <select
              value={formData.teamAId}
              onChange={(e) => setFormData(prev => ({ ...prev, teamAId: e.target.value }))}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 mb-4"
              required
            >
              <option value="">Selecione o Time A</option>
              {teams.map(team => (
                <option key={team.id} value={team.id} disabled={team.id === formData.teamBId}>
                  {team.name} ({team.wins}V - {team.losses}D)
                </option>
              ))}
            </select>

            {teamA && (
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-white font-medium">{teamA.name}</p>
                <p className="text-gray-400 text-sm">{teamA.points} pontos - {teamA.wins} vitórias</p>
              </div>
            )}
          </div>

          {/* Team B */}
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Time B</span>
            </h3>

            <select
              value={formData.teamBId}
              onChange={(e) => setFormData(prev => ({ ...prev, teamBId: e.target.value }))}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500 mb-4"
              required
            >
              <option value="">Selecione o Time B</option>
              {teams.map(team => (
                <option key={team.id} value={team.id} disabled={team.id === formData.teamAId}>
                  {team.name} ({team.wins}V - {team.losses}D)
                </option>
              ))}
            </select>

            {teamB && (
              <div className="bg-dark-700 rounded-lg p-4">
                <p className="text-white font-medium">{teamB.name}</p>
                <p className="text-gray-400 text-sm">{teamB.points} pontos - {teamB.wins} vitórias</p>
              </div>
            )}
          </div>
        </div>

        {/* Match Settings */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Configurações da Partida</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Championship */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Trophy className="w-4 h-4 inline mr-2" />
                Campeonato
              </label>
              <select
                value={formData.championshipId}
                onChange={(e) => setFormData(prev => ({ ...prev, championshipId: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                required
              >
                <option value="">Selecione o campeonato</option>
                {championships.map(championship => (
                  <option key={championship.id} value={championship.id}>
                    {championship.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Local
              </label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData(prev => ({ ...prev, locationId: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                required
              >
                <option value="">Selecione o local</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name} - {location.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Scheduled Date */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Data e Hora
              </label>
              <input
                type="datetime-local"
                value={formData.scheduledDate}
                onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                required
              />
            </div>
          </div>
        </div>

        {/* Status and Score */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Status e Placar</h3>

          {/* Status Buttons */}
          <div className="mb-6">
            <p className="text-white text-sm font-medium mb-3">Status da Partida</p>
            <div className="flex flex-wrap gap-3">
              {Object.values(MatchStatus).map(status => (
                <div key={status}>
                  {getStatusButton(status, formData.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Score */}
          {(formData.status === MatchStatus.EM_ANDAMENTO || formData.status === MatchStatus.CONCLUIDA) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Placar {teamA?.name || 'Time A'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={formData.placarCT}
                  onChange={(e) => setFormData(prev => ({ ...prev, placarCT: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Placar {teamB?.name || 'Time B'}
                </label>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={formData.placarTR}
                  onChange={(e) => setFormData(prev => ({ ...prev, placarTR: parseInt(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/matches')}
            className="px-6 py-3 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Salvando...' : 'Salvar Partida'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
