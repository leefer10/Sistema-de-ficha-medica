'use client'

import React from 'react'
import { AlertCircle, CheckCircle, Trash2, X } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'warning' | 'danger' | 'success'
  loading?: boolean
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}

const typeStyles = {
  warning: {
    icon: AlertCircle,
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    button: 'bg-yellow-600 hover:bg-yellow-700'
  },
  danger: {
    icon: Trash2,
    bg: 'bg-red-50',
    border: 'border-red-200',
    button: 'bg-red-600 hover:bg-red-700'
  },
  success: {
    icon: CheckCircle,
    bg: 'bg-green-50',
    border: 'border-green-200',
    button: 'bg-green-600 hover:bg-green-700'
  }
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null

  const style = typeStyles[type]
  const Icon = style.icon

  const handleConfirm = async () => {
    await onConfirm()
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-white rounded-lg shadow-lg max-w-sm w-full ${style.bg} border ${style.border}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-start gap-4">
            <Icon className="w-6 h-6 text-current flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              <p className="text-sm text-gray-600 mt-1">{message}</p>
            </div>
            <button
              onClick={onCancel}
              disabled={loading}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actions */}
          <div className="p-6 flex gap-3 justify-end">
            <button
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 rounded-lg font-medium transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className={`px-4 py-2 text-white ${style.button} disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors flex items-center gap-2`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
