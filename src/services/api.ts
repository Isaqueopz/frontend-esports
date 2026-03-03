// ⚠️ SPRING BOOT API SERVICE
// Este arquivo centralizará todas as chamadas para a API Spring Boot

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Utility function for API calls
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

  return response.json()
}

// ⚠️ CHAMPIONSHIPS SERVICE
export const championshipsService = {
  // GET /api/championships
  getAll: () => apiCall('/championships'),
  
  // GET /api/championships?type=PONTOS_CORRIDOS&active=true
  getByType: (type: string, active?: boolean) => {
    const params = new URLSearchParams({ type })
    if (active !== undefined) params.append('active', String(active))
    return apiCall(`/championships?${params}`)
  },
  
  // GET /api/championships/{id}
  getById: (id: string) => apiCall(`/championships/${id}`),
  
  // GET /api/championships/{id}/rankings
  getRankings: (id: string) => apiCall(`/championships/${id}/rankings`),
  
  // GET /api/championships/{id}/bracket
  getBracket: (id: string) => apiCall(`/championships/${id}/bracket`),
  
  // POST /api/championships
  create: (championship: any) => apiCall('/championships', {
    method: 'POST',
    body: JSON.stringify(championship)
  }),
  
  // PUT /api/championships/{id}
  update: (id: string, championship: any) => apiCall(`/championships/${id}`, {
    method: 'PUT',
    body: JSON.stringify(championship)
  }),
  
  // DELETE /api/championships/{id}
  delete: (id: string) => apiCall(`/championships/${id}`, {
    method: 'DELETE'
  })
}

// ⚠️ TEAMS SERVICE
export const teamsService = {
  // GET /api/teams
  getAll: () => apiCall('/teams'),
  
  // GET /api/teams/{id}
  getById: (id: string) => apiCall(`/teams/${id}`),
  
  // GET /api/teams/{id}/matches/recent
  getRecentMatches: (id: string) => apiCall(`/teams/${id}/matches/recent`),
  
  // GET /api/teams/{id}/matches/upcoming
  getUpcomingMatches: (id: string) => apiCall(`/teams/${id}/matches/upcoming`),
  
  // POST /api/teams
  create: (team: any) => apiCall('/teams', {
    method: 'POST',
    body: JSON.stringify(team)
  }),
  
  // PUT /api/teams/{id}
  update: (id: string, team: any) => apiCall(`/teams/${id}`, {
    method: 'PUT',
    body: JSON.stringify(team)
  }),
  
  // DELETE /api/teams/{id}
  delete: (id: string) => apiCall(`/teams/${id}`, {
    method: 'DELETE'
  })
}

// ⚠️ MATCHES SERVICE
export const matchesService = {
  // GET /api/matches
  getAll: () => apiCall('/matches'),
  
  // GET /api/matches/upcoming
  getUpcoming: () => apiCall('/matches/upcoming'),
  
  // GET /api/matches/completed
  getCompleted: (filters?: any) => {
    const params = new URLSearchParams()
    if (filters?.championshipId) params.append('championshipId', filters.championshipId)
    if (filters?.teamId) params.append('teamId', filters.teamId)
    if (filters?.startDate) params.append('startDate', filters.startDate)
    if (filters?.endDate) params.append('endDate', filters.endDate)
    
    const query = params.toString()
    return apiCall(`/matches/completed${query ? `?${query}` : ''}`)
  },
  
  // GET /api/matches/{id}
  getById: (id: string) => apiCall(`/matches/${id}`),
  
  // POST /api/matches
  create: (match: any) => apiCall('/matches', {
    method: 'POST',
    body: JSON.stringify(match)
  }),
  
  // PUT /api/matches/{id}
  update: (id: string, match: any) => apiCall(`/matches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(match)
  }),
  
  // PUT /api/matches/{id}/score
  updateScore: (id: string, score: any) => apiCall(`/matches/${id}/score`, {
    method: 'PUT',
    body: JSON.stringify(score)
  }),
  
  // DELETE /api/matches/{id}
  delete: (id: string) => apiCall(`/matches/${id}`, {
    method: 'DELETE'
  })
}

// ⚠️ LOCATIONS SERVICE
export const locationsService = {
  // GET /api/locations
  getAll: () => apiCall('/locations'),
  
  // GET /api/locations/{id}
  getById: (id: string) => apiCall(`/locations/${id}`),
  
  // GET /api/locations/available
  getAvailable: (date?: string) => {
    const params = date ? `?date=${date}` : ''
    return apiCall(`/locations/available${params}`)
  },
  
  // POST /api/locations
  create: (location: any) => apiCall('/locations', {
    method: 'POST',
    body: JSON.stringify(location)
  }),
  
  // PUT /api/locations/{id}
  update: (id: string, location: any) => apiCall(`/locations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(location)
  }),
  
  // DELETE /api/locations/{id}
  delete: (id: string) => apiCall(`/locations/${id}`, {
    method: 'DELETE'
  })
}

// ⚠️ PLAYERS SERVICE
export const playersService = {
  // GET /api/players
  getAll: () => apiCall('/players'),
  
  // GET /api/players/{id}
  getById: (id: string) => apiCall(`/players/${id}`),
  
  // GET /api/players/team/{teamId}
  getByTeam: (teamId: string) => apiCall(`/players/team/${teamId}`),
  
  // POST /api/players
  create: (player: any) => apiCall('/players', {
    method: 'POST',
    body: JSON.stringify(player)
  }),
  
  // PUT /api/players/{id}
  update: (id: string, player: any) => apiCall(`/players/${id}`, {
    method: 'PUT',
    body: JSON.stringify(player)
  }),
  
  // DELETE /api/players/{id}
  delete: (id: string) => apiCall(`/players/${id}`, {
    method: 'DELETE'
  })
}

// ⚠️ WEBSOCKET CONNECTION (for real-time updates)
export const websocketService = {
  connect: (url: string = 'ws://localhost:8080/ws') => {
    // Implementation for WebSocket connection to Spring Boot
    // This will be used for real-time match updates, live scores, etc.
    console.log('⚠️ TODO: Implement WebSocket connection to:', url)
  }
}