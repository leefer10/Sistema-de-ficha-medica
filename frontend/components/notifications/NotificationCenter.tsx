'use client'

import React, { useState, useEffect } from 'react'
import { Bell, X, Check, CheckCheck, Trash2, Clock } from 'lucide-react'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { Notification } from '@/lib/types/notification'

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
}

const notificationTypeIcons = {
  medication_reminder: '💊',
  appointment_reminder: '📅'
}

const notificationTypeLabels = {
  medication_reminder: 'Recordatorio de Medicamento',
  appointment_reminder: 'Recordatorio de Cita'
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose
}) => {
  const { notifications, unreadCount, loading } = useNotifications()
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([])
  const [filter, setFilter] = useState<'all' | 'unread' | 'medication' | 'appointment'>('unread')

  useEffect(() => {
    let filtered = notifications

    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.is_read)
    } else if (filter === 'medication') {
      filtered = filtered.filter(n => n.notification_type === 'medication_reminder')
    } else if (filter === 'appointment') {
      filtered = filtered.filter(n => n.notification_type === 'appointment_reminder')
    }

    setFilteredNotifications(filtered)
  }, [notifications, filter])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-lg z-50 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Notificaciones</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="border-b border-gray-200 px-4 py-3 flex gap-2 overflow-x-auto">
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'unread'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            No leídas ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('medication')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'medication'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            💊 Medicamentos
          </button>
          <button
            onClick={() => setFilter('appointment')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'appointment'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📅 Citas
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todas
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3" />
                <p className="text-gray-500 text-sm">Cargando notificaciones...</p>
              </div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {filter === 'unread'
                    ? 'No tienes notificaciones sin leer'
                    : 'No hay notificaciones'}
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="border-t border-gray-200 px-4 py-3">
            <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
              Marcar todo como leído
            </button>
          </div>
        )}
      </div>
    </>
  )
}

interface NotificationItemProps {
  notification: Notification
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification }) => {
  const icon =
    notificationTypeIcons[notification.notification_type as keyof typeof notificationTypeIcons]
  const label =
    notificationTypeLabels[notification.notification_type as keyof typeof notificationTypeLabels]

  const sentDate = new Date(notification.sent_at)
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - sentDate.getTime()) / (1000 * 60))

  let timeLabel = ''
  if (diffInMinutes < 1) {
    timeLabel = 'Hace un momento'
  } else if (diffInMinutes < 60) {
    timeLabel = `Hace ${diffInMinutes}m`
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60)
    timeLabel = `Hace ${hours}h`
  } else {
    const days = Math.floor(diffInMinutes / 1440)
    timeLabel = `Hace ${days}d`
  }

  const bgColor = notification.is_read ? 'bg-white' : 'bg-blue-50'
  const borderColor = notification.is_read ? '' : 'border-l-4 border-l-blue-600'

  return (
    <div className={`p-4 ${bgColor} ${borderColor} hover:bg-gray-50 transition-colors group`}>
      <div className="flex gap-3">
        {/* Icon */}
        <div className="flex-shrink-0 text-2xl">{icon}</div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
          <p className="text-sm text-gray-900 line-clamp-2">{notification.message}</p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {timeLabel}
            {notification.delivery_method !== 'in_app' && (
              <span className="text-gray-400">• {notification.delivery_method}</span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          {!notification.is_read && (
            <button
              className="p-1 hover:bg-gray-200 rounded transition-colors text-gray-600"
              title="Marcar como leído"
            >
              <Check className="w-4 h-4" />
            </button>
          )}
          <button
            className="p-1 hover:bg-red-100 rounded transition-colors text-red-600"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
