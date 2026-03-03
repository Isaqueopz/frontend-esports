import { clsx } from 'clsx'
import { MatchStatus } from '../types'
import type { MatchStatus as MatchStatusType } from '../types'

interface MatchStatusBadgeProps {
  status: MatchStatusType
  className?: string
}

const statusConfig = {
  [MatchStatus.AGENDADA]: {
    label: 'Agendada',
    className: 'bg-yellow-500 text-yellow-900'
  },
  [MatchStatus.EM_ANDAMENTO]: {
    label: 'Em Andamento',
    className: 'bg-green-500 text-green-900'
  },
  [MatchStatus.CONCLUIDA]: {
    label: 'Concluída',
    className: 'bg-gray-500 text-gray-900'  
  }
}

export function MatchStatusBadge({ status, className }: MatchStatusBadgeProps) {
  const config = statusConfig[status]
  
  return (
    <span 
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}