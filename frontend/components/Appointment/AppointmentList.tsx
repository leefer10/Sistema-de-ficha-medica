'use client'

import React from 'react'
import { AppointmentCard } from './AppointmentCard'
import { Appointment } from '@/lib/types/appointment'

interface AppointmentListProps {
  appointments: Appointment[]
  loading?: boolean
  onEdit?: (apt: Appointment) => void
  onComplete?: (apt: Appointment) => void
  onCancel?: (apt: Appointment) => void
  onDelete?: (apt: Appointment) => void
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  loading = false,
  onEdit,
  onComplete,
  onCancel,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32" />
        ))}
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sin citas programadas</p>
        <p className="text-sm text-gray-400 mt-1">
          Programa una cita para comenzar
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map(appointment => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onEdit={onEdit}
          onComplete={onComplete}
          onCancel={onCancel}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
