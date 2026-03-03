import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Championship, Match } from '../types'
import { ChampionshipType, MatchStatus } from '../types'
import { MatchCard } from '../components/MatchCard'
import { formatDate } from '../utils/dateUtils.js'
import bgCsImage from '../assets/bg-cs.jpg'
import {
  Trophy,
  Users,
  Calendar,
  Eye,
  ArrowRight,
  Zap,
  Target,
  Clock,
  Award,
  TrendingUp,
  Gamepad2,
  Sparkles
} from 'lucide-react'

export function HomePage() {
  const [championships, setChampionships] = useState<Championship[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por: 
      // const response = await fetch('/api/championships/active')
      // const championships = await response.json()
      const mockChampionships: Championship[] = [
        {
          id: '1',
          name: 'Liga Principal 2024',
          type: ChampionshipType.PONTOS_CORRIDOS,
          teams: [],
          matches: [],
          startDate: '2024-01-15T00:00:00Z',
          endDate: '2024-06-30T00:00:00Z',
          isActive: true,
          maxTeams: 16,
          currentRound: 5
        },
        {
          id: '2',
          name: 'Copa Elite',
          type: ChampionshipType.MATA_MATA,
          teams: [],
          matches: [],
          startDate: '2024-02-01T00:00:00Z',
          endDate: '2024-03-15T00:00:00Z',
          isActive: true,
          maxTeams: 8,
          currentRound: 2
        }
      ]

      // ⚠️ SPRING BOOT INTEGRATION POINT
      // Substituir por: 
      // const matchesResponse = await fetch('/api/matches/upcoming')
      // const upcomingMatches = await matchesResponse.json()
      const mockUpcomingMatches: Match[] = [
        {
          id: '1',
          teamA: {
            id: '1',
            name: 'FURIA Esports',
            players: [],
            wins: 12,
            losses: 3,
            points: 36,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '2',
            name: 'MIBR',
            players: [],
            wins: 10,
            losses: 5,
            points: 30,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '1',
            name: 'Arena São Paulo',
            address: 'São Paulo, SP',
            capacity: 100,
            available: true
          },
          scheduledDate: '2024-03-05T19:00:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: '1'
        },
        {
          id: '2',
          teamA: {
            id: '3',
            name: 'paiN Gaming',
            players: [],
            wins: 8,
            losses: 7,
            points: 24,
            createdAt: '2024-01-01T00:00:00Z'
          },
          teamB: {
            id: '4',
            name: 'Imperial Esports',
            players: [],
            wins: 11,
            losses: 4,
            points: 33,
            createdAt: '2024-01-01T00:00:00Z'
          },
          location: {
            id: '2',
            name: 'Gaming House RJ',
            address: 'Rio de Janeiro, RJ',
            capacity: 50,
            available: true
          },
          scheduledDate: '2024-03-06T20:30:00Z',
          status: MatchStatus.AGENDADA,
          championshipId: '2'
        }
      ]

      setChampionships(mockChampionships)
      setUpcomingMatches(mockUpcomingMatches)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const getChampionshipTypeLabel = (type: ChampionshipType) => {
    return type === ChampionshipType.PONTOS_CORRIDOS ? 'Pontos Corridos' : 'Mata-Mata'
  }

  const getChampionshipIcon = (type: ChampionshipType) => {
    return type === ChampionshipType.PONTOS_CORRIDOS ? '📊' : '🏆'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-200 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-500 rounded-full animate-ping mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-primary-400 font-medium animate-pulse">Carregando Liga dos Campeões...</p>
            <div className="flex justify-center space-x-1">
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url(${bgCsImage})` }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 via-dark-800/90 to-dark-900/80"></div>
        
        <div className="relative text-center py-16 px-8 z-10">
          {/* Animated logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl opacity-30 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
            </div>
          </div>

          <h1 className="gaming-title text-4xl md:text-7xl mb-12 bg-gradient-to-r from-white via-primary-200 to-primary-400 bg-clip-text text-transparent animate-pulse">
            Liga dos Campeões
          </h1>
          
          <div className="max-w-3xl mx-auto mb-10">
            <p className="text-xl md:text-2xl text-gray-300 mb-4 leading-relaxed">
              Sistema de gestão e agendamento automático de campeonatos de e-sports
            </p>
            <p className="text-primary-400 font-medium flex items-center justify-center space-x-2">
              <Gamepad2 className="w-5 h-5 " />
              <span>Experiência competitiva de alta qualidade</span>
              <Target className="w-5 h-5 animate-pulse" />
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            <Link 
              to="/ranking" 
              className="group relative bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-medium py-4 px-8 rounded-xl transition-all duration-300 flex items-center space-x-3 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary-500/30"
            >
              <Trophy className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              <span>Ver Ranking</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
            
            <Link 
              to="/bracket" 
              className="group relative bg-dark-700 hover:bg-dark-600 text-white font-medium py-4 px-8 rounded-xl border border-dark-600 hover:border-primary-500/50 transition-all duration-300 flex items-center space-x-3 transform hover:scale-105"
            >
              <Target className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
              <span>Ver Brackets</span>
              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
            <div className="bg-dark-800/60 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6 hover:bg-dark-700/60 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">8+</p>
                  <p className="text-sm text-gray-400">Times Ativos</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800/60 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6 hover:bg-dark-700/60 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary-500/10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">50+</p>
                  <p className="text-sm text-gray-400">Partidas Realizadas</p>
                </div>
              </div>
            </div>

            <div className="bg-dark-800/60 backdrop-blur-sm border border-dark-700/50 rounded-xl p-6 hover:bg-dark-700/60 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">3</p>
                  <p className="text-sm text-gray-400">Campeonatos Ativos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Active Championships */}
      <section>
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Campeonatos Ativos</h2>
              <p className="text-gray-400">Competições em andamento</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 ml-auto">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-medium">AO VIVO</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {championships.map((championship) => (
            <div key={championship.id} className="esports-card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getChampionshipIcon(championship.type)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{championship.name}</h3>
                    <p className="text-sm text-gray-400">{getChampionshipTypeLabel(championship.type)}</p>
                  </div>
                </div>
                <span className="text-sm bg-green-500 text-green-900 px-2 py-1 rounded-full">
                  Ativo
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Início</p>
                  <p className="text-white">{formatDate(championship.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Término</p>
                  <p className="text-white">{formatDate(championship.endDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400">Times</p>
                  <p className="text-white">{championship.teams.length}/{championship.maxTeams}</p>
                </div>
                {championship.currentRound && (
                  <div>
                    <p className="text-gray-400">Rodada</p>
                    <p className="text-white">{championship.currentRound}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-dark-600">
                <Link 
                  to={championship.type === ChampionshipType.PONTOS_CORRIDOS ? '/ranking' : '/bracket'}
                  className="text-primary-400 hover:text-primary-300 text-sm font-medium"
                >
                  Ver detalhes →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Matches */}
      <section className="space-y-8">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Próximas Partidas</h2>
              <p className="text-gray-400">Não perca os jogos mais esperados</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2 ml-auto">
            <Calendar className="w-5 h-5 text-primary-400" />
            <span className="text-primary-400 font-medium">AGENDA</span>
          </div>
        </div>
        
        {upcomingMatches.length > 0 ? (
          <div className="space-y-6">
            {upcomingMatches.map((match, index) => (
              <div 
                key={match.id}
                className="transform hover:scale-[1.02] transition-all duration-300"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                <MatchCard 
                  match={match}
                  onClick={() => {
                    // Navigate to match room
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative esports-card text-center py-16 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-dark-700/50 to-dark-600/50"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Calendar className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nenhuma partida agendada</h3>
              <p className="text-gray-400 mb-6">As próximas partidas aparecerão aqui em breve</p>
              <Link 
                to="/bracket" 
                className="inline-flex items-center space-x-2 text-primary-400 hover:text-primary-300 font-medium transition-colors duration-300"
              >
                <Eye className="w-5 h-5" />
                <span>Ver todos os brackets</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}