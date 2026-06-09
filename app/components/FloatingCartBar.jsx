'use client'

import { useEffect, useState } from 'react'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingCartBar() {
  const { count, total, isOpen, setIsOpen } = useCart()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const checkDark = () => {
      const saved = localStorage.getItem('darkMode')
      if (saved) setIsDark(JSON.parse(saved))
    }
    checkDark()
    
    // Listen to theme changes from other components
    window.addEventListener('theme-change', checkDark)
    window.addEventListener('storage', checkDark)
    
    return () => {
      window.removeEventListener('theme-change', checkDark)
      window.removeEventListener('storage', checkDark)
    }
  }, [])

  if (count === 0 || isOpen) return null

  const formatMoney = (value) => {
    if (!value) return '$ 0,00'
    return `$ ${value.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 left-6 right-24 z-30 md:hidden"
      >
        <button
          onClick={() => setIsOpen(true)}
          className={`w-full flex items-center justify-between p-3.5 rounded-2xl border shadow-xl backdrop-blur-md transition-all text-left active:scale-[0.98] cursor-pointer ${
            isDark
              ? 'bg-gray-900/95 border-amber-500/30 text-white hover:bg-gray-800/95'
              : 'bg-white/95 border-amber-200 text-gray-900 hover:bg-amber-50/50'
          }`}
        >
          <div className="flex items-center gap-3">
            {/* Cart Icon with pulsing aura */}
            <div className="relative">
              <span className="absolute inset-0 rounded-xl bg-amber-500/30 animate-ping pointer-events-none" />
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white shadow-md relative z-10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              
              <motion.span
                key={count}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md border border-white z-20"
              >
                {count > 99 ? '99+' : count}
              </motion.span>
            </div>

            <div>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Mi Pedido ({count} {count === 1 ? 'item' : 'items'})
              </p>
              <p className="font-extrabold text-sm mt-0.5">Ver pedido</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-base font-black text-amber-500">{formatMoney(total)}</span>
            <svg className="w-4 h-4 text-amber-500 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
