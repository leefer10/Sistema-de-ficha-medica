'use client'

import React from 'react'
import { MedicationCard } from './MedicationCard'
import { Medication } from '@/lib/types/medication'

interface MedicationListProps {
  medications: Medication[]
  loading?: boolean
  onEdit?: (med: Medication) => void
  onConsume?: (med: Medication) => void
  onDelete?: (med: Medication) => void
}

export const MedicationList: React.FC<MedicationListProps> = ({
  medications,
  loading = false,
  onEdit,
  onConsume,
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

  if (medications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Sin medicamentos programados</p>
        <p className="text-sm text-gray-400 mt-1">
          Añade un medicamento para comenzar
        </p>
      </div>
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
