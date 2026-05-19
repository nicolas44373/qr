'use client'

import { useState } from 'react'
import { useCart } from '../context/CartContext'

const fmt = (value) => {
  const n = parseFloat(value || 0)
  return `$ ${n.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const inputCls = (error) =>
  `w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
    error
      ? 'border-red-300 focus:ring-red-300 bg-red-50'
      : 'border-gray-200 focus:ring-amber-400 focus:border-amber-400 bg-white'
  }`

// ── Definido FUERA del drawer para evitar el bug de re-mount ──
function Field({ label, placeholder, required, type = 'text', value, onChange, error }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={inputCls(error)}
      />
      {error && <p className="text-red-500 text-xs mt-1 font-medium">{error}</p>}
    </div>
  )
}

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, count, total, isOpen, setIsOpen, customer, updateCustomer } = useCart()

  const [errors, setErrors]       = useState({})
  const [dni, setDni]             = useState('')
  const [dniStatus, setDniStatus] = useState(null)   // 'found' | 'not-found' | null
  const [saveData, setSaveData]   = useState(false)

  const STORAGE_KEY = (d) => `alenort-cliente-${d.trim()}`

  // ── Buscar datos por DNI ──
  const handleLookup = () => {
    const key = dni.trim()
    if (!key) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY(key))
      if (raw) {
        const saved = JSON.parse(raw)
        updateCustomer('nombre',     saved.nombre     || '')
        updateCustomer('celular',    saved.celular     || '')
        updateCustomer('direccion',  saved.direccion  || '')
        updateCustomer('referencia', saved.referencia || '')
        setDniStatus('found')
        setErrors({})
      } else {
        setDniStatus('not-found')
      }
    } catch {
      setDniStatus('not-found')
    }
  }

  // ── Validación ──
  const validate = () => {
    const e = {}
    if (!customer.nombre.trim())    e.nombre    = 'El nombre es requerido'
    if (!customer.celular.trim())   e.celular   = 'El celular es requerido'
    if (!customer.direccion.trim()) e.direccion = 'La dirección es requerida'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const clearField = (field) => (e) => {
    updateCustomer(field, e.target.value)
    if (errors[field]) setErrors(p => ({ ...p, [field]: null }))
  }

  // ── Enviar por WhatsApp ──
  const sendToWhatsApp = () => {
    if (items.length === 0) return
    if (!validate()) return

    // Guardar si el cliente lo pidió
    if (saveData && dni.trim()) {
      localStorage.setItem(STORAGE_KEY(dni), JSON.stringify({
        nombre:     customer.nombre,
        celular:    customer.celular,
        direccion:  customer.direccion,
        referencia: customer.referencia,
      }))
    }

    const date  = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
    const lines = items.map(item => {
      const sub  = parseFloat(item.price || 0) * item.quantity
      const unit = item.unit ? ` (${item.unit})` : ''
      return `  • ${item.name}${unit}\n    Cantidad: ${item.quantity} × ${fmt(item.price)} = *${fmt(sub.toString())}*`
    })

    const message = [
      '🛒 *PEDIDO — ALENORT*',
      `📅 Fecha: ${date}`,
      '',
      '─────────────────────',
      '👤 *Datos del cliente:*',
      `  • Nombre: ${customer.nombre}`,
      `  • Celular: ${customer.celular}`,
      `  • Dirección: ${customer.direccion}`,
      customer.referencia.trim() ? `  • Referencia: ${customer.referencia}` : null,
      '',
      '─────────────────────',
      '📦 *Detalle del pedido:*',
      '',
      ...lines,
      '',
      '─────────────────────',
      `💰 *TOTAL ESTIMADO: ${fmt(total.toString())}*`,
      '─────────────────────',
      '',
      '⏰ Horario de pedidos: 8:30 a 20:00 hs',
      '🚚 Reparto al día siguiente · 9:00 a 15:00 hs',
      '',
      'Por favor confirmen disponibilidad y datos de entrega.',
      '¡Muchas gracias! 🙌',
    ].filter(l => l !== null).join('\n')

    window.open(`https://wa.me/+5493812224766?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🛒</span>
            <h2 className="font-extrabold text-gray-900 text-lg">Mi Pedido</h2>
            {count > 0 && (
              <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                {count}
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Vacío */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <div className="text-7xl mb-5">🛒</div>
            <p className="font-extrabold text-gray-800 text-xl mb-2">Tu pedido está vacío</p>
            <p className="text-gray-400 text-sm mb-8">Explorá el catálogo y agregá los productos que querés</p>
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-2xl transition-colors text-sm shadow-sm"
            >
              Ver catálogo →
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto">

              {/* ── Productos ── */}
              <div className="px-4 pt-4 pb-2 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">Productos</p>
                {items.map(item => {
                  const subtotal = parseFloat(item.price || 0) * item.quantity
                  return (
                    <div key={item.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{item.name}</p>
                          {item.categoryName && <p className="text-xs text-gray-400 mt-0.5">{item.categoryName}</p>}
                          <p className="text-xs text-gray-400 mt-0.5">{fmt(item.price)} c/u</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="shrink-0 p-1 text-gray-300 hover:text-red-500 rounded-lg transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-red-300 hover:text-red-500 transition-colors font-bold text-lg leading-none"
                          >−</button>
                          <span className="w-8 text-center font-extrabold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors font-bold text-lg leading-none"
                          >+</button>
                        </div>
                        <p className="font-extrabold text-emerald-700 text-base">{fmt(subtotal.toString())}</p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* ── Datos del cliente ── */}
              <div className="px-4 pt-3 pb-6 space-y-4">

                {/* Recuperar datos por DNI */}
                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                  <p className="text-xs font-extrabold text-amber-800 uppercase tracking-wide mb-3">
                    🔑 ¿Ya guardaste tus datos?
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={dni}
                      onChange={e => { setDni(e.target.value); setDniStatus(null) }}
                      onKeyDown={e => e.key === 'Enter' && handleLookup()}
                      placeholder="Ingresá tu DNI"
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-amber-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                    />
                    <button
                      onClick={handleLookup}
                      className="shrink-0 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm rounded-xl transition-colors"
                    >
                      Buscar
                    </button>
                  </div>

                  {dniStatus === 'found' && (
                    <div className="mt-2.5 flex items-center gap-2 text-emerald-700 text-xs font-semibold">
                      <span className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px]">✓</span>
                      ¡Datos recuperados! Revisá que estén correctos.
                    </div>
                  )}
                  {dniStatus === 'not-found' && (
                    <p className="mt-2.5 text-amber-700 text-xs font-semibold">
                      No encontramos datos guardados para este DNI.
                    </p>
                  )}
                </div>

                {/* Formulario */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 space-y-3.5">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <p className="text-sm font-extrabold text-gray-800">Datos para la entrega</p>
                  </div>

                  <Field
                    label="Nombre" placeholder="Ej: Juan Pérez" required
                    value={customer.nombre}
                    onChange={clearField('nombre')}
                    error={errors.nombre}
                  />
                  <Field
                    label="Celular" placeholder="Ej: 381 123-4567" required type="tel"
                    value={customer.celular}
                    onChange={clearField('celular')}
                    error={errors.celular}
                  />
                  <Field
                    label="Dirección" placeholder="Ej: Av. Belgrano 1234" required
                    value={customer.direccion}
                    onChange={clearField('direccion')}
                    error={errors.direccion}
                  />
                  <Field
                    label="Referencia" placeholder="Entre calles, local, piso…"
                    value={customer.referencia}
                    onChange={e => updateCustomer('referencia', e.target.value)}
                    error={null}
                  />

                  {/* Guardar datos */}
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <div className="relative mt-0.5 shrink-0">
                      <input
                        type="checkbox"
                        checked={saveData}
                        onChange={e => setSaveData(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-5 h-5 rounded-md border-2 border-gray-300 bg-white peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-colors flex items-center justify-center">
                        {saveData && (
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Guardar mis datos para la próxima vez</p>
                      {saveData && !dni.trim() && (
                        <p className="text-amber-600 text-xs mt-0.5 font-medium">Ingresá tu DNI arriba para guardar</p>
                      )}
                      {saveData && dni.trim() && (
                        <p className="text-emerald-600 text-xs mt-0.5 font-medium">Se guardará con DNI {dni.trim()}</p>
                      )}
                    </div>
                  </label>
                </div>

              </div>
            </div>

            {/* ── Footer ── */}
            <div className="border-t border-gray-100 px-5 py-4 space-y-3 shrink-0">
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl px-4 py-3">
                <p className="font-bold text-gray-600 text-sm">Total estimado</p>
                <p className="font-extrabold text-gray-900 text-2xl tracking-tight">{fmt(total.toString())}</p>
              </div>

              <p className="text-xs text-gray-400 text-center leading-relaxed">
                Los precios son orientativos. Confirmamos disponibilidad y precio final por WhatsApp.
              </p>

              <button
                onClick={sendToWhatsApp}
                className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-base"
              >
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Enviar pedido por WhatsApp
              </button>

              <button
                onClick={clearCart}
                className="w-full text-center text-xs text-gray-400 hover:text-red-500 transition-colors py-1 font-medium"
              >
                🗑 Limpiar carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
