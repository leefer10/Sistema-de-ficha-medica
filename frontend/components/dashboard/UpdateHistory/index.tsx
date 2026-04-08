import React from 'react'
import { BaseCard } from '@/components/common'
import { History } from 'lucide-react'

interface UpdateItem {
  id: number
  title: string
  description?: string
  date: string
  type: 'medication' | 'appointment' | 'record'
}

interface UpdateHistoryProps {
  updates: UpdateItem[]
  loading?: boolean
}

export const UpdateHistory: React.FC<UpdateHistoryProps> = ({
  updates,
  loading = false
}) => {
  if (loading) {
    return (
      <BaseCard
        title="Historial de Actualizaciones"
        icon={<History className="w-5 h-5" />}
      >
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-gray-200 animate-pulse rounded h-12" />
          ))}
        </div>
      </BaseCard>
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'medication':
        return 'bg-blue-100 text-blue-700'
      case 'appointment':
        return 'bg-green-100 text-green-700'
      case 'record':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'medication':
        return 'Medicamento'
      case 'appointment':
        return 'Cita'
      case 'record':
        return 'Registro'
      default:
        return 'Actualización'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <BaseCard
      title="Últimas Actualizaciones"
      icon={<History className="w-5 h-5" />}
      empty={updates.length === 0}
    >
      {updates.length > 0 ? (
        <div className="space-y-3">
          {updates.slice(0, 3).map((update) => (
            <div key={update.id} className="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
              <div
                className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${getTypeColor(update.type)}`}
              >
                {getTypeLabel(update.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{update.title}</p>
                {update.description && (
                  <p className="text-xs text-gray-600 truncate">{update.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">{formatDate(update.date)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">Sin actualizaciones recientes</p>
      )}
    </BaseCard>
  )
}
