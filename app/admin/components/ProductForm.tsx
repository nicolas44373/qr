'use client'

import React, { useEffect, useState } from 'react'

type Props = {
  isVisible: boolean
  isEditing: boolean
  categories: any[]
  submitting: boolean
  initialData: { name?: string; price?: string; unit?: string; category_id?: string; marca?: string; in_stock?: boolean } | null
  onSubmit: (data: { name: string; price: string; unit?: string; category_id: string; marca?: string; in_stock: boolean }) => Promise<any>
  onCancel: () => void
}

const field = 'w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all'

export default function ProductForm({ isVisible, isEditing, categories, submitting, initialData, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({ name: '', price: '', unit: '', category_id: '', marca: '', in_stock: true })

  useEffect(() => {
    if (initialData) {
      setForm({
        name:        initialData.name        ?? '',
        price:       initialData.price       ?? '',
        unit:        initialData.unit        ?? '',
        category_id: initialData.category_id ?? '',
        marca:       initialData.marca       ?? '',
        in_stock:    initialData.in_stock    ?? true,
      })
    } else {
      setForm({ name: '', price: '', unit: '', category_id: '', marca: '', in_stock: true })
    }
  }, [initialData])

  const set = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      name:        form.name.trim(),
      price:       form.price,
      unit:        form.unit.trim() || undefined,
      category_id: form.category_id,
      marca:       form.marca.trim() || undefined,
      in_stock:    form.in_stock,
    })
  }

  if (!isVisible) return null

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      {/* Header del form */}
      <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between ${isEditing ? 'bg-amber-50' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold ${isEditing ? 'bg-amber-500' : 'bg-emerald-500'}`}>
            {isEditing ? '✏️' : '+'}
          </div>
          <h2 className="font-extrabold text-gray-900 text-base">
            {isEditing ? 'Editar producto' : 'Nuevo producto'}
          </h2>
        </div>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Campos */}
      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid gap-4 sm:grid-cols-2">

          {/* Nombre — ancho completo */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Nombre del producto <span className="text-red-500">*</span>
            </label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="Ej: Pata Muslo x10kg"
              className={field}
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Categoría <span className="text-red-500">*</span>
            </label>
            <select
              value={form.category_id}
              onChange={e => set('category_id', e.target.value)}
              className={field}
              required
            >
              <option value="">Seleccioná una categoría…</option>
              {categories.map((c: any) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Precio */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Precio por unidad <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={e => set('price', e.target.value)}
                placeholder="0.00"
                className={`${field} pl-7`}
                required
              />
            </div>
          </div>

          {/* Unidad */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Unidad <span className="text-gray-300 font-normal">(opcional)</span>
            </label>
            <input
              value={form.unit}
              onChange={e => set('unit', e.target.value)}
              placeholder="Ej: kg, unidad, caja"
              className={field}
            />
          </div>

          {/* Marca */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Marca <span className="text-gray-300 font-normal">(opcional)</span>
            </label>
            <input
              value={form.marca}
              onChange={e => set('marca', e.target.value)}
              placeholder="Ej: Don Fernando"
              className={field}
            />
          </div>

          {/* Stock Switch — ancho completo */}
          <div className="sm:col-span-2 flex items-center gap-3 bg-gray-50 border border-gray-150 rounded-xl px-4 py-3">
            <input
              type="checkbox"
              id="form_in_stock"
              checked={form.in_stock}
              onChange={e => set('in_stock', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
            />
            <label htmlFor="form_in_stock" className="text-sm font-bold text-gray-700 cursor-pointer select-none">
              Hay stock disponible de este producto
            </label>
          </div>

        </div>

        {/* Acciones */}
        <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm disabled:opacity-60 transition-colors shadow-sm ${
              isEditing
                ? 'bg-amber-500 hover:bg-amber-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Guardando…
              </>
            ) : (
              isEditing ? 'Guardar cambios' : 'Agregar producto'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
