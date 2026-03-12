import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import type { Match, Team, Championship, Location } from '../../types'
import { MatchStatus } from '../../types'
import { matchesService, teamsService, championshipsService, locationsService } from '../../services/api'
import {
  ArrowLeft,
  Save,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Target,
  Swords,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

export function AdminMatchEdit() {
  const { matchId } = useParams<{ matchId: string }>()
  const navigate = useNavigate()
  const isNew = matchId === 'new'

  const [teams, setTeams] = useState<Team[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [teamAId, setTeamAId] = useState<number | ''>('')
  const [teamBId, setTeamBId] = useState<number | ''>('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [championshipId, setChampionshipId] = useState<number | ''>('')
  const [locationId, setLocationId] = useState<number | ''>('')
  const [status, setStatus] = useState<MatchStatus>(MatchStatus.AGENDADA)
  const [placarCT, setPlacarCT] = useState<number>(0)
  const [placarTR, setPlacarTR] = useState<number>(0)

  const [match, setMatch] = useState<Match | null>(null)

  // Message system
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    loadData()
  }, [matchId])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [teamsData, championshipsData, locationsData] = await Promise.all([
        teamsService.getAll(),
        championshipsService.getAll(),
        locationsService.getAll()
      ])
      setTeams(teamsData)
      setChampionships(championshipsData)
      setLocations(locationsData)

      if (!isNew && matchId) {
        const matchData = await matchesService.getById(Number(matchId))
        setMatch(matchData)
        setTeamAId(matchData.teamA?.id ?? '')
        setTeamBId(matchData.teamB?.id ?? '')
        setScheduledDate(matchData.scheduledDate ? matchData.scheduledDate.slice(0, 16) : '')
        setLocationId(matchData.location?.id ?? '')
        setStatus(matchData.status)
        setPlacarCT(matchData.placarCT ?? 0)
        setPlacarTR(matchData.placarTR ?? 0)
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamAId || !teamBId) return

    try {
      setSaving(true)

      if (isNew) {
        await matchesService.create({
          teamAId: Number(teamAId),
          teamBId: Number(teamBId),
          scheduledDate: scheduledDate || undefined,
          championshipId: championshipId ? Number(championshipId) : undefined,
          locationId: locationId ? Number(locationId) : undefined,
          status
        })
      } else if (matchId) {
        const numericId = Number(matchId)

        // Se tem placar, atualiza o score
        if (placarCT > 0 || placarTR > 0) {
          const scoreStatus = (placarCT >= 13 || placarTR >= 13) ? MatchStatus.CONCLUIDA : MatchStatus.EM_ANDAMENTO
          await matchesService.updateScore(numericId, {
            placarCT,
            placarTR,
            status: status === MatchStatus.AGENDADA ? scoreStatus : status
          })
        } else {
          await matchesService.update(numericId, {
            teamAId: Number(teamAId),
            teamBId: Number(teamBId),
            scheduledDate: scheduledDate || undefined,
            championshipId: championshipId ? Number(championshipId) : undefined,
            locationId: locationId ? Number(locationId) : undefined,
            status
          })
        }
      }

      showMessage('Partida salva com sucesso!', 'success')
      navigate('/admin/matches')
    } catch (error) {
      console.error('Erro ao salvar partida:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar partida. Verifique os dados e tente novamente.'
      showMessage(errorMessage, 'error')
    } finally {
      setSaving(false)
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
      {/* Message */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center space-x-2 ${
          message.type === 'success' 
            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/admin/matches')}
          className="p-2 bg-dark-700 hover:bg-dark-600 text-gray-400 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-white">
            {isNew ? 'Nova Partida' : 'Editar Partida'}
          </h1>
          <p className="text-gray-400">
            {isNew ? 'Crie uma nova partida' : `Editando partida #${matchId}`}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Teams Selection */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-primary-500" />
            <span>Times</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time A *
              </label>
              <select
                value={teamAId}
                onChange={(e) => setTeamAId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                required
              >
                <option value="">Selecione o Time A</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id} disabled={team.id === teamBId}>
                    {team.name} (Rank #{team.ranking})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time B *
              </label>
              <select
                value={teamBId}
                onChange={(e) => setTeamBId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                required
              >
                <option value="">Selecione o Time B</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id} disabled={team.id === teamAId}>
                    {team.name} (Rank #{team.ranking})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {teamAId && teamBId && (
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-4 bg-dark-700 px-6 py-3 rounded-lg">
                <span className="text-white font-semibold">
                  {teams.find(t => t.id === teamAId)?.name}
                </span>
                <Swords className="w-6 h-6 text-primary-500" />
                <span className="text-white font-semibold">
                  {teams.find(t => t.id === teamBId)?.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Match Details */}
        <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            <span>Detalhes da Partida</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Data e Hora
              </label>
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MatchStatus)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value={MatchStatus.AGENDADA}>Agendada</option>
                <option value={MatchStatus.EM_ANDAMENTO}>Em Andamento</option>
                <option value={MatchStatus.CONCLUIDA}>Concluída</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Campeonato (opcional)
              </label>
              <select
                value={championshipId}
                onChange={(e) => setChampionshipId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Nenhum (amistoso)</option>
                {championships.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.nome} ({c.tipo})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Local (opcional)
              </label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
              >
                <option value="">Selecione um local</option>
                {locations.map(location => (
                  <option key={location.id} value={location.id}>
                    {location.name || location.nome} - {location.cidade}, {location.pais}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Score */}
        {!isNew && (
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Target className="w-5 h-5 text-primary-500" />
              <span>Placar</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Placar {teams.find(t => t.id === teamAId)?.name || 'Time A'} (CT)
                </label>
                <input
                  type="number"
                  min={0}
                  max={16}
                  value={placarCT}
                  onChange={(e) => setPlacarCT(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Placar {teams.find(t => t.id === teamBId)?.name || 'Time B'} (TR)
                </label>
                <input
                  type="number"
                  min={0}
                  max={16}
                  value={placarTR}
                  onChange={(e) => setPlacarTR(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <p className="text-gray-500 text-sm">
              CS2: O placar máximo por time é 16. O primeiro time a atingir 13 rounds vence.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/matches')}
            className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || !teamAId || !teamBId}
            className="flex items-center space-x-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Salvando...' : (isNew ? 'Criar Partida' : 'Salvar Alterações')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
