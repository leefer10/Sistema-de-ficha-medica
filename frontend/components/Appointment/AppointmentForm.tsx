'use client'

import React, { useState } from 'react'
import { ReminderSelector } from '@/components/common'

interface AppointmentFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  loading?: boolean
  initialData?: any
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialData
}) => {
  const [formData, setFormData] = useState(initialData || {
    doctor_name: '',
    appointment_type: '',
    specialty: '',
    appointment_date: new Date().toISOString().split('T')[0],
    appointment_time: '',
    location: '',
    phone: '',
    notes: '',
    reminders: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [reminderEnabled, setReminderEnabled] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.doctor_name.trim()) {
      newErrors.doctor_name = 'El nombre del doctor es requerido'
    } else if (formData.doctor_name.length > 200) {
      newErrors.doctor_name = 'Máximo 200 caracteres'
    }

    if (!formData.appointment_type.trim()) {
      newErrors.appointment_type = 'El tipo de consulta es requerido'
    } else if (formData.appointment_type.length > 100) {
      newErrors.appointment_type = 'Máximo 100 caracteres'
    }

    if (formData.specialty && formData.specialty.length > 100) {
      newErrors.specialty = 'Máximo 100 caracteres'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida'
    } else if (formData.location.length > 255) {
      newErrors.location = 'Máximo 255 caracteres'
    }

    if (!formData.appointment_date) {
      newErrors.appointment_date = 'Fecha requerida'
    } else if (new Date(formData.appointment_date) < new Date()) {
      newErrors.appointment_date = 'La fecha debe ser futura'
    }

    if (!formData.appointment_time) {
      newErrors.appointment_time = 'La hora es requerida'
    }

    if (formData.phone && !/^[\d\-\(\)\s\+]+$/.test(formData.phone)) {
      newErrors.phone = 'Formato de teléfono inválido'
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Máximo 500 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const submitData = {
      ...formData,
      reminders: reminderEnabled
        ? formData.reminders.map((hours: string) => ({
            reminder_before_hours: parseInt(hours),
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
      {/* Tipo de Consulta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tipo de Consulta *
        </label>
        <input
          type="text"
          value={formData.appointment_type}
          onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })}
          placeholder="Ej: Chequeo General, Odontología"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.appointment_type ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
        />
        {errors.appointment_type && <p className="text-xs text-red-600 mt-1">{errors.appointment_type}</p>}
      </div>

      {/* Nombre del Doctor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre del Doctor *
        </label>
        <input
          type="text"
          value={formData.doctor_name}
          onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
          placeholder="Dr. Juan Pérez"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.doctor_name ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={200}
        />
        {errors.doctor_name && <p className="text-xs text-red-600 mt-1">{errors.doctor_name}</p>}
      </div>

      {/* Especialidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Especialidad
        </label>
        <input
          type="text"
          value={formData.specialty}
          onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
          placeholder="Cardiología, Dermatología, etc."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.specialty ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={100}
        />
        {errors.specialty && <p className="text-xs text-red-600 mt-1">{errors.specialty}</p>}
      </div>

      {/* Ubicación */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ubicación *
        </label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="Hospital o clínica"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.location ? 'border-red-500' : 'border-gray-300'
          }`}
          maxLength={255}
        />
        {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
      </div>

      {/* Fecha y Hora */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha *
          </label>
          <input
            type="date"
            value={formData.appointment_date}
            onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.appointment_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.appointment_date && <p className="text-xs text-red-600 mt-1">{errors.appointment_date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hora *
          </label>
          <input
            type="time"
            value={formData.appointment_time}
            onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.appointment_time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.appointment_time && <p className="text-xs text-red-600 mt-1">{errors.appointment_time}</p>}
        </div>
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Teléfono
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="(XXX) XXX-XXXX"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
      </div>

      {/* Notas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notas Adicionales
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Motivo de consulta, preparación necesaria, etc."
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.notes ? 'border-red-500' : 'border-gray-300'
          }`}
          rows={3}
          maxLength={500}
        />
        {errors.notes && <p className="text-xs text-red-600 mt-1">{errors.notes}</p>}
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
            Deseo recordatorios
          </label>
        </div>

        {reminderEnabled && (
          <ReminderSelector
            type="appointment"
            value={formData.reminders}
            onChange={(reminders) => setFormData({ ...formData, reminders })}
            label="Seleccionar recordatorios"
          />
        )}
      </div>

      {/* Acciones */}
      <div className="flex gap-3 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 disabled:bg-gray-400 transition-colors"
        >
          {loading ? 'Guardando...' : 'Programar Cita'}
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
