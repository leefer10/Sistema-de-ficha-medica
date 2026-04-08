import React from 'react'
import { BaseCard } from '@/components/common'
import { Pill } from 'lucide-react'

interface MedicationCardProps {
  count: number
  finished: number
  onViewMore?: () => void
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  count,
  finished,
  onViewMore
}) => {
  return (
    <BaseCard
      title="Medicamentos Activos"
      icon={<Pill className="w-5 h-5" />}
      action={count > 0 ? { label: 'Ver todos', onClick: onViewMore || (() => {}) } : undefined}
      empty={count === 0}
    >
      {count > 0 ? (
        <div className="space-y-2">
          <p className="text-2xl font-bold text-blue-600">{count}</p>
          <p className="text-sm text-gray-600">
            Medicamentos en curso
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Sin medicamentos programados</p>
      )}
    </BaseCard>
  )
}
