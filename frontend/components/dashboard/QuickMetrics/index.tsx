import React from 'react'
export { MedicationCard } from './MedicationCard'
export { AppointmentCard } from './AppointmentCard'
export { FinishedMedicationCard } from './FinishedMedicationCard'

import { MedicationCard } from './MedicationCard'
import { AppointmentCard } from './AppointmentCard'
import { FinishedMedicationCard } from './FinishedMedicationCard'

interface QuickMetricsProps {
  activeMedications: number
  finishedMedications: number
  upcomingAppointments: number
  onMedicationsClick?: () => void
  onAppointmentsClick?: () => void
  onFinishedClick?: () => void
}

export const QuickMetrics: React.FC<QuickMetricsProps> = ({
  activeMedications,
  finishedMedications,
  upcomingAppointments,
  onMedicationsClick,
  onAppointmentsClick,
  onFinishedClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MedicationCard
        count={activeMedications}
        finished={finishedMedications}
        onViewMore={onMedicationsClick}
      />
      <AppointmentCard
        count={upcomingAppointments}
        onViewMore={onAppointmentsClick}
      />
      <FinishedMedicationCard
        count={finishedMedications}
        onViewMore={onFinishedClick}
      />
    </div>
  )
}
