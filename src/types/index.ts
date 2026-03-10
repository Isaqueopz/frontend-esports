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
  id: number
  name: string
  nickname?: string | null
  avatar?: string | null
  steamId?: string | null
}

export interface Team {
  id: number
  name: string
  logo?: string | null
  ranking: number
  pontos: number
  players: Player[]
}

export interface Location {
  id: number
  name: string
  cidade: string
  pais: string
}

export interface Match {
  id: number
  scheduledDate: string
  teamA?: Team | null
  teamB?: Team | null
  winner?: Team | null
  placarCT?: number | null
  placarTR?: number | null
  map?: string | null
  status: MatchStatus
  round?: string | null
  location?: Location | null
}

export interface Championship {
  id: number
  nome: string
  tipo: ChampionshipType
  status: MatchStatus
  times: Team[]
  tabela: Match[]
  bracketNodes?: BracketNode[]
  rankings?: Ranking[]
}

export interface Ranking {
  id: number
  championship?: { id: number }
  team: Team
  pontos: number
  vitorias: number
  derrotas: number
  empates: number
  jogos: number
  posicao: number
}

export interface BracketNode {
  id: number
  match?: Match | null
  round: string
  vencedor?: Team | null
  rodada: number
  posicao: number
}

export interface ScoreUpdateRequest {
  placarCT: number
  placarTR: number
  status: MatchStatus
}

export interface NewMatchRequest {
  teamAId: number
  teamBId: number
  locationId?: number
  scheduledDate?: string
  championshipId?: number
  round?: number
  status?: MatchStatus
}

export interface NewChampionshipRequest {
  nome: string
  tipo: ChampionshipType
  teamIds: number[]
}
