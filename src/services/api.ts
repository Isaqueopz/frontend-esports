// Serviços para ranking
import type { TeamRankingDTO } from '../types'

export const rankingService = {
  getGeral: () => apiCall<TeamRankingDTO[]>('/ranking/geral'),
  getByChampionship: (nome: string) => apiCall<TeamRankingDTO[]>(`/ranking/campeonato?nome=${encodeURIComponent(nome)}`),
}
import type { Team, Match, Championship, ScoreUpdateRequest, NewMatchRequest, NewChampionshipRequest, Location } from '../types'

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
    console.error(`❌ API Error: ${options?.method || 'GET'} ${API_BASE_URL}${endpoint} - ${response.status}`)
    
    // Try to extract error message from response body
    let errorMessage = `API Error: ${response.status} - ${response.statusText}`
    
    try {
      const errorBody = await response.text()
      if (errorBody) {
        console.error(`📄 Error Body:`, errorBody)
        // If it's JSON, extract the message
        try {
          const errorJson = JSON.parse(errorBody)
          if (errorJson.message) {
            errorMessage = errorJson.message
          } else if (errorJson.error) {
            errorMessage = errorJson.error
          }
        } catch {
          // If not JSON, use the text as is
          errorMessage = errorBody
        }
      }
    } catch {
      // If we can't read the body, use the default message
    }
    
    throw new Error(errorMessage)
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
  getTabelaGeral: () => apiCall<Team[]>('/championships/ranking-geral'),
  create: (data: NewChampionshipRequest) =>
    apiCall<Championship>('/championships', { method: 'POST', body: JSON.stringify(data) }),
  delete: (id: number) => apiCall<void>(`/championships/${id}`, { method: 'DELETE' }),
  start: (id: number) => apiCall<Championship>(`/championships/${id}/start`, { method: 'POST' }),
  play: (id: number) => apiCall<string>(`/championships/${id}/play`, { method: 'POST' }),
  finishQuartas: (id: number) => apiCall<string>(`/championships/${id}/quartas/finish`, { method: 'POST' }),
  finishSemifinais: (id: number) => apiCall<string>(`/championships/${id}/semifinais/finish`, { method: 'POST' }),
  finishFinal: (id: number) => apiCall<string>(`/championships/${id}/final/finish`, { method: 'POST' }),
}

export const locationsService = {
  getAll: () => apiCall<Location[]>('/locations'),
  getById: (id: number) => apiCall<Location>(`/locations/${id}`),
  create: (location: { name: string; cidade: string; pais: string }) =>
    apiCall<Location>('/locations', { method: 'POST', body: JSON.stringify(location) }),
  update: (id: number, location: { name: string; cidade: string; pais: string }) =>
    apiCall<Location>(`/locations/${id}`, { method: 'PUT', body: JSON.stringify(location) }),
  delete: (id: number) => apiCall<void>(`/locations/${id}`, { method: 'DELETE' }),
}

// 🧪 Debug function para testar endpoints individualmente
export const debugService = {
  async testAllEndpoints() {
    console.log(`🔍 === TESTANDO TODOS OS ENDPOINTS ===`)
    const endpoints = [
      { name: 'GET /teams', fn: () => teamsService.getAll() },
      { name: 'GET /championships', fn: () => championshipsService.getAll() },
      { name: 'GET /matches', fn: () => matchesService.getAll() },
      { name: 'GET /matches/upcoming', fn: () => matchesService.getUpcoming() },
      { name: 'GET /locations', fn: () => locationsService.getAll() },
    ]

    for (const endpoint of endpoints) {
      try {
        console.log(`🧪 Testing: ${endpoint.name}`)
        await endpoint.fn()
        console.log(`✅ ${endpoint.name} - SUCCESS`)
      } catch (error) {
        console.error(`❌ ${endpoint.name} - FAILED:`, error)
      }
      await new Promise(resolve => setTimeout(resolve, 500)) // Wait 500ms between tests
    }
  },

  async testChampionshipById(id: number) {
    try {
      console.log(`🧪 Testing: GET /championships/${id}`)
      await championshipsService.getById(id)
      console.log(`✅ GET /championships/${id} - SUCCESS`)
    } catch (error) {
      console.error(`❌ GET /championships/${id} - FAILED:`, error)
    }
  },

  async testTeamById(id: number) {
    try {
      console.log(`🧪 Testing: GET /teams/${id}`)
      await teamsService.getById(id)
      console.log(`✅ GET /teams/${id} - SUCCESS`)
    } catch (error) {
      console.error(`❌ GET /teams/${id} - FAILED:`, error)
    }
  }
}
