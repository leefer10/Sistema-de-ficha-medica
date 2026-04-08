'use client'

import React, { useState } from 'react'
import { AlertCircle, X } from 'lucide-react'

interface ReminderSelectorProps {
  type: 'medication' | 'appointment'
  value: string[]
  onChange: (value: string[]) => void
  label?: string
  required?: boolean
}

const isValidTime = (time: string): boolean => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
  return timeRegex.test(time)
}

const isValidHours = (hours: string): boolean => {
  const num = parseInt(hours)
  return !isNaN(num) && num > 0 && num <= 168 // max 7 days
}

export const ReminderSelector: React.FC<ReminderSelectorProps> = ({
  type,
  value,
  onChange,
  label,
  required = false
}) => {
  const [customInput, setCustomInput] = useState('')
  const [customError, setCustomError] = useState<string | null>(null)

  const medicationOptions = [
    { label: '08:00', value: '08:00' },
    { label: '12:00', value: '12:00' },
    { label: '14:00', value: '14:00' },
    { label: '16:00', value: '16:00' },
    { label: '18:00', value: '18:00' },
    { label: '20:00', value: '20:00' },
    { label: '21:00', value: '21:00' }
  ]

  const appointmentOptions = [
    { label: '24 horas antes', value: '24' },
    { label: '12 horas antes', value: '12' },
    { label: '2 horas antes', value: '2' },
    { label: '1 hora antes', value: '1' }
  ]

  const options = type === 'medication' ? medicationOptions : appointmentOptions
  const isMedicationType = type === 'medication'

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  const handleAddCustom = () => {
    if (!customInput.trim()) {
      setCustomError('Campo requerido')
      return
    }

    // Validar según tipo
    if (isMedicationType) {
      if (!isValidTime(customInput)) {
        setCustomError('Formato inválido. Use HH:MM (00:00 - 23:59)')
        return
      }
      if (value.includes(customInput)) {
        setCustomError('Este horario ya está seleccionado')
        return
      }
    } else {
      if (!isValidHours(customInput)) {
        setCustomError('Debe ser un número mayor a 0 (máximo 168 horas)')
        return
      }
      if (value.includes(customInput)) {
        setCustomError('Este recordatorio ya está seleccionado')
        return
      }
    }

    setCustomError(null)
    onChange([...value, customInput])
    setCustomInput('')
  }

  const handleRemoveCustom = (item: string) => {
    onChange(value.filter(v => v !== item))
  }

  const isCustom = (item: string) => !options.some(opt => opt.value === item)

  return (
    <div className="flex flex-col gap-4">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Preset Options */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map(option => (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={`
              p-3 text-sm font-medium rounded-lg border-2 transition-all duration-200
              ${
                value.includes(option.value)
                  ? 'bg-blue-50 border-blue-500 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Custom Input */}
      <div className="border-t pt-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          {isMedicationType
            ? 'O añade un horario personalizado (HH:MM)'
            : 'O añade horas personalizadas'}
        </label>
        <div className="flex gap-2">
          <input
            type={isMedicationType ? 'text' : 'number'}
            value={customInput}
            onChange={(e) => {
              setCustomInput(e.target.value)
              setCustomError(null)
            }}
            placeholder={isMedicationType ? 'Ej: 09:30' : 'Ej: 3'}
            className={`
              flex-1 px-3 py-2 border rounded-lg text-sm
              ${customError ? 'border-red-500' : 'border-gray-300'}
              focus:outline-none focus:ring-2 focus:ring-blue-500
            `}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddCustom()
              }
            }}
          />
          <button
            type="button"
            onClick={handleAddCustom}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Añadir
          </button>
        </div>
        {customError && (
          <div className="flex gap-2 items-center text-red-600 text-xs mt-2">
            <AlertCircle className="w-4 h-4" />
            {customError}
          </div>
        )}
      </div>

      {/* Selected Items */}
      {value.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-700 mb-2">
            Seleccionados ({value.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {value.map(item => {
              const isCustomItem = isCustom(item)
              const label = options.find(opt => opt.value === item)?.label || item

              return (
                <div
                  key={item}
                  className={`
                    inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium
                    ${
                      isCustomItem
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }
                  `}
                >
                  {label}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustom(item)}
                    className="hover:opacity-70 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

