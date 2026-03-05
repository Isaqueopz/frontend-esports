export const MatchStatus = {
  AGENDADA: 'AGENDADA',
  EM_ANDAMENTO: 'EM_ANDAMENTO',
  CONCLUIDA: 'CONCLUIDA'
} as const

export type MatchStatus = typeof MatchStatus[keyof typeof MatchStatus]

export const ChampionshipType = {
  PONTOS_CORRIDOS: 'PONTOS_CORRIDOS',
  MATA_MATA: 'MATA_MATA'
} as const

export type ChampionshipType = typeof ChampionshipType[keyof typeof ChampionshipType]

export interface Player {
  id: string
  name: string
  nickname: string
  avatar?: string
  steamId?: string
}

export interface Team {
  id: string
  name: string
  logo?: string
  players: Player[]
  wins: number
  losses: number
  points: number
  createdAt: string
}

export interface Location {
  id: string
  name: string
  address: string
  capacity: number
  available: boolean
}

export interface Match {
  id: string
  teamA: Team
  teamB: Team
  location: Location
  scheduledDate: string
  status: MatchStatus
  placarCT?: number
  placarTR?: number
  championshipId: string
  round?: number
}

export interface Championship {
  id: string
  name: string
  type: ChampionshipType
  teams: Team[]
  matches: Match[]
  startDate: string
  endDate: string
  isActive: boolean
  maxTeams: number
  currentRound?: number
}

export interface Ranking {
  position: number
  team: Team
  points: number
  wins: number
  losses: number
  draws: number
  goalsFor: number
  goalsAgainst: number
  goalsDifference: number
}

export interface BracketNode {
  id: string
  match?: Match
  nextMatchId?: string
  round: number
  position: number
}

// Admin types
export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const

export type UserRole = typeof UserRole[keyof typeof UserRole]

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

export interface AdminStats {
  totalTeams: number
  totalMatches: number
  activeChampionships: number
  pendingMatches: number
  completedMatches: number
}

export interface MatchUpdateRequest {
  matchId: string
  placarCT?: number
  placarTR?: number
  status: MatchStatus
}

export interface NewMatchRequest {
  teamAId: string
  teamBId: string
  locationId: string
  scheduledDate: string
  championshipId: string
  round?: number
}