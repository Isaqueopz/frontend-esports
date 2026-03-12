import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { Location } from '../../types'
import { locationsService } from '../../services/api'
import { ensureArray } from '../../hooks/useSafeArrays'
import {
  Plus,
  Trash2,
  MapPin,
  Edit,
  Save,
  X,
  CheckCircle2,
  AlertCircle,
  Search
} from 'lucide-react'

export function AdminLocations() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  
  // Form state
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [cidade, setCidade] = useState('')
  const [pais, setPais] = useState('')
  const [saving, setSaving] = useState(false)
  
  // Search
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    try {
      setLoading(true)
      const data = await locationsService.getAll()
      const safeData = ensureArray(data)
      setLocations(safeData)
    } catch (error) {
      console.error('Erro ao carregar locais:', error)
      setLocations([])
      showMessage('Erro ao carregar locais', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (text: string, type: 'success' | 'error') => {
    if (type === 'success') toast.success(text)
    else toast.error(text)
  }

  const openModal = (location?: Location) => {
    if (location) {
      setEditingId(location.id)
      setName(location.name || location.nome || '') // Compatibilidade com ambos
      setCidade(location.cidade)
      setPais(location.pais)
    } else {
      setEditingId(null)
      setName('')
      setCidade('')
      setPais('')
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingId(null)
    setName('')
    setCidade('')
    setPais('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !cidade.trim() || !pais.trim()) {
      showMessage('Preencha todos os campos', 'error')
      return
    }

    try {
      setSaving(true)
      
      // Debug: log dos dados que serão enviados
      const locationData = {
        name: name.trim(),
        cidade: cidade.trim(),
        pais: pais.trim()
      }
      
      console.log('Enviando dados para o backend:', locationData)

      if (editingId) {
        await locationsService.update(editingId, locationData)
        showMessage('Local atualizado com sucesso!', 'success')
      } else {
        const result = await locationsService.create(locationData)
        console.log('Resposta do backend:', result)
        showMessage('Local criado com sucesso!', 'success')
      }

      closeModal()
      await loadLocations()
    } catch (error) {
      console.error('Erro ao salvar local:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao salvar local'
      showMessage(errorMessage, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este local?')) return

    try {
      await locationsService.delete(id)
      showMessage('Local excluído com sucesso!', 'success')
      await loadLocations()
    } catch (error) {
      console.error('Erro ao excluir local:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir local'
      showMessage(errorMessage, 'error')
    }
  }

  const filteredLocations = ensureArray(locations).filter(location =>
    (location.name || location.nome || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.pais.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (

    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Gerenciar Locais
          </h1>
          <p className="text-gray-400">
            Administre todos os locais disponíveis para partidas
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Local</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar locais..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
        />
      </div>

      {/* Locations List */}
      <div className="space-y-4">
        {filteredLocations.length > 0 ? (
          filteredLocations.map((location) => (
            <div key={location.id} className="bg-dark-800 rounded-lg border border-dark-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{location.name || location.nome}</h3>
                    <p className="text-gray-400">{location.cidade}, {location.pais}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openModal(location)}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                    title="Editar local"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(location.id)}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                    title="Excluir local"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-dark-800 rounded-lg border border-dark-700">
            <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">Nenhum local encontrado</p>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm ? 'Tente uma busca diferente' : 'Crie seu primeiro local para começar'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => openModal()}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Criar Local</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg border border-dark-700 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-dark-700">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editar Local' : 'Novo Local'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome do Local *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Arena Gamer SP"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cidade *
                </label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  País *
                </label>
                <input
                  type="text"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                  placeholder="Ex: Brasil"
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-dark-700">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary-500 hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{saving ? (editingId ? 'Atualizando...' : 'Criando...') : (editingId ? 'Atualizar' : 'Criar')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}