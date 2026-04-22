'use client'

import React from 'react'
import { MedicationCard } from './MedicationCard'
import { Medication } from '@/lib/types/medication'
import { SkeletonList, EmptyState } from '@/components/common'
import { Pill } from 'lucide-react'

interface MedicationListProps {
  medications: Medication[]
  loading?: boolean
  error?: string
  onEdit?: (med: Medication) => void
  onConsume?: (med: Medication) => void
  onDelete?: (med: Medication) => void
  onRetry?: () => void
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  loading = false,
  error,
  onEdit,
  onConsume,
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

  if (medications.length === 0) {
    return (
      <EmptyState
        title="Sin medicamentos programados"
        message="Añade un medicamento para comenzar"
        icon={<Pill className="w-12 h-12 text-muted-foreground" />}
        action={{
          label: "Crear medicamento",
          onClick: () => {} // Will be handled by parent
        }}
      />
    )
  }

  return (
    <div className="space-y-3">
      {medications.map(medication => (
        <MedicationCard
          key={medication.id}
          medication={medication}
          onEdit={onEdit}
          onConsume={onConsume}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
