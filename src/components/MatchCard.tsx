import type { Match } from '../types'
import { MatchStatusBadge } from './MatchStatusBadge'
import { formatDateTime } from '../utils/dateUtils.js'

interface MatchCardProps {
  match: Match
  onClick?: () => void
  showLocation?: boolean
}

export function MatchCard({ match, onClick, showLocation = true }: MatchCardProps) {
  const isClickable = !!onClick
  
  return (
    <div 
      className={`esports-card ${isClickable ? 'cursor-pointer hover:shadow-glow-blue' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-4">
        <MatchStatusBadge status={match.status} />
        <span className="text-sm text-gray-400">
          {formatDateTime(match.scheduledDate)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        {/* Team A */}
        <div className="flex items-center space-x-3 flex-1">
          {match.teamA.logo && (
            <img 
              src={match.teamA.logo} 
              alt={match.teamA.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-medium text-white">{match.teamA.name}</h3>
            <p className="text-sm text-gray-400">
              {match.teamA.wins}V - {match.teamA.losses}D
            </p>
          </div>
        </div>
        
        {/* Score */}
        <div className="flex items-center space-x-4 mx-6">
          {match.placarCT !== undefined && match.placarTR !== undefined ? (
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-400">
                {match.placarCT} : {match.placarTR}
              </div>
              <div className="text-xs text-gray-500">CT : TR</div>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-500">VS</div>
          )}
        </div>
        
        {/* Team B */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <div className="text-right">
            <h3 className="font-medium text-white">{match.teamB.name}</h3>
            <p className="text-sm text-gray-400">
              {match.teamB.wins}V - {match.teamB.losses}D
            </p>
          </div>
          {match.teamB.logo && (
            <img 
              src={match.teamB.logo} 
              alt={match.teamB.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          )}
        </div>
      </div>
      
      {showLocation && (
        <div className="mt-4 pt-4 border-t border-dark-600">
          <div className="flex items-center text-sm text-gray-400">
            <span className="mr-1">📍</span>
            <span>{match.location.name}</span>
          </div>
        </div>
      )}
    </div>
  )
}