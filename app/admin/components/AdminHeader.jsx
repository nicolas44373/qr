import { ShoppingBag } from 'lucide-react'

export default function AdminHeader() {
  return (
    <header className="bg-white/90 backdrop-blur-sm shadow-lg border-b-2 border-yellow-200">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-400 p-4 rounded-xl shadow-md">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                Panel de Administración
              </h1>
              <p className="text-sm text-gray-600 font-medium">Gestión de Productos - Alenort</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}