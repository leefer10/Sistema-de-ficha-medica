import React from 'react'
export { BloodTypeCard } from './BloodTypeCard'
export { AgeCard } from './AgeCard'
export { AllergiesCard } from './AllergiesCard'

import { BloodTypeCard } from './BloodTypeCard'
import { AgeCard } from './AgeCard'
import { AllergiesCard } from './AllergiesCard'

interface PersonalSummaryProps {
  bloodType?: string
  age?: number
  allergies?: string
  loading?: boolean
}

export const PersonalSummary: React.FC<PersonalSummaryProps> = ({
  bloodType,
  age,
  allergies,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-32" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <BloodTypeCard bloodType={bloodType} />
      <AgeCard age={age} />
      <AllergiesCard allergies={allergies} />
    </div>
  )
}
