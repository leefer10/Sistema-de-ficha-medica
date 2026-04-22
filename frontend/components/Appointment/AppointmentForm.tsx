'use client'

import React, { useState } from 'react'
import { ReminderSelector } from '@/components/common'
import { Button, Card, CardContent, CardFooter } from '@/components/common'
import { AlertCircle } from 'lucide-react'

interface AppointmentFormProps {
  onSubmit: (data: any) => Promise<void>
  onCancel: () => void
  loading?: boolean
  initialData?: any
}

const FormField = ({ label, error, children, required }: any) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
    {children}
    {error && (
      <div className="flex items-center gap-1 text-xs text-error">
        <AlertCircle className="w-3 h-3" />
        {error}
      </div>
    )}
  </div>
)

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
      <Card>
        <CardContent className="space-y-4">
          {/* Tipo de Consulta */}
          <FormField label="Tipo de Consulta" error={errors.appointment_type} required>
            <input
              type="text"
              value={formData.appointment_type}
              onChange={(e) => setFormData({ ...formData, appointment_type: e.target.value })}
              placeholder="Ej: Chequeo General, Odontología"
              className={`input-base ${errors.appointment_type ? 'border-error' : ''}`}
              maxLength={100}
            />
          </FormField>

          {/* Nombre del Doctor */}
          <FormField label="Nombre del Doctor" error={errors.doctor_name} required>
            <input
              type="text"
              value={formData.doctor_name}
              onChange={(e) => setFormData({ ...formData, doctor_name: e.target.value })}
              placeholder="Dr. Juan Pérez"
              className={`input-base ${errors.doctor_name ? 'border-error' : ''}`}
              maxLength={200}
            />
          </FormField>

          {/* Especialidad */}
          <FormField label="Especialidad" error={errors.specialty}>
            <input
              type="text"
              value={formData.specialty}
              onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              placeholder="Cardiología, Dermatología, etc."
              className={`input-base ${errors.specialty ? 'border-error' : ''}`}
              maxLength={100}
            />
          </FormField>

          {/* Ubicación */}
          <FormField label="Ubicación" error={errors.location} required>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Hospital o clínica"
              className={`input-base ${errors.location ? 'border-error' : ''}`}
              maxLength={255}
            />
          </FormField>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Fecha" error={errors.appointment_date} required>
              <input
                type="date"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                className={`input-base ${errors.appointment_date ? 'border-error' : ''}`}
              />
            </FormField>
            <FormField label="Hora" error={errors.appointment_time} required>
              <input
                type="time"
                value={formData.appointment_time}
                onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                className={`input-base ${errors.appointment_time ? 'border-error' : ''}`}
              />
            </FormField>
          </div>

          {/* Teléfono */}
          <FormField label="Teléfono" error={errors.phone}>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="(XXX) XXX-XXXX"
              className={`input-base ${errors.phone ? 'border-error' : ''}`}
            />
          </FormField>

          {/* Notas */}
          <FormField label="Notas Adicionales" error={errors.notes}>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Motivo de consulta, preparación necesaria, etc."
              className={`input-base resize-none ${errors.notes ? 'border-error' : ''}`}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.notes.length}/500 caracteres
            </p>
          </FormField>

          {/* Recordatorios */}
          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="checkbox"
                id="reminders"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
              />
              <label htmlFor="reminders" className="text-sm font-medium text-foreground cursor-pointer">
                Programar recordatorios (opcional)
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
        </CardContent>
      </Card>

      {/* Acciones */}
      <CardFooter className="justify-end gap-3 border-0">
        <Button
          type="button"
          onClick={onCancel}
          variant="outline"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={loading}
          isLoading={loading}
          loadingText="Guardando..."
        >
          Programar Cita
        </Button>
      </CardFooter>
    </form>
  )
}
