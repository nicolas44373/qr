import { Loader } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-50 flex items-center justify-center">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-yellow-200">
        <div className="text-center">
          <Loader className="h-12 w-12 text-yellow-500 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Cargando datos...</h2>
          <p className="text-gray-500">Conectando con la base de datos</p>
        </div>
      </div>
    </div>
  )
}