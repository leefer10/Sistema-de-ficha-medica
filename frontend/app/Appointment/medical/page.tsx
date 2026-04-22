'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Modal, ConfirmDialog } from '@/components/common'
import { AppointmentForm, AppointmentList } from '@/components/Appointment'
import { useAppointments } from '@/lib/hooks/useAppointments'
import { 
  createAppointment, 
  updateAppointment, 
  deleteAppointment,
  updateAppointmentStatus,
  createAppointmentReminder
} from '@/lib/api/appointments'
import { Appointment } from '@/lib/types/appointment'
import { ArrowLeft, Plus } from 'lucide-react'

export default function MedicalAppointmentPage() {
  const router = useRouter()
  const { appointments, loading, refetch } = useAppointments('upcoming')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  
  // Confirm dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'complete' | 'cancel' | 'delete'
    appointment?: Appointment
  }>({ isOpen: false, type: 'complete' })

  const handleOpenModal = (appointment?: Appointment) => {
    if (appointment) {
      setEditingAppointment(appointment)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingAppointment(null)
  }

  const handleSubmit = async (data: any) => {
    setFormLoading(true)
    try {
      let appointmentId: number
      
      if (editingAppointment) {
        await updateAppointment(editingAppointment.id, data)
        appointmentId = editingAppointment.id
        toast.success('Cita actualizada')
      } else {
        const response = await createAppointment(data)
        if (!response) {
          throw new Error('Error creando cita')
        }
        appointmentId = response.id
        toast.success('Cita creada exitosamente')
      }

      // Crear recordatorios si existen
      if (data.reminders && data.reminders.length > 0) {
        for (const reminder of data.reminders) {
          try {
            await createAppointmentReminder(appointmentId, reminder)
          } catch (error) {
            console.error('Error creating reminder:', error)
            toast.error('Advertencia: No se pudo crear algunos recordatorios')
          }
        }
      }

      handleCloseModal()
      await refetch()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al guardar cita')
    } finally {
      setFormLoading(false)
    }
  }

  const handleComplete = async () => {
    if (!confirmDialog.appointment) return
    
    try {
      await updateAppointmentStatus(confirmDialog.appointment.id, 'completada')
      toast.success('Cita marcada como completada')
      setConfirmDialog({ isOpen: false, type: 'complete' })
      await refetch()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al actualizar cita')
    }
  }

  const handleCancel = async () => {
    if (!confirmDialog.appointment) return
    
    try {
      await updateAppointmentStatus(confirmDialog.appointment.id, 'cancelada')
      toast.success('Cita cancelada')
      setConfirmDialog({ isOpen: false, type: 'cancel' })
      await refetch()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cancelar cita')
    }
  }

  const handleDelete = async () => {
    if (!confirmDialog.appointment) return
    
    try {
      await deleteAppointment(confirmDialog.appointment.id)
      toast.success('Cita eliminada')
      setConfirmDialog({ isOpen: false, type: 'delete' })
      await refetch()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar cita')
    }
  }

  const showConfirmComplete = (appointment: Appointment) => {
    setConfirmDialog({
      isOpen: true,
      type: 'complete',
      appointment
    })
  }

  const showConfirmCancel = (appointment: Appointment) => {
    setConfirmDialog({
      isOpen: true,
      type: 'cancel',
      appointment
    })
  }

  const showConfirmDelete = (appointment: Appointment) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      appointment
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Citas Médicas
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona tus citas médicas
                </p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nueva Cita
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Próximas Citas ({appointments.length})
          </h2>
          <AppointmentList
            appointments={appointments}
            loading={loading}
            onEdit={handleOpenModal}
            onComplete={showConfirmComplete}
            onCancel={showConfirmCancel}
            onDelete={showConfirmDelete}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? 'Editar Cita' : 'Nueva Cita'}
        size="lg"
      >
        <AppointmentForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
          initialData={editingAppointment}
        />
      </Modal>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'complete'}
        title="Marcar cita como completada"
        message={`¿Deseas marcar la cita con ${confirmDialog.appointment?.doctor_name} como completada?`}
        confirmText="Completar"
        cancelText="Cancelar"
        type="success"
        onConfirm={handleComplete}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'complete' })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'cancel'}
        title="Cancelar cita"
        message={`¿Deseas cancelar la cita con ${confirmDialog.appointment?.doctor_name}?`}
        confirmText="Cancelar cita"
        cancelText="No cancelar"
        type="warning"
        onConfirm={handleCancel}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'cancel' })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'delete'}
        title="Eliminar cita"
        message={`¿Deseas eliminar la cita con ${confirmDialog.appointment?.doctor_name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'delete' })}
      />
    </div>
  )
}

