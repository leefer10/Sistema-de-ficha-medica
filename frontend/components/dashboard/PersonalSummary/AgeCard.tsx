import React from 'react'
import { BaseCard } from '@/components/common'
import { Calendar } from 'lucide-react'

interface AgeCardProps {
  age?: number
}

export const AgeCard: React.FC<AgeCardProps> = ({ age }) => {
  return (
    <BaseCard
      title="Edad"
      icon={<Calendar className="w-5 h-5" />}
      empty={!age}
    >
      {age ? (
        <p className="text-3xl font-bold text-blue-600">{age} años</p>
      ) : (
        <p className="text-sm text-gray-500">No registrado</p>
      )}
    </BaseCard>
  )
}
