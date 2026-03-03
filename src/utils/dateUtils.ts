export function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString)
  
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function isToday(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  
  return date.toDateString() === today.toDateString()
}

export function isUpcoming(dateString: string): boolean {
  const date = new Date(dateString)
  const now = new Date()
  
  return date > now
}