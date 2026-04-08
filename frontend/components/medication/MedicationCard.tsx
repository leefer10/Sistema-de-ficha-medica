'use client'

import React from 'react'
import { BaseCard } from '@/components/common'
import { Pill, Edit2, Trash2, CheckCircle } from 'lucide-react'
import { Medication } from '@/lib/types/medication'

interface MedicationCardProps {
  medication: Medication
  onEdit?: (med: Medication) => void
  onConsume?: (med: Medication) => void
  onDelete?: (med: Medication) => void
  onToggleReminder?: (med: Medication, reminderId: number, enabled: boolean) => void
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onEdit,
  onConsume,
  onDelete,
  onToggleReminder
}) => {
  const [showReminders, setShowReminders] = React.useState(false)
  const consumed = medication.quantity_consumed || 0
  const prescribed = medication.quantity_prescribed || 0
  const percentage = prescribed > 0 ? (consumed / prescribed) * 100 : 0

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{medication.nombre}</h3>
          <p className="text-sm text-gray-600">{medication.dosis}</p>
          <p className="text-xs text-gray-500 mt-1">
            Frecuencia: {medication.frecuencia}
          </p>
        </div>
        <Pill className="w-5 h-5 text-blue-600 flex-shrink-0" />
      </div>

      {/* Progress Bar */}
      {prescribed > 0 && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Dosis: {consumed}/{prescribed}</span>
            <span>{Math.round(percentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Status Badge */}
      {medication.is_finished && (
        <div className="mb-3 inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
          <CheckCircle className="w-3 h-3" />
          Finalizado
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mb-3">
        {!medication.is_finished && (
          <button
            onClick={() => onConsume?.(medication)}
            className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium py-1 rounded transition-colors"
          >
            Consumir
          </button>
        )}
        <button
          onClick={() => onEdit?.(medication)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium py-1 rounded transition-colors flex items-center justify-center gap-1"
        >
          <Edit2 className="w-3 h-3" />
          Editar
        </button>
        <button
          onClick={() => onDelete?.(medication)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium py-1 rounded transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Expandable Reminders */}
      <button
        onClick={() => setShowReminders(!showReminders)}
        className="w-full text-left text-xs text-blue-600 hover:text-blue-700 font-medium py-1"
      >
        {showReminders ? '▼ Recordatorios' : '▶ Recordatorios'}
      </button>

      {showReminders && (
        <div className="mt-2 pt-2 border-t border-gray-200 space-y-2">
          <p className="text-xs text-gray-500">Sin recordatorios configurados</p>
        </div>
      )}
    </div>
  )
}
