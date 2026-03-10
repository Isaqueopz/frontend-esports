import type { Team, Match, Championship, ScoreUpdateRequest, NewMatchRequest, NewChampionshipRequest } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} - ${response.statusText}`)
  }

  const text = await response.text()
  if (!text) return undefined as T
  try {
    return JSON.parse(text) as T
  } catch {
    return text as T
  }
}

export const teamsService = {
  getAll: () => apiCall<Team[]>('/teams'),
  getById: (id: number) => apiCall<Team>(`/teams/${id}`),
  getRecentMatches: (id: number) => apiCall<Match[]>(`/teams/${id}/matches/recent`),
  getUpcomingMatches: (id: number) => apiCall<Match[]>(`/teams/${id}/matches/upcoming`),
  create: (team: { name: string; logo?: string; players?: { name: string; nickname?: string; avatar?: string; steamId?: string }[] }) =>
    apiCall<Team>('/teams', { method: 'POST', body: JSON.stringify(team) }),
  update: (id: number, team: { name: string; logo?: string; players?: { name: string; nickname?: string; avatar?: string; steamId?: string }[] }) =>
    apiCall<Team>(`/teams/${id}`, { method: 'PUT', body: JSON.stringify(team) }),
  delete: (id: number) => apiCall<void>(`/teams/${id}`, { method: 'DELETE' }),
}

export const matchesService = {
  getAll: () => apiCall<Match[]>('/matches'),
  getById: (id: number) => apiCall<Match>(`/matches/${id}`),
  getUpcoming: () => apiCall<Match[]>('/matches/upcoming'),
  getCompleted: (filters?: { championshipId?: number; teamId?: number; startDate?: string; endDate?: string }) => {
    const params = new URLSearchParams()
    if (filters?.championshipId) params.append('championshipId', String(filters.championshipId))
    if (filters?.teamId) params.append('teamId', String(filters.teamId))
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    const query = params.toString()
    return apiCall<Match[]>(`/matches/completed${query ? `?${query}` : ''}`)
  },
  create: (match: NewMatchRequest) =>
    apiCall<Match>('/matches', { method: 'POST', body: JSON.stringify(match) }),
  update: (id: number, match: Partial<NewMatchRequest & { placarCT?: number; placarTR?: number; status?: string }>) =>
    apiCall<Match>(`/matches/${id}`, { method: 'PUT', body: JSON.stringify(match) }),
  updateScore: (id: number, score: ScoreUpdateRequest) =>
    apiCall<Match>(`/matches/${id}/score`, { method: 'PUT', body: JSON.stringify(score) }),
  delete: (id: number) => apiCall<void>(`/matches/${id}`, { method: 'DELETE' }),
}

export const championshipsService = {
  getAll: () => apiCall<Championship[]>('/championships'),
  getById: (id: number) => apiCall<Championship>(`/championships/${id}`),
  getTabela: (id: number) => apiCall<Team[]>(`/championships/${id}/tabela`),
  create: (data: NewChampionshipRequest) =>
    apiCall<Championship>('/championships', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall<void>(`/championships/${id}`, { method: 'DELETE' }),
  start: (id: number) => apiCall<Championship>(`/championships/${id}/start`, { method: 'POST' }),
  play: (id: number) => apiCall<string>(`/championships/${id}/play`, { method: 'POST' }),
  finishQuartas: (id: number) => apiCall<string>(`/championships/${id}/quartas/finish`, { method: 'POST' }),
  finishSemifinais: (id: number) => apiCall<string>(`/championships/${id}/semifinais/finish`, { method: 'POST' }),
  finishFinal: (id: number) => apiCall<string>(`/championships/${id}/final/finish`, { method: 'POST' }),
}
