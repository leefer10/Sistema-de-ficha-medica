'use client'

import React from 'react'
import { Calendar, Edit2, Trash2, CheckCircle, X } from 'lucide-react'
import { Appointment } from '@/lib/types/appointment'

interface AppointmentCardProps {
  appointment: Appointment
  onEdit?: (apt: Appointment) => void
  onComplete?: (apt: Appointment) => void
  onCancel?: (apt: Appointment) => void
  onDelete?: (apt: Appointment) => void
}

const statusColors = {
  programada: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Programada' },
  completada: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completada' },
  cancelada: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelada' }
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onEdit,
  onComplete,
  onCancel,
  onDelete
}) => {
  const [showDetails, setShowDetails] = React.useState(false)
  const statusInfo = statusColors[appointment.status as keyof typeof statusColors]
  const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.appointment_time}`)
  const isUpcoming = appointmentDateTime > new Date()

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{appointment.doctor_name}</h3>
          <p className="text-sm text-gray-600">{appointment.appointment_type}</p>
          {appointment.specialty && (
            <p className="text-xs text-gray-500">{appointment.specialty}</p>
          )}
        </div>
        <Calendar className="w-5 h-5 text-green-600 flex-shrink-0" />
      </div>

      {/* Status Badge */}
      <div className="mb-3 inline-flex px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: statusInfo.bg.replace('bg-', '') }}>
        <span className={statusInfo.text}>
          {statusInfo.label}
        </span>
      </div>

      {/* Fecha y Hora */}
      <p className="text-sm text-gray-700 font-medium mb-1">
        {appointmentDateTime.toLocaleDateString('es-ES', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })} - {appointment.appointment_time}
      </p>

      {/* Ubicación */}
      <p className="text-sm text-gray-600 mb-3">
        📍 {appointment.location}
      </p>

      {/* Acciones */}
      <div className="flex gap-2 mb-3">
        {appointment.status === 'programada' && (
          <>
            <button
              onClick={() => onComplete?.(appointment)}
              className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-1 rounded transition-colors flex items-center justify-center gap-1"
            >
              <CheckCircle className="w-3 h-3" />
              Completar
            </button>
            <button
              onClick={() => onCancel?.(appointment)}
              className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium py-1 rounded transition-colors flex items-center justify-center gap-1"
            >
              <X className="w-3 h-3" />
              Cancelar
            </button>
          </>
        )}
        <button
          onClick={() => onEdit?.(appointment)}
          disabled={appointment.status !== 'programada'}
          className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 disabled:text-gray-400 text-xs font-medium py-1 rounded transition-colors flex items-center justify-center gap-1"
        >
          <Edit2 className="w-3 h-3" />
          Editar
        </button>
        <button
          onClick={() => onDelete?.(appointment)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium py-1 rounded transition-colors flex items-center justify-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Expandable Details */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-left text-xs text-blue-600 hover:text-blue-700 font-medium py-1"
      >
        {showDetails ? '▼ Detalles' : '▶ Detalles'}
      </button>

      {showDetails && (
        <div className="mt-2 pt-2 border-t border-gray-200 space-y-2 text-xs text-gray-700">
          {appointment.phone && (
            <p>📞 <span className="font-medium">Teléfono:</span> {appointment.phone}</p>
          )}
          {appointment.notes && (
            <p><span className="font-medium">Notas:</span> {appointment.notes}</p>
          )}
        </div>
      )}
    </div>
  )
}
