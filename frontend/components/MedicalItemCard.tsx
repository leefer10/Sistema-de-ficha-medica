"use client";

import { Edit2, Trash2, Badge } from "lucide-react";

interface MedicalItemCardProps {
  title: string;
  badge?: string;
  badgeColor?: "green" | "blue" | "orange" | "red" | "gray";
  details: { label: string; value: string | null }[];
  onEdit?: () => void;
  onDelete?: () => void;
  isLoading?: boolean;
}

const badgeColorMap = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800",
  orange: "bg-orange-100 text-orange-800",
  red: "bg-red-100 text-red-800",
  gray: "bg-gray-100 text-gray-800",
};

export function MedicalItemCard({
  title,
  badge,
  badgeColor = "blue",
  details,
  onEdit,
  onDelete,
  isLoading = false,
}: MedicalItemCardProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          {badge && (
            <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${badgeColorMap[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 ml-4">
          {onEdit && (
            <button
              onClick={onEdit}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors disabled:opacity-50"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              disabled={isLoading}
              className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors disabled:opacity-50"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2">
        {details.map((detail, idx) => (
          detail.value && (
            <div key={idx} className="text-sm">
              <span className="text-gray-600">{detail.label}:</span>
              <span className="font-medium ml-2 text-gray-900">{detail.value}</span>
            </div>
          )
        ))}
      </div>
    </div>
  );
}
