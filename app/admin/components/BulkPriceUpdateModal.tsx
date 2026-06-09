'use client'

import React, { useState, useEffect } from 'react'
import { X, Percent, Check, Loader2, HelpCircle } from 'lucide-react'
import type { Product } from '../hooks/useProducts'

type Props = {
  isOpen: boolean
  onClose: () => void
  products: Product[]
  categories: any[]
  selectedIds: number[]
  onApply: (params: { percentage: number; roundingRule: string; scope: 'all' | 'category' | 'brand' | 'selection'; targetValue: string }) => Promise<{ success: boolean; count?: number; error?: string }>
}

const inputClass = 'w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all'

export default function BulkPriceUpdateModal({ isOpen, onClose, products, categories, selectedIds, onApply }: Props) {
  const [percentage, setPercentage] = useState<string>('')
  const [roundingRule, setRoundingRule] = useState<string>('none')
  const [scope, setScope] = useState<'all' | 'category' | 'brand' | 'selection'>('all')
  const [targetCategory, setTargetCategory] = useState<string>('')
  const [targetBrand, setTargetBrand] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Extract unique brands
  const uniqueBrands = React.useMemo(() => {
    return Array.from(
      new Set(products.map(p => p.marca).filter(Boolean))
    ).sort((a, b) => a!.localeCompare(b!, 'es')) as string[]
  }, [products])

  // Automatically select selection scope if there are items selected
  useEffect(() => {
    if (selectedIds.length > 0) {
      setScope('selection')
    } else {
      setScope('all')
    }
  }, [selectedIds, isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMsg(null)

    const pct = parseFloat(percentage)
    if (isNaN(pct) || pct === 0) {
      setError('Por favor, ingresá un porcentaje válido distinto de cero.')
      return
    }

    if (scope === 'category' && !targetCategory) {
      setError('Por favor, seleccioná una categoría.')
      return
    }

    if (scope === 'brand' && !targetBrand) {
      setError('Por favor, seleccioná una marca.')
      return
    }

    if (scope === 'selection' && selectedIds.length === 0) {
      setError('No tenés ningún producto seleccionado en la tabla.')
      return
    }

    setLoading(true)
    try {
      const targetValue = 
        scope === 'category' ? targetCategory :
        scope === 'brand' ? targetBrand : ''

      const res = await onApply({
        percentage: pct,
        roundingRule,
        scope,
        targetValue
      })

      if (res.success) {
        setSuccessMsg(`Se actualizaron con éxito los precios de ${res.count || 0} productos.`)
        setPercentage('')
        setTimeout(() => {
          setSuccessMsg(null)
          onClose()
        }, 2500)
      } else {
        setError(res.error || 'Ocurrió un error inesperado.')
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar la actualización.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 my-8">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <Percent className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base">Modificación Masiva de Precios</h3>
              <p className="text-xs text-gray-400">Incrementá o disminuí precios en lote</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Success / Error Messages */}
          {successMsg && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-semibold">
              <Check className="w-5 h-5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold">
              <span className="shrink-0 text-base">✕</span>
              <span>{error}</span>
            </div>
          )}

          {/* Scope selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">¿A qué productos se aplica?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setScope('all')}
                className={`px-4 py-3 rounded-xl border text-xs font-extrabold transition-all text-center ${
                  scope === 'all'
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Todo el catálogo
              </button>
              
              <button
                type="button"
                onClick={() => setScope('selection')}
                disabled={selectedIds.length === 0}
                className={`px-4 py-3 rounded-xl border text-xs font-extrabold transition-all text-center flex items-center justify-center gap-1.5 ${
                  selectedIds.length === 0 ? 'opacity-40 cursor-not-allowed' : ''
                } ${
                  scope === 'selection'
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Selección ({selectedIds.length})
              </button>

              <button
                type="button"
                onClick={() => setScope('category')}
                className={`px-4 py-3 rounded-xl border text-xs font-extrabold transition-all text-center ${
                  scope === 'category'
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Por Categoría
              </button>

              <button
                type="button"
                onClick={() => setScope('brand')}
                className={`px-4 py-3 rounded-xl border text-xs font-extrabold transition-all text-center ${
                  scope === 'brand'
                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Por Marca
              </button>
            </div>
          </div>

          {/* Conditional scope filters */}
          {scope === 'category' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Seleccionar Categoría</label>
              <select
                value={targetCategory}
                onChange={e => setTargetCategory(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Elegí una categoría…</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          )}

          {scope === 'brand' && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-150">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Seleccionar Marca</label>
              <select
                value={targetBrand}
                onChange={e => setTargetBrand(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Elegí una marca…</option>
                {uniqueBrands.map((brand: string) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
          )}

          {/* Percentage and Rounding */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">
                Porcentaje <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">%</span>
                <input
                  type="number"
                  step="0.01"
                  value={percentage}
                  onChange={e => setPercentage(e.target.value)}
                  placeholder="Ej: 10 o -5"
                  className={`${inputClass} pl-8`}
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium">Usa valores negativos para descontar.</p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Redondeo</label>
              <select
                value={roundingRule}
                onChange={e => setRoundingRule(e.target.value)}
                className={inputClass}
              >
                <option value="none">Sin redondeo (2 dec.)</option>
                <option value="integer">Entero más cercano</option>
                <option value="10">Múltiplos de $ 10</option>
                <option value="50">Múltiplos de $ 50</option>
                <option value="100">Múltiplos de $ 100</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Ejemplo de redondeo a $50:</p>
              <p className="opacity-90">Si el precio con porcentaje resulta en <strong className="font-semibold">$ 3.423</strong>, con redondeo a $ 50 quedará en <strong className="font-black">$ 3.400</strong>. Si resulta en <strong className="font-semibold">$ 3.428</strong> quedará en <strong className="font-black">$ 3.450</strong>.</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || percentage === ''}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-extrabold text-sm shadow-sm transition-colors cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Actualizando…
                </>
              ) : (
                'Aplicar Ajuste'
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}
