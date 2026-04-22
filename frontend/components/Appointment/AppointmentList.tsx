'use client'

import React from 'react'
import { AppointmentCard } from './AppointmentCard'
import { Appointment } from '@/lib/types/appointment'
import { SkeletonList, EmptyState } from '@/components/common'
import { Calendar } from 'lucide-react'

interface AppointmentListProps {
  appointments: Appointment[]
  loading?: boolean
  error?: string
  onEdit?: (apt: Appointment) => void
  onComplete?: (apt: Appointment) => void
  onCancel?: (apt: Appointment) => void
  onDelete?: (apt: Appointment) => void
  onRetry?: () => void
}

export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  loading = false,
  error,
  onEdit,
  onComplete,
  onCancel,
  onDelete,
  onRetry
}) => {
  if (loading) {
    return <SkeletonList count={3} itemHeight="h-32" />
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-error font-medium">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 btn-primary"
          >
            Reintentar
          </button>
        )}
      </div>
    )
  }

  if (appointments.length === 0) {
    return (
      <EmptyState
        title="Sin citas programadas"
        message="Programa una cita para comenzar"
        icon={<Calendar className="w-12 h-12 text-muted-foreground" />}
        action={{
          label: "Crear cita",
          onClick: () => {} // Will be handled by parent
        }}
      />
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
