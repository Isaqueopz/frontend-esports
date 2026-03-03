import { clsx } from 'clsx'
import { MatchStatus } from '../types'
import type { MatchStatus as MatchStatusType } from '../types'
import { Clock, Play, CheckCircle } from 'lucide-react'

interface MatchStatusBadgeProps {
  status: MatchStatusType
  className?: string
}

const statusConfig = {
  [MatchStatus.AGENDADA]: {
    label: 'Agendada',
    icon: Clock,
    className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    iconClassName: 'text-yellow-400'
  },
  [MatchStatus.EM_ANDAMENTO]: {
    label: 'Ao Vivo',
    icon: Play,
    className: 'bg-green-500/20 text-green-400 border border-green-500/30',
    iconClassName: 'text-green-400 animate-pulse'
  },
  [MatchStatus.CONCLUIDA]: {
    label: 'Finalizada',
    icon: CheckCircle,
    className: 'bg-gray-500/20 text-gray-400 border border-gray-500/30',
    iconClassName: 'text-gray-400'
  }
}

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <span 
      className={clsx(
        'inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium backdrop-blur-sm transition-all duration-300 hover:scale-105',
        config.className,
        className
      )}
    >
      <Icon className={clsx('w-4 h-4', config.iconClassName)} />
      <span>{config.label}</span>
      {status === MatchStatus.EM_ANDAMENTO && (
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      )}
    </span>
  )
}