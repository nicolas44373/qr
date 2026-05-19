'use client'

import { useCart } from '../context/CartContext'

export default function Header() {
  const { count, setIsOpen } = useCart()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-sm shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xl font-extrabold text-gray-900 leading-none tracking-tight">Alenort</p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">Venta Mayorista</p>
          </div>
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-3">
          {/* Badge envío gratis — solo desktop */}
          <div className="hidden sm:flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full">
            <span>🚚</span>
            <span>Envíos gratis</span>
          </div>

          {/* Botón carrito */}
          <button
            onClick={() => setIsOpen(true)}
            className="relative flex items-center gap-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="hidden sm:inline">Mi pedido</span>
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  )
}
