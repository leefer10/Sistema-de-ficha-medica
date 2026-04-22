'use client'

import React, { useState } from 'react'
import { ReminderSelector } from '@/components/common'
import { Button, Card, CardContent, CardFooter } from '@/components/common'
import { AlertCircle } from 'lucide-react'

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
      <Card>
        <CardContent className="space-y-4">
          {/* Nombre */}
          <FormField label="Nombre del Medicamento" error={errors.nombre} required>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Aspirin"
              className={`input-base ${errors.nombre ? 'border-error' : ''}`}
              maxLength={200}
            />
          </FormField>

          {/* Dosis */}
          <FormField label="Dosis" error={errors.dosis} required>
            <input
              type="text"
              value={formData.dosis}
              onChange={(e) => setFormData({ ...formData, dosis: e.target.value })}
              placeholder="Ej: 500mg, 1 tableta"
              className={`input-base ${errors.dosis ? 'border-error' : ''}`}
              maxLength={100}
            />
          </FormField>

          {/* Frecuencia */}
          <FormField label="Frecuencia" error={errors.frecuencia} required>
            <select
              value={formData.frecuencia}
              onChange={(e) => setFormData({ ...formData, frecuencia: e.target.value })}
              className={`input-base ${errors.frecuencia ? 'border-error' : ''}`}
            >
              <option value="">Seleccionar frecuencia</option>
              {frequencyOptions.map(freq => (
                <option key={freq} value={freq}>{freq}</option>
              ))}
            </select>
          </FormField>

          {/* Total Dosis */}
          <FormField label="Total de Dosis" error={errors.quantity_prescribed} required>
            <input
              type="number"
              value={formData.quantity_prescribed}
              onChange={(e) => setFormData({ ...formData, quantity_prescribed: e.target.value })}
              placeholder="Ej: 30"
              className={`input-base ${errors.quantity_prescribed ? 'border-error' : ''}`}
              min="1"
            />
            <p className="text-xs text-muted-foreground">Dejar vacío si es indefinido</p>
          </FormField>

          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Fecha de Inicio" error={errors.start_date} required>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className={`input-base ${errors.start_date ? 'border-error' : ''}`}
              />
            </FormField>
            <FormField label="Fecha de Finalización" error={errors.end_date}>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className={`input-base ${errors.end_date ? 'border-error' : ''}`}
              />
            </FormField>
          </div>

          {/* Instrucciones */}
          <FormField label="Instrucciones" error={errors.instructions}>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Ej: Tomar con alimentos, evitar lácteos"
              className={`input-base resize-none ${errors.instructions ? 'border-error' : ''}`}
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground">
              {formData.instructions.length}/500 caracteres
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
                type="medication"
                value={formData.reminders}
                onChange={(reminders) => setFormData({ ...formData, reminders })}
                label="Seleccionar horarios de recordatorio"
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
          Programar Medicamento
        </Button>
      </CardFooter>
    </form>
  )
}
