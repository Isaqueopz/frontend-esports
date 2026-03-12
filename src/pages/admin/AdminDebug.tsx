import { useState } from 'react'
import { locationsService, matchesService, championshipsService } from '../../services/api'

export function AdminDebug() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const testAPI = async (operation: string) => {
    try {
      setLoading(true)
      setResult(`Executando ${operation}...\\n`)
      
      switch (operation) {
        case 'locations': {
          const locations = await locationsService.getAll()
          setResult(`Locais encontrados: ${locations.length}\\n${JSON.stringify(locations, null, 2)}`)
          break
        }
        case 'createLocation': {
          const newLocation = await locationsService.create({
            name: 'Arena Teste ' + Date.now(),
            cidade: 'São Paulo',
            pais: 'Brasil'
          })
          setResult(`Local criado:\\n${JSON.stringify(newLocation, null, 2)}`)
          break
        }
        case 'championships': {
          const championships = await championshipsService.getAll()
          setResult(`Campeonatos: ${championships.length}\\n${JSON.stringify(championships, null, 2)}`)
          break
        }
        case 'matches': {
          const matches = await matchesService.getAll()
          setResult(`Partidas: ${matches.length}\\n${JSON.stringify(matches, null, 2)}`)
          break
        }
        case 'createTestMatch': {
          const locations = await locationsService.getAll()
          if (locations.length === 0) {
            setResult('Erro: Nenhum local encontrado. Crie um local primeiro.')
            return
          }
          
          const championships = await championshipsService.getAll()
          if (championships.length === 0) {
            setResult('Erro: Nenhum campeonato encontrado.')
            return
          }
          
          const now = new Date()
          now.setHours(now.getHours() + 1) // 1 hora no futuro
          
          const newMatch = await matchesService.create({
            teamAId: 1, // Assumindo que existe um time com ID 1
            teamBId: 2, // Assumindo que existe um time com ID 2
            locationId: locations[0].id,
            scheduledDate: now.toISOString(),
            championshipId: championships[0].id
          })
          setResult(`Partida teste criada:\\n${JSON.stringify(newMatch, null, 2)}`)
          break
        }
      }
    } catch (error) {
      setResult(`ERRO: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Debug API</h1>
        <p className="text-gray-400">Teste das APIs do sistema</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => testAPI('locations')}
          disabled={loading}
          className="p-4 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg"
        >
          Listar Locais
        </button>
        
        <button
          onClick={() => testAPI('createLocation')}
          disabled={loading}
          className="p-4 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg"
        >
          Criar Local
        </button>
        
        <button
          onClick={() => testAPI('championships')}
          disabled={loading}
          className="p-4 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white rounded-lg"
        >
          Listar Campeonatos
        </button>
        
        <button
          onClick={() => testAPI('matches')}
          disabled={loading}
          className="p-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg"
        >
          Listar Partidas
        </button>
        
        <button
          onClick={() => testAPI('createTestMatch')}
          disabled={loading}
          className="p-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-lg col-span-2"
        >
          Criar Partida de Teste
        </button>
      </div>

      <div className="bg-dark-800 rounded-lg border border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Resultado:</h3>
        <pre className="bg-dark-900 p-4 rounded text-green-400 text-sm overflow-auto max-h-96 whitespace-pre-wrap">
          {loading ? 'Carregando...' : result || 'Nenhum teste executado ainda.'}
        </pre>
      </div>
    </div>
  )
}