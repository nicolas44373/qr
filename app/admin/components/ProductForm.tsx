// components/ProductForm.tsx
'use client'

import React, { useEffect, useState } from 'react'

type Props = {
  isVisible: boolean
  isEditing: boolean
  categories: any[]
  submitting: boolean
  initialData: {
    name?: string
    price?: string
    unit?: string
    category_id?: string
    marca?: string
  } | null
  onSubmit: (data: {
    name: string
    price: string
    unit?: string
    category_id: string
    marca?: string
  }) => Promise<any>
  onCancel: () => void
}

export default function ProductForm({
  isVisible,
  isEditing,
  categories,
  submitting,
  initialData,
  onSubmit,
  onCancel
}: Props) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    unit: '',
    category_id: '',
    marca: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name ?? '',
        price: initialData.price ?? '',
        unit: initialData.unit ?? '',
        category_id: initialData.category_id ?? '',
        marca: initialData.marca ?? ''
      })
    } else {
      setFormData({
        name: '',
        price: '',
        unit: '',
        category_id: '',
        marca: ''
      })
    }
  }, [initialData])

  const handleChange = (key: string, value: string) => {
    setFormData((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name: formData.name.trim(),
      price: formData.price,
      unit: formData.unit.trim() || undefined,
      category_id: formData.category_id,
      marca: formData.marca.trim() || undefined
    })
  }

  if (!isVisible) return null

  return (
    <div className="mb-8 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar producto' : 'Agregar producto'}
      </h2>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input
            name="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Precio unidad</label>
          <input
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleChange('price', e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unidad</label>
          <input
            name="unit"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="kg, unidad, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            name="category_id"
            value={formData.category_id}
            onChange={(e) => handleChange('category_id', e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Seleccioná...</option>
            {categories.map((c: any) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Marca (opcional)</label>
          <input
            name="marca"
            value={formData.marca}
            onChange={(e) => handleChange('marca', e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="col-span-2 flex gap-2 mt-2">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 text-white rounded font-medium disabled:opacity-50"
          >
            {isEditing ? 'Actualizar' : 'Agregar'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 rounded font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
