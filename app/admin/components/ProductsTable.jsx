import { Edit2, Trash2, Package } from 'lucide-react'

const fmt = (price) => {
  if (price === null || price === undefined || price === '') return '—'
  const n = parseFloat(price)
  if (isNaN(n)) return '—'
  return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(n)
}

export default function ProductsTable({ products, onEdit, onDelete, submitting, editingId }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-extrabold text-gray-900 text-base">
          Productos
        </h3>
        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
          {products.length} resultado{products.length !== 1 ? 's' : ''}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Package className="h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500 font-semibold text-sm">No se encontraron productos</p>
          <p className="text-gray-400 text-xs mt-1">Probá con otro filtro o buscador</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Producto</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Categoría</th>
                <th className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:table-cell">Marca</th>
                <th className="text-right px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide">Precio</th>
                <th className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-center w-24">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map(product => {
                const isEditing = editingId === product.id
                return (
                  <tr
                    key={product.id}
                    className={`transition-colors ${isEditing ? 'bg-amber-50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {isEditing && (
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-amber-500" />
                        )}
                        <span className={`font-semibold ${isEditing ? 'text-amber-800' : 'text-gray-800'} line-clamp-1`}>
                          {product.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="inline-block text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        {product.category_name || 'Sin categoría'}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {product.marca ? (
                        <span className="inline-block text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-0.5 rounded-full">
                          {product.marca}
                        </span>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <span className="font-bold text-emerald-700 whitespace-nowrap">
                        {fmt(product.price)}
                      </span>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => onEdit(product)}
                          disabled={submitting}
                          title="Editar"
                          className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 hover:text-blue-700 disabled:opacity-40 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(product)}
                          disabled={submitting}
                          title="Eliminar"
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-40 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
