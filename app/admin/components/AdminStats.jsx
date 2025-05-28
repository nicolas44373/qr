import { Package, Filter, Search } from 'lucide-react'

export default function AdminStats({ products, categories, filteredProducts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-600 font-semibold">Total Productos</p>
            <p className="text-3xl font-bold text-gray-800">{products.length}</p>
          </div>
          <Package className="h-12 w-12 text-yellow-400" />
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-600 font-semibold">Categorías</p>
            <p className="text-3xl font-bold text-gray-800">{categories.length}</p>
          </div>
          <Filter className="h-12 w-12 text-yellow-400" />
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border-2 border-yellow-200 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-600 font-semibold">Productos Filtrados</p>
            <p className="text-3xl font-bold text-gray-800">{filteredProducts.length}</p>
          </div>
          <Search className="h-12 w-12 text-yellow-400" />
        </div>
      </div>
    </div>
  )
}