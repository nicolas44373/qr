// components/EpicChickLoading.jsx
'use client'

import React, { useState, useEffect } from 'react'

const EpicChickLoading = () => {
  const [particles, setParticles] = useState([])

  useEffect(() => {
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      animationDelay: Math.random() * 2,
      animationDuration: 2 + Math.random() * 2
    }))
    setParticles(generatedParticles)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-100 relative overflow-hidden">
      {/* Partículas de fondo flotantes */}
      <div className="absolute inset-0">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-yellow-300 rounded-full opacity-30 animate-bounce"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`
            }}
          />
        ))}
      </div>

      {/* Container principal */}
      <div className="text-center z-10 relative">
        {/* Pollito animado */}
        <div className="relative mb-8">
          <div className="relative inline-block animate-bounce">
            {/* Cuerpo principal */}
            <div className="w-24 h-20 bg-gradient-to-b from-yellow-300 to-yellow-400 rounded-full relative transform hover:scale-110 transition-transform duration-300">
              {/* Pico */}
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-orange-400 animate-pulse"></div>
              </div>
              
              {/* Ojos */}
              <div className="absolute top-4 left-6 w-3 h-3 bg-black rounded-full animate-blink"></div>
              <div className="absolute top-4 right-6 w-3 h-3 bg-black rounded-full animate-blink"></div>
              
              {/* Mejillas rosadas */}
              <div className="absolute top-8 left-2 w-4 h-3 bg-pink-300 rounded-full opacity-60"></div>
              <div className="absolute top-8 right-2 w-4 h-3 bg-pink-300 rounded-full opacity-60"></div>
            </div>
            
            {/* Alas */}
            <div className="absolute top-2 -left-3 w-8 h-6 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-full transform rotate-12 animate-flap origin-right"></div>
            <div className="absolute top-2 -right-3 w-8 h-6 bg-gradient-to-bl from-yellow-200 to-yellow-300 rounded-full transform -rotate-12 animate-flap origin-left"></div>
            
            {/* Patitas */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <div className="w-2 h-4 bg-orange-400 rounded-sm animate-wiggle"></div>
              <div className="w-2 h-4 bg-orange-400 rounded-sm animate-wiggle" style={{animationDelay: '0.1s'}}></div>
            </div>
          </div>
          
          {/* Efectos de brillo */}
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-20 rounded-full animate-shimmer"></div>
        </div>

        {/* Texto con efectos */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-600 bg-clip-text text-transparent animate-pulse">
            ¡Cargando catálogo!
          </h2>
          
          {/* Barra de progreso animada */}
          <div className="w-64 h-3 bg-yellow-200 rounded-full mx-auto overflow-hidden shadow-inner">
            <div className="h-full bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 rounded-full animate-progress shadow-lg"></div>
          </div>
          
          <p className="text-yellow-700 font-medium animate-fade-in-out">
            Preparando los mejores productos para ti...
          </p>
          
          {/* Huevos decorativos saltarines */}
          <div className="flex justify-center space-x-4 mt-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-4 h-5 bg-gradient-to-b from-white to-gray-100 rounded-full border-2 border-yellow-300 animate-bounce shadow-lg"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 1; }
          40% { opacity: 0; }
        }
        
        @keyframes flap {
          0%, 100% { transform: rotate(12deg) translateY(0px); }
          50% { transform: rotate(25deg) translateY(-2px); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        @keyframes shimmer {
          0% { opacity: 0.2; }
          50% { opacity: 0.4; }
          100% { opacity: 0.2; }
        }
        
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
        
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
        
        .animate-blink {
          animation: blink 2s infinite;
        }
        
        .animate-flap {
          animation: flap 0.8s ease-in-out infinite;
        }
        
        .animate-wiggle {
          animation: wiggle 1.5s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-progress {
          animation: progress 3s ease-in-out infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default EpicChickLoading;