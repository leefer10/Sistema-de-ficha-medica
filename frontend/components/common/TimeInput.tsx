import React from 'react'

interface TimeInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  error?: string
  name?: string
  required?: boolean
}

export const isValidTime = (time: string): boolean => {
  const regex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/
  return regex.test(time)
}

export const timeToMinutes = (time: string): number => {
  if (!isValidTime(time)) return 0
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

export const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  label,
  placeholder = 'HH:MM',
  disabled = false,
  error,
  name,
  required = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    onChange(inputValue)
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="time"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        className={`
          px-3 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
          transition-colors duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : 'bg-white'}
        `}
      />
      {error && (
        <span className="text-xs text-red-600">{error}</span>
      )}
    </div>
  )
}
