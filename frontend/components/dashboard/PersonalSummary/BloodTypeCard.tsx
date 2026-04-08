import React from 'react'
import { BaseCard } from '@/components/common'
import { Droplet } from 'lucide-react'

interface BloodTypeCardProps {
  bloodType?: string
}

export const BloodTypeCard: React.FC<BloodTypeCardProps> = ({ bloodType }) => {
  return (
    <BaseCard
      title="Tipo de Sangre"
      icon={<Droplet className="w-5 h-5" />}
      empty={!bloodType}
    >
      {bloodType ? (
        <p className="text-3xl font-bold text-red-600">{bloodType}</p>
      ) : (
        <p className="text-sm text-gray-500">No registrado</p>
      )}
    </BaseCard>
  )
}
