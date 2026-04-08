import React from 'react'
import { Plus, Edit, Calendar, Pill, FileText, Settings } from 'lucide-react'

interface ActionButton {
  label: string
  icon: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
}

interface QuickActionsProps {
  onAddConsultation?: () => void
  onAddMedication?: () => void
  onViewMedications?: () => void
  onViewAppointments?: () => void
  onViewHistory?: () => void
  onSettings?: () => void
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddConsultation,
  onAddMedication,
  onViewMedications,
  onViewAppointments,
  onViewHistory,
  onSettings
}) => {
  const actions: ActionButton[] = [
    {
      label: 'Agregar Cita',
      icon: <Plus className="w-5 h-5" />,
      onClick: onAddConsultation,
      variant: 'primary'
    },
    {
      label: 'Gestionar Medicamentos',
      icon: <Pill className="w-5 h-5" />,
      onClick: onViewMedications,
      variant: 'primary'
    },
    {
      label: 'Ver Citas',
      icon: <Calendar className="w-5 h-5" />,
      onClick: onViewAppointments,
      variant: 'secondary'
    },
    {
      label: 'Historial Médico',
      icon: <FileText className="w-5 h-5" />,
      onClick: onViewHistory,
      variant: 'secondary'
    },
    {
      label: 'Agregar Medicamento',
      icon: <Plus className="w-5 h-5" />,
      onClick: onAddMedication,
      variant: 'primary'
    },
    {
      label: 'Configuración',
      icon: <Settings className="w-5 h-5" />,
      onClick: onSettings,
      variant: 'secondary'
    }
  ]

  const getButtonClass = (variant: string = 'secondary') => {
    const baseClass = 'flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all duration-200'
    if (variant === 'primary') {
      return `${baseClass} bg-blue-50 border-blue-300 hover:border-blue-500 hover:bg-blue-100 text-blue-700`
    }
    return `${baseClass} bg-gray-50 border-gray-300 hover:border-gray-500 hover:bg-gray-100 text-gray-700`
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {actions.map((action, idx) => (
        <button
          key={idx}
          onClick={action.onClick}
          className={getButtonClass(action.variant)}
        >
          {action.icon}
          <span className="text-xs font-medium text-center">{action.label}</span>
        </button>
      ))}
    </div>
  )
}
