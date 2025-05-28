// components/WhatsAppFAB.jsx
import React from 'react'
import { MessageCircle } from 'lucide-react'

const WhatsAppFAB = ({ showMenu, setShowMenu, onContact }) => {
  return (
    <div className="fixed bottom-6 right-6 z-30">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-ping opacity-75"></div>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse opacity-50 scale-110"></div>
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="relative bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 
                     transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out
                     p-4 rounded-full shadow-2xl text-white flex items-center justify-center
                     border-4 border-white/20 backdrop-blur-sm animate-bounce-gentle"
          aria-label="Contactar por WhatsApp"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/30 to-emerald-400/30 animate-spin-slow"></div>
          <MessageCircle className={`h-7 w-7 relative z-10 transition-transform duration-300 ${showMenu ? 'rotate-12 scale-110' : ''}`} />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-bounce opacity-80"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-400 rounded-full animate-bounce opacity-60" style={{animationDelay: '0.5s'}}></div>
        </button>
      </div>

      {showMenu && (
        <div className="mt-4 relative">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-2xl"></div>
          <div className="relative bg-gradient-to-br from-white/95 to-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden w-56 transform animate-in slide-in-from-bottom-5 duration-300">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-400 via-emerald-400 to-green-500 opacity-20 animate-pulse"></div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3 text-center">
              <h3 className="text-white font-bold text-sm flex items-center justify-center gap-2">
                <MessageCircle className="h-4 w-4 animate-pulse" />
                ¡Contáctanos Ahora!
              </h3>
            </div>
            <div className="p-2 space-y-1">
              <button
                onClick={() => onContact('minorista')}
                className="group relative w-full py-3 px-4 rounded-xl overflow-hidden
                           bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100
                           border border-green-200/50 hover:border-green-300
                           transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                           text-green-800 font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <span>🛍️ Contacto Minorista</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                </div>
              </button>

              <button
                onClick={() => onContact('mayorista')}
                className="group relative w-full py-3 px-4 rounded-xl overflow-hidden
                           bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100
                           border border-blue-200/50 hover:border-blue-300
                           transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                           text-blue-800 font-semibold"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                               translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-between">
                  <span>🏢 Contacto Mayorista</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                </div>
              </button>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-2 text-center border-t border-gray-200/50">
              <p className="text-xs text-gray-600 font-medium">
                ✨ Respuesta inmediata garantizada
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WhatsAppFAB