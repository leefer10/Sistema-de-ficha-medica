'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Modal, ConfirmDialog } from '@/components/common'
import { MedicationForm, MedicationList } from '@/components/medication'
import { useMedications } from '@/lib/hooks/useMedications'
import { 
  createMedication, 
  updateMedication, 
  deleteMedication, 
  consumeMedication,
  createReminder 
} from '@/lib/api/medications'
import { Medication } from '@/lib/types/medication'
import { ArrowLeft, Plus } from 'lucide-react'

export default function MedicationAlarmPage() {
  const router = useRouter()
  const { medications, loading, refetch } = useMedications('active')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  
  // Confirm dialogs
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean
    type: 'consume' | 'delete'
    medication?: Medication
  }>({ isOpen: false, type: 'consume' })

  const handleOpenModal = (medication?: Medication) => {
    if (medication) {
      setEditingMedication(medication)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingMedication(null)
  }

  const handleSubmit = async (data: any) => {
    setFormLoading(true)
    try {
      let medicationId: number
      
      if (editingMedication) {
        await updateMedication(editingMedication.id, data)
        medicationId = editingMedication.id
        toast.success('Medicamento actualizado')
      } else {
        const response = await createMedication(data)
        medicationId = response.id
        toast.success('Medicamento creado exitosamente')
      }

      // Crear recordatorios si existen
      if (data.reminders && data.reminders.length > 0) {
        for (const reminder of data.reminders) {
          try {
            await createReminder(medicationId, reminder)
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
      toast.error('Error al guardar medicamento')
    } finally {
      setFormLoading(false)
    }
  }

  const handleConsume = async () => {
    if (!confirmDialog.medication) return
    
    try {
      await consumeMedication(confirmDialog.medication.id)
      toast.success('Dosis registrada')
      setConfirmDialog({ isOpen: false, type: 'consume' })
      await refetch()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al registrar dosis')
    }
  }

  const handleDelete = async () => {
    if (!confirmDialog.medication) return
    
    try {
      await deleteMedication(confirmDialog.medication.id)
      toast.success('Medicamento eliminado')
      setConfirmDialog({ isOpen: false, type: 'delete' })
      await refetch()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar medicamento')
    }
  }

  const showConfirmConsume = (medication: Medication) => {
    setConfirmDialog({
      isOpen: true,
      type: 'consume',
      medication
    })
  }

  const showConfirmDelete = (medication: Medication) => {
    setConfirmDialog({
      isOpen: true,
      type: 'delete',
      medication
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
                  Alarmas de Medicamentos
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Gestiona tus medicamentos y recordatorios
                </p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Nuevo Medicamento
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Medicamentos Activos ({medications.length})
          </h2>
          <MedicationList
            medications={medications}
            loading={loading}
            onEdit={handleOpenModal}
            onConsume={showConfirmConsume}
            onDelete={showConfirmDelete}
          />
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingMedication ? 'Editar Medicamento' : 'Nuevo Medicamento'}
        size="lg"
      >
        <MedicationForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          loading={formLoading}
          initialData={editingMedication}
        />
      </Modal>

      {/* Confirm Dialogs */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'consume'}
        title="Marcar dosis como consumida"
        message={`¿Deseas registrar 1 dosis de ${confirmDialog.medication?.nombre}?`}
        confirmText="Confirmar"
        cancelText="Cancelar"
        type="success"
        onConfirm={handleConsume}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'consume' })}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen && confirmDialog.type === 'delete'}
        title="Eliminar medicamento"
        message={`¿Deseas eliminar "${confirmDialog.medication?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDialog({ isOpen: false, type: 'delete' })}
      />
    </div>
  )
}

