import React from 'react'
import { BaseCard } from '@/components/common'
import { AlertCircle } from 'lucide-react'

interface AllergiesCardProps {
  allergies?: string
}

export const AllergiesCard: React.FC<AllergiesCardProps> = ({ allergies }) => {
  return (
    <BaseCard
      title="Alergias"
      icon={<AlertCircle className="w-5 h-5" />}
      empty={!allergies}
    >
      {allergies ? (
        <p className="text-sm text-gray-700">{allergies}</p>
      ) : (
        <p className="text-sm text-gray-500">Sin alergias registradas</p>
      )}
    </BaseCard>
  )
}
