import React from 'react'
import { BaseCard } from '@/components/common'
import { CheckCircle } from 'lucide-react'

interface FinishedMedicationCardProps {
  count: number
  onViewMore?: () => void
}

export const FinishedMedicationCard: React.FC<FinishedMedicationCardProps> = ({
  count,
  onViewMore
}) => {
  return (
    <BaseCard
      title="Medicamentos Finalizados"
      icon={<CheckCircle className="w-5 h-5" />}
      action={count > 0 ? { label: 'Ver historial', onClick: onViewMore || (() => {}) } : undefined}
      empty={count === 0}
    >
      {count > 0 ? (
        <div className="space-y-2">
          <p className="text-2xl font-bold text-green-600">{count}</p>
          <p className="text-sm text-gray-600">
            Medicamentos completados
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Sin medicamentos completados</p>
      )}
    </BaseCard>
  )
}
