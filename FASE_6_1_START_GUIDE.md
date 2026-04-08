# Fase 6.1: Guía de Inicio - Componentes Base

**Objetivo:** Crear 5 componentes reutilizables que servirán de base para toda la UI de Fase 6.

**Tiempo estimado:** 5.5 horas
**Stack:** TypeScript, React 18, Tailwind CSS, ShadcnUI

---

## 1️⃣ BaseCard Component
**Archivo:** `frontend/components/common/BaseCard.tsx`
**Tiempo:** 0.5 horas

### Props Interface
```typescript
interface BaseCardProps {
  title: string              // Título del card
  icon?: React.ReactNode     // Lucide icon component
  children: React.ReactNode  // Contenido del card
  action?: {
    label: string           // Ej: "Ver más"
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  empty?: boolean           // Si true: mostrar empty state
  className?: string        // Clases Tailwind adicionales
}
```

### Implementación
```typescript
export const BaseCard: React.FC<BaseCardProps> = ({
  title,
  icon,
  children,
  action,
  empty,
  className
}) => {
  return (
    <div className={`
      bg-white border border-gray-200 rounded-lg p-6 shadow-sm
      hover:shadow-md transition-shadow duration-200
      ${className || ''}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-blue-600">{icon}</div>}
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
        {action && (
          <button
            onClick={action.onClick}
            className={`text-sm font-medium px-3 py-1 rounded
              ${action.variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
              ${action.variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
              ${action.variant === 'ghost' ? 'text-gray-600 hover:text-gray-900' : ''}
            `}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Content */}
      {empty ? (
        <p className="text-gray-500 text-center py-8">
          No hay datos disponibles
        </p>
      ) : (
        <div className="text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}
```

### Uso
```typescript
<BaseCard
  title="Medicamentos Activos"
  icon={<Pill className="w-5 h-5" />}
  action={{ label: "Ver todos", onClick: () => {} }}
>
  <p>5 medicamentos programados</p>
</BaseCard>
```

---

## 2️⃣ Modal / Dialog Component
**Archivo:** `frontend/components/common/Modal.tsx`
**Tiempo:** 1 hora

### Props Interface
```typescript
interface ModalProps {
  isOpen: boolean                    // Controla visibilidad
  onClose: () => void               // Callback al cerrar
  title: string                     // Título del modal
  children: React.ReactNode         // Contenido
  size?: 'sm' | 'md' | 'lg'        // Tamaño
  className?: string                // Clases adicionales
  showCloseButton?: boolean         // Mostrar X
  closeOnBackdropClick?: boolean   // Cerrar al clickear fondo
}
```

### Implementación
```typescript
import { X } from 'lucide-react'

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  className,
  showCloseButton = true,
  closeOnBackdropClick = true
}) => {
  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg'
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => closeOnBackdropClick && onClose()}
    >
      {/* Modal container */}
      <div
        className={`
          bg-white rounded-lg shadow-xl
          ${sizes[size]}
          w-full mx-4
          max-h-[90vh] overflow-y-auto
          ${className || ''}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
```

### Uso
```typescript
const [isOpen, setIsOpen] = useState(false)

return (
  <>
    <button onClick={() => setIsOpen(true)}>
      Abrir Modal
    </button>
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Mi Modal"
    >
      <p>Contenido aquí</p>
    </Modal>
  </>
)
```

---

## 3️⃣ TimeInput Component
**Archivo:** `frontend/components/common/TimeInput.tsx`
**Tiempo:** 1.5 horas

### Props Interface
```typescript
interface TimeInputProps {
  value: string                     // HH:MM format
  onChange: (value: string) => void // Callback onChange
  label?: string                    // Label del input
  placeholder?: string              // Placeholder
  disabled?: boolean                // Desabilitar
  error?: string                    // Mensaje de error
}
```

### Implementación
```typescript
export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "HH:MM",
  disabled = false,
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value
    
    // Validar formato HH:MM
    if (inputValue.includes(':')) {
      const [hours, minutes] = inputValue.split(':')
      
      // Validar horas (00-23)
      if (parseInt(hours) > 23) {
        return
      }
      
      // Validar minutos (00-59)
      if (parseInt(minutes) > 59) {
        return
      }
    }

    onChange(inputValue)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        type="time"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
        `}
      />
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  )
}
```

### Validación Helper
```typescript
export const isValidTime = (time: string): boolean => {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(time)
}

export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}
```

### Uso
```typescript
const [time, setTime] = useState('08:00')
const [error, setError] = useState('')

const handleChange = (value: string) => {
  if (isValidTime(value)) {
    setTime(value)
    setError('')
  } else {
    setError('Formato inválido (HH:MM)')
  }
}

