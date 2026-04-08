'use client'

import React, { useState } from 'react'
import { TimeInput, ReminderSelector, isValidTime } from '@/components/common'

interface MedicationFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  loading?: boolean
  initialData?: any
}

const frequencyOptions = [
  'Cada 4 horas',
  'Cada 6 horas',
  'Cada 8 horas',
  'Cada 12 horas',
  '1 vez al día',
  '2 veces al día',
  '3 veces al día'
]

export const MedicationForm: React.FC<MedicationFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData
}) => {
  const [formData, setFormData] = useState(initialData || {
    nombre: '',
    dosis: '',
    frecuencia: '',
    quantity_prescribed: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    instructions: '',
    reminders: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [reminderEnabled, setReminderEnabled] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido'
    } else if (formData.nombre.length > 200) {
      newErrors.nombre = 'Máximo 200 caracteres'
    }

    if (!formData.dosis.trim()) {
      newErrors.dosis = 'La dosis es requerida'
    } else if (formData.dosis.length > 100) {
      newErrors.dosis = 'Máximo 100 caracteres'
    }

    if (!formData.frecuencia) {
      newErrors.frecuencia = 'La frecuencia es requerida'
    }

    if (!formData.quantity_prescribed || parseInt(formData.quantity_prescribed) <= 0) {
      newErrors.quantity_prescribed = 'Debe ser un número mayor a 0'
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Fecha de inicio requerida'
    }

    if (formData.end_date && formData.end_date < formData.start_date) {
      newErrors.end_date = 'Debe ser mayor o igual a la fecha de inicio'
    }

    if (formData.instructions && formData.instructions.length > 500) {
      newErrors.instructions = 'Máximo 500 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData = {
      ...formData,
      quantity_prescribed: parseInt(formData.quantity_prescribed),
      reminders: reminderEnabled 
        ? formData.reminders.map((time: string) => ({
            reminder_time: time,
            is_enabled: true
          }))
        : []
    }

    try {
      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Medicamento *
        </label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          placeholder="Ej: Aspirin"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.nombre ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={200}
        />
        {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
      </div>

      {/* Dosis */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Dosis *
        </label>
        <input
          type="text"
          value={formData.dosis}
          onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
          placeholder="Ej: 500mg, 1 tableta"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.dosis ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
        />
        {errors.dosis && <p className="text-xs text-red-600 mt-1">{errors.dosis}</p>}
      </div>

      {/* Frecuencia */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frecuencia *
        </label>
        <select
          value={formData.frecuencia}
          onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.frecuencia ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Seleccionar frecuencia</option>
          {frequencyOptions.map(freq => (
            <option key={freq} value={freq}>{freq}</option>
          ))}
        </select>
        {errors.frecuencia && <p className="text-xs text-red-600 mt-1">{errors.frecuencia}</p>}
      </div>

      {/* Total Dosis */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total de Dosis *
        </label>
        <input
          type="number"
          value={formData.quantity_prescribed}
          onChange={(e) => setFormData({ ...formData, quantity_prescribed: e.target.value })}
          placeholder="Ej: 30"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.quantity_prescribed ? 'border-red-500' : 'border-gray-300'
          }`}
          min="1"
        />
        {errors.quantity_prescribed && <p className="text-xs text-red-600 mt-1">{errors.quantity_prescribed}</p>}
        <p className="text-xs text-gray-500 mt-1">Dejar vacío si es indefinido</p>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Inicio *
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.start_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.start_date && <p className="text-xs text-red-600 mt-1">{errors.start_date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Finalización
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.end_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.end_date && <p className="text-xs text-red-600 mt-1">{errors.end_date}</p>}
        </div>
      </div>

      {/* Instrucciones */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instrucciones
        </label>
        <textarea
          value={formData.instructions}
          onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
          placeholder="Ej: Tomar con alimentos, evitar lácteos"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.instructions ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
          maxLength={500}
        />
        {errors.instructions && <p className="text-xs text-red-600 mt-1">{errors.instructions}</p>}
      </div>

      {/* Recordatorios */}
      <div className="border-t pt-6">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="reminders"
            checked={reminderEnabled}
            onChange={(e) => setReminderEnabled(e.target.checked)}
            className="w-4 h-4 rounded"
          />
          <label htmlFor="reminders" className="text-sm font-medium text-gray-700">
            Deseo programar recordatorios
          </label>
        </div>

        {reminderEnabled && (
          <ReminderSelector
            type="medication"
            value={formData.reminders}
            onChange={(reminders) => setFormData({ ...formData, reminders })}
            label="Seleccionar horarios de recordatorio"
          />
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Guardando...' : 'Programar Medicamento'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
