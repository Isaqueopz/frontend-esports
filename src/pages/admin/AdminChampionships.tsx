import { useState, useEffect } from 'react'
import type { Championship, Team, Location } from '../../types'
import { ChampionshipType, MatchStatus } from '../../types'
import { championshipsService, teamsService, locationsService, matchesService } from '../../services/api'
import {
  Plus,
  Trash2,
  Trophy,
  Play,
  Users,
  Search,
  X,
  Save,
  Swords,
  CheckCircle2,
  Clock,
  Zap,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  MapPin,
  Calendar,
  RefreshCw
} from 'lucide-react'

export function AdminChampionships() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  // New Championship Modal
  const [showModal, setShowModal] = useState(false)
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<ChampionshipType>(ChampionshipType.MATA_MATA)
  const [selectedTeamIds, setSelectedTeamIds] = useState<number[]>([])
  const [teamSearch, setTeamSearch] = useState('')
  const [allowMultipleMatches, setAllowMultipleMatches] = useState(false)
  const [saving, setSaving] = useState(false)

  // Scheduling
  const [locations, setLocations] = useState<Location[]>([])
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [scheduleChampId, setScheduleChampId] = useState<number | null>(null)
  const [scheduleAction, setScheduleAction] = useState<'start' | 'quartas' | 'semis' | 'final' | 'reschedule'>('start')
  const [scheduleStartDate, setScheduleStartDate] = useState('')
  const [scheduleInterval, setScheduleInterval] = useState(120)
  const [scheduleLocationIds, setScheduleLocationIds] = useState<number[]>([])
  const [scheduling, setScheduling] = useState(false)

  // Message
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 5000)
      return () => clearTimeout(t)
    }
  }, [message])

  const loadData = async () => {
    try {
      setLoading(true)
      const [champsData, teamsData, locationsData] = await Promise.all([
        championshipsService.getAll(),
        teamsService.getAll(),
        locationsService.getAll()
      ])
      setChampionships(champsData)
      setTeams(teamsData)
      setLocations(locationsData)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type })
  }

  const getStatusBadge = (status: MatchStatus) => {
    const styles = {
      [MatchStatus.AGENDADA]: 'bg-yellow-500/20 text-yellow-500',
      [MatchStatus.EM_ANDAMENTO]: 'bg-blue-500/20 text-blue-500',
      [MatchStatus.CONCLUIDA]: 'bg-green-500/20 text-green-500'
    }
    const labels = {
      [MatchStatus.AGENDADA]: 'Agendado',
      [MatchStatus.EM_ANDAMENTO]: 'Em Andamento',
      [MatchStatus.CONCLUIDA]: 'Concluído'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    )
  }

  const getTypeBadge = (tipoVal: ChampionshipType) => {
    if (tipoVal === ChampionshipType.MATA_MATA) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
          Mata-Mata
        </span>
      )
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400">
        Pontos Corridos
      </span>
    )
  }

  // Scheduling functions
  const openScheduleModal = (champId: number, action: 'start' | 'quartas' | 'semis' | 'final' | 'reschedule') => {
    setScheduleChampId(champId)
    setScheduleAction(action)

    // Calcula a data sugerida com base na última partida existente
    let suggestedDate: Date
    const champ = championships.find(c => c.id === champId)

    if (action !== 'start' && champ) {
      // Pega a data mais recente de todas as partidas já existentes
      const allDates: number[] = []
      for (const m of (champ.tabela || [])) {
        if (m.scheduledDate) allDates.push(new Date(m.scheduledDate).getTime())
      }
      for (const n of (champ.bracketNodes || [])) {
        if (n.match?.scheduledDate) allDates.push(new Date(n.match.scheduledDate).getTime())
      }

      if (allDates.length > 0) {
        // Próxima rodada começa 1 dia após a última partida da rodada anterior
        const lastDate = new Date(Math.max(...allDates))
        suggestedDate = new Date(lastDate)
        suggestedDate.setDate(suggestedDate.getDate() + 1)
        suggestedDate.setHours(10, 0, 0, 0)
      } else {
        suggestedDate = new Date()
        suggestedDate.setDate(suggestedDate.getDate() + 1)
        suggestedDate.setHours(10, 0, 0, 0)
      }
    } else {
      suggestedDate = new Date()
      suggestedDate.setDate(suggestedDate.getDate() + 1)
      suggestedDate.setHours(10, 0, 0, 0)
    }

    setScheduleStartDate(suggestedDate.toISOString().slice(0, 16))
    setScheduleInterval(120)
    setScheduleLocationIds(locations.map(l => l.id))
    setShowScheduleModal(true)
  }

  const toggleScheduleLocation = (locId: number) => {
    setScheduleLocationIds(prev =>
      prev.includes(locId)
        ? prev.filter(id => id !== locId)
        : [...prev, locId]
    )
  }

  const handleScheduleSubmit = async () => {
    if (!scheduleChampId) return
    if (scheduleLocationIds.length === 0) {
      showMessage('Selecione pelo menos um local para as partidas.', 'error')
      return
    }
    if (!scheduleStartDate) {
      showMessage('Defina a data de início das partidas.', 'error')
      return
    }

    try {
      setScheduling(true)

      // 1) Executa a ação correspondente
      const actionLabels = {
        start: 'Iniciando campeonato...',
        quartas: 'Finalizando quartas...',
        semis: 'Finalizando semifinais...',
        final: 'Finalizando final...',
        reschedule: 'Reagendando...'
      }
      console.log(`🎯 ${actionLabels[scheduleAction]}`)

      // Guarda os IDs antes da ação para saber quais são novas
      let existingMatchIds = new Set<number>()
      if (scheduleAction !== 'start') {
        const beforeChamp = await championshipsService.getById(scheduleChampId)
        for (const n of (beforeChamp.bracketNodes || [])) {
          if (n.match) existingMatchIds.add(n.match.id)
        }
        for (const m of (beforeChamp.tabela || [])) {
          existingMatchIds.add(m.id)
        }
      }

      switch (scheduleAction) {
        case 'start':
          await championshipsService.start(scheduleChampId)
          break
        case 'quartas':
          await championshipsService.finishQuartas(scheduleChampId)
          break
        case 'semis':
          await championshipsService.finishSemifinais(scheduleChampId)
          break
        case 'final':
          await championshipsService.finishFinal(scheduleChampId)
          break
        case 'reschedule':
          break // Nada a executar, só reagenda
      }

      // 2) Busca campeonato atualizado
      const freshChamp = await championshipsService.getById(scheduleChampId)

      // 3) Coleta partidas: de tabela + de bracketNodes
      const allMatches: import('../../types').Match[] = []
      const seenIds = new Set<number>()

      for (const m of (freshChamp.tabela || [])) {
        if (m.teamA && m.teamB && !seenIds.has(m.id)) {
          allMatches.push(m)
          seenIds.add(m.id)
        }
      }
      for (const node of (freshChamp.bracketNodes || [])) {
        if (node.match && node.match.teamA && node.match.teamB && !seenIds.has(node.match.id)) {
          allMatches.push(node.match)
          seenIds.add(node.match.id)
        }
      }

      // Filtra: se foi quartas/semis/final, agenda apenas as partidas NOVAS da próxima rodada
      // Se foi start ou reschedule, agenda todas
      const matchesToSchedule = (scheduleAction === 'start' || scheduleAction === 'reschedule')
        ? allMatches
        : allMatches.filter(m => !existingMatchIds.has(m.id))

      console.log(`📋 ${freshChamp.nome} | total: ${allMatches.length} | a agendar: ${matchesToSchedule.length}`)

      if (matchesToSchedule.length === 0) {
        showMessage('Ação executada, mas nenhuma partida nova para agendar.', 'success')
        await loadData()
        return
      }

      // 4) Distribui horários e locais (janela: 09:00 - 23:00)
      const startTime = new Date(scheduleStartDate)
      const intervalMs = scheduleInterval * 60 * 1000
      const locIds = scheduleLocationIds
      let currentTime = new Date(startTime)
      let locationIndex = 0
      let successCount = 0

      const advanceTime = () => {
        if (freshChamp.allowMultipleMatches) {
          locationIndex++
          if (locationIndex >= locIds.length) {
            currentTime = new Date(currentTime.getTime() + intervalMs)
            locationIndex = 0
          }
        } else {
          locationIndex = (locationIndex + 1) % locIds.length
          currentTime = new Date(currentTime.getTime() + intervalMs)
        }
        // Se passou das 23:00, pula para o dia seguinte às 09:00
        if (currentTime.getHours() >= 23) {
          currentTime.setDate(currentTime.getDate() + 1)
          currentTime.setHours(9, 0, 0, 0)
          locationIndex = 0
        }
      }

      for (const match of matchesToSchedule) {
        const locId = locIds[locationIndex % locIds.length]
        const locName = locations.find(l => l.id === locId)?.name || String(locId)

        console.log(`  ⚽ #${match.id} ${match.teamA!.name} vs ${match.teamB!.name} → ${currentTime.toLocaleString('pt-BR')} @ ${locName}`)

        try {
          await matchesService.update(match.id, {
            teamAId: match.teamA!.id,
            teamBId: match.teamB!.id,
            scheduledDate: currentTime.toISOString(),
            locationId: locId,
            championshipId: freshChamp.id,
            status: match.status,
            ...(match.placarCT != null ? { placarCT: match.placarCT } : {}),
            ...(match.placarTR != null ? { placarTR: match.placarTR } : {}),
          } as any)
          successCount++
        } catch (err) {
          console.error(`❌ Partida #${match.id}:`, err)
        }

        advanceTime()
      }

      showMessage(
        successCount > 0
          ? `${successCount} partidas agendadas com sucesso!`
          : 'Nenhuma partida foi agendada. Verifique o console (F12).',
        successCount > 0 ? 'success' : 'error'
      )
      await loadData()
    } catch (error) {
      console.error(error)
      showMessage('Erro ao executar ação. Verifique o console.', 'error')
    } finally {
      setScheduling(false)
      setShowScheduleModal(false)
    }
  }

  // Championship actions

  const handlePlay = async (id: number) => {
    try {
      setActionLoading(id)
      const result = await championshipsService.play(id)
      showMessage(typeof result === 'string' ? result : 'Rodada simulada!', 'success')
      await loadData()
    } catch (error) {
      console.error(error)
      showMessage('Erro ao simular rodada.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFinishQuartas = async (id: number) => {
    try {
      setActionLoading(id)
      const result = await championshipsService.finishQuartas(id)
      showMessage(typeof result === 'string' ? result : 'Quartas finalizadas!', 'success')
      await loadData()
    } catch (error) {
      console.error(error)
      showMessage('Erro ao finalizar quartas.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFinishSemifinais = async (id: number) => {
    try {
      setActionLoading(id)
      const result = await championshipsService.finishSemifinais(id)
      showMessage(typeof result === 'string' ? result : 'Semifinais finalizadas!', 'success')
      await loadData()
    } catch (error) {
      console.error(error)
      showMessage('Erro ao finalizar semifinais.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleFinishFinal = async (id: number) => {
    try {
      setActionLoading(id)
      const result = await championshipsService.finishFinal(id)
      showMessage(typeof result === 'string' ? result : 'Final finalizada!', 'success')
      await loadData()
    } catch (error) {
      console.error(error)
      showMessage('Erro ao finalizar final.', 'error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este campeonato?')) return
    try {
      await championshipsService.delete(id)
      setChampionships(prev => prev.filter(c => c.id !== id))
      showMessage('Campeonato excluído.', 'success')
    } catch (error) {
      console.error(error)
      showMessage('Erro ao excluir campeonato.', 'error')
    }
  }

  // Create championship
  const openNewModal = () => {
    setNome('')
    setTipo(ChampionshipType.MATA_MATA)
    setSelectedTeamIds([])
    setTeamSearch('')
    setAllowMultipleMatches(false)
    setShowModal(true)
  }

  const toggleTeamSelection = (teamId: number) => {
    setSelectedTeamIds(prev =>
      prev.includes(teamId)
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    )
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return
    if (tipo === ChampionshipType.MATA_MATA && selectedTeamIds.length !== 8) {
      showMessage('Mata-Mata requer exatamente 8 times.', 'error')
      return
    }
    if (selectedTeamIds.length < 2) {
      showMessage('Selecione pelo menos 2 times.', 'error')
      return
    }

    try {
      setSaving(true)
      await championshipsService.create({
        nome: nome.trim(),
        tipo,
        teamIds: selectedTeamIds,
        allowMultipleMatches
      })
      setShowModal(false)
      showMessage('Campeonato criado com sucesso!', 'success')
      await loadData()
    } catch (error) {
      console.error(error)
      showMessage('Erro ao criar campeonato.', 'error')
    } finally {
      setSaving(false)
    }
  }

  const filteredTeamsForSelect = teams.filter(t =>
    t.name.toLowerCase().includes(teamSearch.toLowerCase())
  )

  const renderActions = (champ: Championship) => {
    const isLoading = actionLoading === champ.id
    const buttons: React.ReactNode[] = []

    if (champ.status === MatchStatus.AGENDADA) {
      buttons.push(
        <button
          key="start"
          onClick={() => openScheduleModal(champ.id, 'start')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Iniciar e Agendar</span>
        </button>
      )
    }

    if (champ.status === MatchStatus.EM_ANDAMENTO) {
      if (champ.tipo === ChampionshipType.PONTOS_CORRIDOS) {
        buttons.push(
          <button
            key="play"
            onClick={() => handlePlay(champ.id)}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
          >
            <Zap className="w-4 h-4" />
            <span>Simular Rodada</span>
          </button>
        )
      }

      // Reagendar button for any in-progress championship
      buttons.push(
        <button
          key="reschedule"
          onClick={() => openScheduleModal(champ.id, 'reschedule')}
          disabled={isLoading}
          className="flex items-center space-x-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reagendar</span>
        </button>
      )

      if (champ.tipo === ChampionshipType.MATA_MATA) {
        buttons.push(
          <button
            key="quartas"
            onClick={() => openScheduleModal(champ.id, 'quartas')}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
          >
            <Swords className="w-4 h-4" />
            <span>Finalizar Quartas</span>
          </button>,
          <button
            key="semis"
            onClick={() => openScheduleModal(champ.id, 'semis')}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1.5 bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
          >
            <Swords className="w-4 h-4" />
            <span>Finalizar Semis</span>
          </button>,
          <button
            key="final"
            onClick={() => handleFinishFinal(champ.id)}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-sm transition-colors"
          >
            <Trophy className="w-4 h-4" />
            <span>Finalizar Final</span>
          </button>
        )
      }
    }

    return buttons
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Campeonatos
          </h1>
          <p className="text-gray-400">
            Crie e gerencie campeonatos de CS2
          </p>
        </div>

        <button
          onClick={openNewModal}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Campeonato</span>
        </button>
      </div>

      {/* Championships List */}
      <div className="space-y-4">
        {championships.length > 0 ? (
          championships.map((champ) => (
            <div key={champ.id} className="bg-dark-800 rounded-lg border border-dark-700">
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === champ.id ? null : champ.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{champ.nome}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        {getTypeBadge(champ.tipo)}
                        {getStatusBadge(champ.status)}
                        {champ.allowMultipleMatches ? (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400" title="Permite múltiplas partidas no mesmo horário/local">
                            Multi-Partida
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400" title="Uma partida por horário/local">
                            Single-Partida
                          </span>
                        )}
                        <span className="text-gray-400 text-sm flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{champ.times.length} times</span>
                        </span>
                        <span className="text-gray-400 text-sm">
                          {champ.tabela.length} partidas
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                      {renderActions(champ)}
                      <button
                        onClick={() => handleDelete(champ.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Excluir campeonato"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    {expandedId === champ.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {expandedId === champ.id && (
                <div className="px-6 pb-6 border-t border-dark-700 pt-4">
                  {/* Teams */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Times Participantes</h4>
                    <div className="flex flex-wrap gap-2">
                      {champ.times.map(team => (
                        <span
                          key={team.id}
                          className="px-3 py-1 bg-dark-700 rounded-full text-sm text-gray-300"
                        >
                          {team.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Recent Matches */}
                  {champ.tabela.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">
                        Partidas ({champ.tabela.length})
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {champ.tabela.slice(0, 10).map(match => (
                          <div
                            key={match.id}
                            className="flex items-center justify-between bg-dark-700 rounded-lg px-4 py-2 text-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-white font-medium">{match.teamA?.name ?? 'A definir'}</span>
                              {match.status === MatchStatus.CONCLUIDA ? (
                                <span className="text-primary-500 font-bold">
                                  {match.placarCT} - {match.placarTR}
                                </span>
                              ) : (
                                <span className="text-gray-500">vs</span>
                              )}
                              <span className="text-white font-medium">{match.teamB?.name ?? 'A definir'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {match.location && (
                                <span className="px-2 py-0.5 bg-dark-600 rounded text-xs text-gray-400 flex items-center space-x-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{match.location.name || match.location.nome}</span>
                                </span>
                              )}
                              {match.round && (
                                <span className="px-2 py-0.5 bg-dark-600 rounded text-xs text-gray-400">
                                  {match.round}
                                </span>
                              )}
                              {getStatusBadge(match.status)}
                            </div>
                          </div>
                        ))}
                        {champ.tabela.length > 10 && (
                          <p className="text-gray-500 text-xs text-center py-2">
                            ... e mais {champ.tabela.length - 10} partidas
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
            <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Nenhum campeonato encontrado</p>
            <p className="text-gray-500 text-sm mb-4">
              Crie seu primeiro campeonato para começar
            </p>
            <button
              onClick={openNewModal}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Criar Campeonato</span>
            </button>
          </div>
        )}
      </div>

      {/* Create Championship Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg border border-dark-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-xl font-bold text-white">Novo Campeonato</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Campeonato *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: CS2 Major 2025"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setTipo(ChampionshipType.MATA_MATA)}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      tipo === ChampionshipType.MATA_MATA
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                    }`}
                  >
                    <Swords className={`w-8 h-8 mx-auto mb-2 ${
                      tipo === ChampionshipType.MATA_MATA ? 'text-primary-500' : 'text-gray-400'
                    }`} />
                    <p className="text-white font-semibold">Mata-Mata</p>
                    <p className="text-gray-400 text-xs mt-1">Requer 8 times</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTipo(ChampionshipType.PONTOS_CORRIDOS)}
                    className={`p-4 rounded-lg border-2 text-center transition-colors ${
                      tipo === ChampionshipType.PONTOS_CORRIDOS
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-dark-600 bg-dark-700 hover:border-dark-500'
                    }`}
                  >
                    <Trophy className={`w-8 h-8 mx-auto mb-2 ${
                      tipo === ChampionshipType.PONTOS_CORRIDOS ? 'text-primary-500' : 'text-gray-400'
                    }`} />
                    <p className="text-white font-semibold">Pontos Corridos</p>
                    <p className="text-gray-400 text-xs mt-1">2+ times</p>
                  </button>
                </div>
              </div>

              {/* Validation Settings */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Configurações de Validação
                </label>
                <div className="bg-dark-700 rounded-lg p-4 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <span className="text-white text-sm font-medium">Permitir múltiplas partidas simultâneas</span>
                      <p className="text-gray-400 text-xs mt-1">
                        Quando desabilitado: um local não pode receber duas partidas no mesmo horário.<br/>
                        Quando habilitado: permite múltiplas partidas no mesmo local simultaneamente.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={allowMultipleMatches}
                      onChange={(e) => setAllowMultipleMatches(e.target.checked)}
                      className="w-5 h-5 text-primary-500 bg-dark-800 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                    />
                  </label>
                </div>
              </div>

              {/* Team Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Selecionar Times * ({selectedTeamIds.length} selecionados
                  {tipo === ChampionshipType.MATA_MATA && ' / 8 necessários'})
                </label>

                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={teamSearch}
                    onChange={(e) => setTeamSearch(e.target.value)}
                    placeholder="Buscar times..."
                    className="w-full pl-9 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 bg-dark-700 rounded-lg p-2">
                  {filteredTeamsForSelect.map(team => (
                    <label
                      key={team.id}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                        selectedTeamIds.includes(team.id)
                          ? 'bg-primary-500/20 border border-primary-500/30'
                          : 'hover:bg-dark-600'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedTeamIds.includes(team.id)}
                          onChange={() => toggleTeamSelection(team.id)}
                          className="rounded border-dark-500 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-white text-sm">{team.name}</span>
                      </div>
                      <span className="text-gray-400 text-xs">Rank #{team.ranking}</span>
                    </label>
                  ))}
                </div>

                {tipo === ChampionshipType.MATA_MATA && selectedTeamIds.length !== 8 && selectedTeamIds.length > 0 && (
                  <p className="text-yellow-500 text-xs mt-2 flex items-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Mata-Mata requer exatamente 8 times. Selecionados: {selectedTeamIds.length}</span>
                  </p>
                )}
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
                  disabled={saving || !nome.trim() || selectedTeamIds.length < 2}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? 'Criando...' : 'Criar Campeonato'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg border border-dark-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-xl font-bold text-white">
                {{
                  start: 'Iniciar e Agendar Partidas',
                  quartas: 'Finalizar Quartas e Agendar Semis',
                  semis: 'Finalizar Semis e Agendar Final',
                  final: 'Finalizar Final',
                  reschedule: 'Reagendar Partidas',
                }[scheduleAction]}
              </h2>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-400 text-sm">
                  {{
                    start: 'O campeonato será iniciado e as partidas das quartas serão agendadas automaticamente.',
                    quartas: 'As quartas serão finalizadas e as semifinais serão agendadas com horários e locais.',
                    semis: 'As semifinais serão finalizadas e a final será agendada.',
                    final: 'A final será finalizada.',
                    reschedule: 'As partidas pendentes serão reagendadas com novos horários e locais.',
                  }[scheduleAction]}
                </p>
              </div>

              {(() => {
                const champ = championships.find(c => c.id === scheduleChampId)
                const isMulti = champ?.allowMultipleMatches
                if (scheduleAction === 'semis') return null // Final é só 1 partida, não precisa de info multi
                return (
                  <div className={`rounded-lg p-3 text-xs ${isMulti ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-orange-500/10 border border-orange-500/20 text-orange-400'}`}>
                    {isMulti ? (
                      <>
                        <strong>Multi-Partida:</strong> Múltiplas partidas podem ocorrer no mesmo horário em locais diferentes.
                        Com {scheduleLocationIds.length} local(is), até {scheduleLocationIds.length} partidas serão agendadas por horário.
                      </>
                    ) : (
                      <>
                        <strong>Single-Partida:</strong> Apenas uma partida por horário.
                        Cada partida terá um horário único, com locais sendo rotacionados.
                      </>
                    )}
                  </div>
                )
              })()}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {scheduleAction === 'semis' ? 'Data e Hora da Final *' : 'Data e Hora de Início *'}
                </label>
                <input
                  type="datetime-local"
                  value={scheduleStartDate}
                  onChange={(e) => setScheduleStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                />
              </div>

              {scheduleAction !== 'semis' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Intervalo entre Partidas
                </label>
                <select
                  value={scheduleInterval}
                  onChange={(e) => setScheduleInterval(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:border-primary-500"
                >
                  <option value={60}>1 hora</option>
                  <option value={90}>1h30min</option>
                  <option value={120}>2 horas</option>
                  <option value={180}>3 horas</option>
                  <option value={240}>4 horas</option>
                  <option value={1440}>1 dia (24h)</option>
                </select>
              </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Locais Disponíveis * ({scheduleLocationIds.length} selecionados)
                </label>
                {locations.length > 0 ? (
                  <div className="max-h-40 overflow-y-auto space-y-1 bg-dark-700 rounded-lg p-2">
                    {locations.map(loc => (
                      <label
                        key={loc.id}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                          scheduleLocationIds.includes(loc.id)
                            ? 'bg-primary-500/20 border border-primary-500/30'
                            : 'hover:bg-dark-600'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={scheduleLocationIds.includes(loc.id)}
                            onChange={() => toggleScheduleLocation(loc.id)}
                            className="rounded border-dark-500 text-primary-500 focus:ring-primary-500"
                          />
                          <span className="text-white text-sm">{loc.name}</span>
                        </div>
                        <span className="text-gray-400 text-xs">{loc.cidade}, {loc.pais}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="bg-dark-700 rounded-lg p-4 text-center">
                    <p className="text-gray-400 text-sm">Nenhum local cadastrado.</p>
                    <p className="text-gray-500 text-xs mt-1">Cadastre locais em "Locais" antes de agendar.</p>
                  </div>
                )}
              </div>

              {/* Preview */}
              {scheduleAction !== 'semis' && scheduleStartDate && scheduleLocationIds.length > 0 && (
                <div className="bg-dark-700 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-300 mb-2">Prévia do Agendamento</h4>
                  {(() => {
                    const champ = championships.find(c => c.id === scheduleChampId)
                    // Count matches from tabela + bracketNodes
                    const seenIds = new Set<number>()
                    let count = 0
                    for (const m of (champ?.tabela || [])) {
                      if (m.teamA && m.teamB && !seenIds.has(m.id)) { count++; seenIds.add(m.id) }
                    }
                    for (const n of (champ?.bracketNodes || [])) {
                      if (n.match?.teamA && n.match?.teamB && !seenIds.has(n.match.id)) { count++; seenIds.add(n.match.id) }
                    }
                    // If not started yet, estimate
                    const matchCount = count > 0
                      ? count
                      : (champ?.tipo === ChampionshipType.MATA_MATA
                        ? 4
                        : Math.floor(((champ?.times.length || 0) * ((champ?.times.length || 0) - 1)) / 2))
                    const isMulti = champ?.allowMultipleMatches
                    const locCount = scheduleLocationIds.length

                    let totalSlots: number
                    if (isMulti) {
                      totalSlots = Math.ceil(matchCount / locCount)
                    } else {
                      totalSlots = matchCount
                    }

                    const start = new Date(scheduleStartDate)
                    const intervalMin = scheduleInterval
                    const fmt = (d: Date) => d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

                    // Simula a distribuição respeitando janela 09:00-23:00
                    let simTime = new Date(start)
                    let simLocIdx = 0
                    for (let i = 0; i < totalSlots; i++) {
                      if (isMulti) {
                        simLocIdx++
                        if (simLocIdx >= locCount) {
                          simTime = new Date(simTime.getTime() + intervalMin * 60 * 1000)
                          simLocIdx = 0
                        }
                      } else {
                        simLocIdx = (simLocIdx + 1) % locCount
                        simTime = new Date(simTime.getTime() + intervalMin * 60 * 1000)
                      }
                      if (simTime.getHours() >= 23) {
                        simTime.setDate(simTime.getDate() + 1)
                        simTime.setHours(9, 0, 0, 0)
                        simLocIdx = 0
                      }
                    }
                    // simTime is after last slot, step back for display
                    const lastSlotTime = new Date(simTime.getTime() - intervalMin * 60 * 1000)
                    // But for single match or first slot, just use start
                    const endDisplay = totalSlots > 1 ? lastSlotTime : start
                    const totalDays = Math.ceil((endDisplay.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1

                    return (
                      <div className="text-xs space-y-1 text-gray-400">
                        <p>Partidas a agendar: <span className="text-white">{matchCount}</span></p>
                        <p>Horários necessários: <span className="text-white">{totalSlots}</span></p>
                        <p>Primeira partida: <span className="text-white">{fmt(start)}</span></p>
                        {totalSlots > 1 && <p>Última partida: <span className="text-white">{fmt(endDisplay)}</span></p>}
                        {totalDays > 1 && <p>Dias de competição: <span className="text-white">{totalDays} dias</span></p>}
                        {isMulti && <p>Partidas por horário: <span className="text-white">até {locCount}</span></p>}
                        <p className="text-gray-500 mt-1">Janela: 09:00 - 23:00 (partidas fora passam para o dia seguinte)</p>
                      </div>
                    )
                  })()}
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-dark-700">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleScheduleSubmit}
                  disabled={scheduling || !scheduleStartDate || scheduleLocationIds.length === 0}
                  className="flex items-center space-x-2 px-6 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {scheduling ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Agendando...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      <span>{{
                        start: 'Iniciar e Agendar',
                        quartas: 'Finalizar e Agendar',
                        semis: 'Finalizar e Agendar Final',
                        final: 'Finalizar Final',
                        reschedule: 'Reagendar Partidas',
                      }[scheduleAction]}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
