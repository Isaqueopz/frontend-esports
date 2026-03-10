import type { Match } from '../types'
import { MatchStatusBadge } from './MatchStatusBadge'
import { formatDateTime } from '../utils/dateUtils.js'
import {
  MapPin,
  Trophy,
  Eye,
  Swords,
  Users,
  Calendar
} from 'lucide-react'

interface MatchCardProps {
  match: Match
  onClick?: () => void
  showLocation?: boolean
}

export function MatchCard({ match, onClick, showLocation = true }: MatchCardProps) {
  const isClickable = !!onClick
  
  return (
    <div 
      className={`group relative esports-card border-dark-600 hover:border-primary-500/50 transition-all duration-500 overflow-hidden ${
        isClickable ? 'cursor-pointer hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-1 hover:scale-[1.01]' : ''
      }`}
      onClick={onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <MatchStatusBadge status={match.status} />
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{match.scheduledDate ? formatDateTime(match.scheduledDate) : 'A definir'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1 group-hover:scale-105 transition-transform duration-300">
            <div className="relative">
              {match.teamA?.logo ? (
                <img 
                  src={match.teamA.logo} 
                  alt={match.teamA.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-dark-600 group-hover:border-primary-500/50 transition-colors duration-300"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-dark-800 rounded-full flex items-center justify-center border-2 border-dark-600">
                <Trophy className="w-3 h-3 text-primary-400" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors duration-300">
                {match.teamA?.name ?? 'A definir'}
              </h3>
              {match.teamA && (
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Rank #{match.teamA.ranking}</span>
                <span>•</span>
                <span>{match.teamA.pontos} pts</span>
              </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-center mx-8">
            {match.placarCT != null && match.placarTR != null ? (
              <div className="text-center bg-dark-700/50 rounded-xl p-4 min-w-[120px] group-hover:bg-dark-600/50 transition-colors duration-300">
                <div className="text-3xl font-black text-primary-400 drop-shadow-lg">
                  {match.placarCT} : {match.placarTR}
                </div>
                <div className="text-xs text-gray-500 mt-1 font-medium">CT : TR</div>
              </div>
            ) : (
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Swords className="w-8 h-8 text-white animate-pulse" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl opacity-30 blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-bold text-primary-300">
                  VS
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4 flex-1 justify-end group-hover:scale-105 transition-transform duration-300">
            <div className="text-right">
              <h3 className="font-bold text-white text-lg group-hover:text-primary-300 transition-colors duration-300">
                {match.teamB?.name ?? 'A definir'}
              </h3>
              {match.teamB && (
              <div className="flex items-center justify-end space-x-2 text-sm text-gray-400">
                <span>Rank #{match.teamB.ranking}</span>
                <span>•</span>
                <span>{match.teamB.pontos} pts</span>
              </div>
              )}
            </div>
            <div className="relative">
              {match.teamB?.logo ? (
                <img 
                  src={match.teamB.logo} 
                  alt={match.teamB.name}
                  className="w-14 h-14 rounded-xl object-cover border-2 border-dark-600 group-hover:border-primary-500/50 transition-colors duration-300"
                />
              ) : (
                <div className="w-14 h-14 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center">
                  <Users className="w-7 h-7 text-white" />
                </div>
              )}
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-dark-800 rounded-full flex items-center justify-center border-2 border-dark-600">
                <Trophy className="w-3 h-3 text-primary-400" />
              </div>
            </div>
          </div>
        </div>
        
        {showLocation && match.location && (
          <div className="mt-6 pt-4 border-t border-dark-600 group-hover:border-primary-500/30 transition-colors duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{match.location.name}</p>
                  <p className="text-gray-400 text-xs">{match.location.cidade}, {match.location.pais}</p>
                </div>
              </div>
              
              {isClickable && (
                <div className="flex items-center space-x-2 text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm font-medium">Detalhes</span>
                </div>
              )}
            </div>
          </div>
        )}

        {match.map && (
          <div className="mt-2 text-xs text-gray-500">
            Mapa: {match.map}
          </div>
        )}
      </div>
    </div>
  )
}
