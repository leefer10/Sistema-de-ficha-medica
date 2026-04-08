import React from 'react'
import { BaseCard } from '@/components/common'
import { Calendar } from 'lucide-react'

interface AppointmentCardProps {
  count: number
  onViewMore?: () => void
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  count,
  onViewMore
}) => {
  return (
    <BaseCard
      title="Citas Próximas"
      icon={<Calendar className="w-5 h-5" />}
      action={count > 0 ? { label: 'Ver todas', onClick: onViewMore || (() => {}) } : undefined}
      empty={count === 0}
    >
      {count > 0 ? (
        <div className="space-y-2">
          <p className="text-2xl font-bold text-green-600">{count}</p>
          <p className="text-sm text-gray-600">
            Citas programadas
          </p>
        </div>
      ) : (
        <p className="text-gray-500">Sin citas próximas</p>
      )}
    </BaseCard>
  )
}