return (
  <TimeInput
    value={time}
    onChange={handleChange}
    label="Hora de recordatorio"
    error={error}
  />
)
```

---

## 4️⃣ ReminderSelector Component
**Archivo:** `frontend/components/common/ReminderSelector.tsx`
**Tiempo:** 2 horas

### Props Interface
```typescript
interface ReminderSelectorProps {
  type: 'medication' | 'appointment'  // Tipo de recordatorio
  value: string[]                      // Array de valores seleccionados
  onChange: (value: string[]) => void // Callback
  label?: string                       // Label
}
```

### Implementación
```typescript
export const ReminderSelector: React.FC<ReminderSelectorProps> = ({
  type,
  value,
  onChange,
  label
}) => {
  const medicationOptions = [
    { label: '08:00', value: '08:00' },
    { label: '12:00', value: '12:00' },
    { label: '14:00', value: '14:00' },
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

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue))
    } else {
      onChange([...value, optionValue])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="grid grid-cols-2 gap-3">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => handleToggle(option.value)}
            className={`
              p-3 text-sm font-medium rounded-lg border-2 transition
              ${value.includes(option.value)
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
      {value.length > 0 && (
        <div className="text-sm text-gray-600">
          Seleccionados: {value.length}
        </div>
      )}
    </div>
  )
}
```

### Uso
```typescript
const [reminders, setReminders] = useState<string[]>([])

return (
  <ReminderSelector
    type="medication"
    value={reminders}
    onChange={setReminders}
    label="Programar recordatorios"
  />
)
```

---

## 5️⃣ NotificationBadge Component
**Archivo:** `frontend/components/common/NotificationBadge.tsx`
**Tiempo:** 0.5 horas

### Props Interface
```typescript
interface NotificationBadgeProps {
  count: number                    // Número a mostrar
  type?: 'medication' | 'appointment' | 'default'  // Tipo para color
  maxCount?: number               // Máximo antes de mostrar "+"
  className?: string              // Clases adicionales
}
```

### Implementación
```typescript
export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  type = 'default',
  maxCount = 99,
  className
}) => {
  const colors = {
    medication: 'bg-blue-500 text-white',
    appointment: 'bg-green-500 text-white',
    default: 'bg-red-500 text-white'
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count

  if (count === 0) return null

  return (
    <span className={`
      inline-flex items-center justify-center
      w-6 h-6 text-xs font-bold rounded-full
      ${colors[type]}
      ${className || ''}
    `}>
      {displayCount}
    </span>
  )
}
```

### Uso
```typescript
<div className="relative">
  <Bell className="w-6 h-6" />
  <NotificationBadge count={5} type="default" />
</div>
```

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### BaseCard
- [ ] Crear archivo
- [ ] Implementar props interface
- [ ] Diseñar con Tailwind
- [ ] Agregar icon support
- [ ] Agregar action button
- [ ] Agregar empty state
- [ ] Exportar en index.ts

### Modal
- [ ] Crear archivo
- [ ] Implementar props interface
- [ ] Crear backdrop overlay
- [ ] Agregar close button
- [ ] Implementar animations (fade-in)
- [ ] Manejar scroll en contenido
- [ ] Click outside to close
- [ ] Exportar en index.ts

### TimeInput
- [ ] Crear archivo
- [ ] Input type="time"
- [ ] Validación HH:MM
- [ ] Helper functions (isValidTime)
- [ ] Error message support
- [ ] Label support
- [ ] Disabled state
- [ ] Exportar en index.ts

### ReminderSelector
- [ ] Crear archivo
- [ ] Implementar medication options
- [ ] Implementar appointment options
- [ ] Button toggle behavior
- [ ] Selected state styling
- [ ] Count display
- [ ] Exportar en index.ts

### NotificationBadge
- [ ] Crear archivo
- [ ] Renderizar counter
- [ ] Color por tipo
- [ ] Max count logic ("+")
- [ ] Hide if count = 0
- [ ] Exportar en index.ts

### Index
- [ ] Crear `frontend/components/common/index.ts`
- [ ] Exportar todos los componentes
- [ ] Verificar imports

---

## 🧪 TESTING CHECKLIST

Para cada componente:
- [ ] ✅ Renderiza sin errores
- [ ] ✅ Props por defecto funcionan
- [ ] ✅ Props opcionales son opcionales
- [ ] ✅ Validaciones funcionan
- [ ] ✅ Callbacks se ejecutan
- [ ] ✅ Estilos Tailwind se aplican
- [ ] ✅ Responsive en mobile
- [ ] ✅ Accesibilidad básica (labels, buttons)

---

## 📦 IMPORTS NECESARIOS

```typescript
// Lucide icons a importar:
import {
  Pill,           // Para medicamentos
  Calendar,       // Para citas
  Bell,           // Para notificaciones
  X,              // Para cerrar modal
  AlertCircle,    // Para errores
  CheckCircle,    // Para success
} from 'lucide-react'

// React
import React, { useState, useCallback } from 'react'

// Tailwind: No necesita import, solo clasNames

// ShadcnUI (si se necesita):
import { Button } from '@/components/ui/button'
```

---

## 🚀 PRÓXIMOS PASOS

Después de completar Fase 6.1:

1. **Fase 6.2:** Dashboard
   - Usar BaseCard para widgets
   - Usar Modal para acciones
   
2. **Fase 6.3:** Medicamentos
   - Usar Modal + TimeInput + ReminderSelector para formulario
   - Usar BaseCard para cards de medicamentos
   - Usar NotificationBadge para reminders
   
3. **Fase 6.4:** Citas
   - Similar a medicamentos pero con appointment data
   - Usar ReminderSelector con tipo "appointment"

---

## ⏱️ TIEMPO ESTIMADO POR COMPONENTE

| Componente | Tiempo | Complejidad |
|-----------|--------|-------------|
| BaseCard | 0.5h | ⭐ |
| Modal | 1h | ⭐⭐ |
| TimeInput | 1.5h | ⭐⭐ |
| ReminderSelector | 2h | ⭐⭐⭐ |
| NotificationBadge | 0.5h | ⭐ |
| **TOTAL** | **5.5h** | **Fácil-Moderado** |

---

**Estado:** 📋 Guía creada, listo para comenzar implementación
**Próximo:** Crear archivos y comenzar con BaseCard
