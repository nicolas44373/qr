// components/ProductsTable.tsx
import { Edit2, Trash2, Package } from 'lucide-react'

export default function ProductsTable({ 
  products, 
  onEdit, 
  onDelete, 
  submitting 
}) {
  const formatPrice = (price) => {
    if (price === null || price === undefined || price === '') return '-'
    const num = typeof price === 'string' ? parseFloat(price) : price
    if (isNaN(num)) return '-'
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num)
  }

  const handleDelete = async (productId) => {
    if (!confirm('¿Estás seguro de que querés eliminar este producto?')) {
      return
    }
    const result = await onDelete(productId)
    if (result.success) {
      alert('Producto eliminado exitosamente')
    } else {
      alert('Error al eliminar el producto')
    }
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border-2 border-yellow-200">
      <div className="bg-gradient-to-r from-yellow-400 to-amber-400 px-6 py-4">
        <h3 className="text-xl font-bold text-white">
          Productos ({products.length})
        </h3>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No se encontraron productos</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-50">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-gray-700">Producto</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Marca</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Categoría</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Precio unidad</th>
                <th className="text-center px-6 py-4 font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr
                  key={product.id}
                  className={`border-b border-yellow-100 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-yellow-25'
                  } hover:bg-yellow-50 transition-colors`}
                >
                  <td className="px-6 py-4 font-medium text-gray-800">{product.name}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-purple-100 text-purple-700 text-sm font-medium px-3 py-1 rounded-full">
                      {product.marca || 'Sin marca'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full">
                      {product.category_name || 'Sin categoría'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-semibold text-green-600">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        disabled={submitting}
                        className="bg-blue-100 hover:bg-blue-200 disabled:opacity-50 text-blue-600 p-2 rounded-lg transition-colors"
                        title="Editar producto"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={submitting}
                        className="bg-red-100 hover:bg-red-200 disabled:opacity-50 text-red-600 p-2 rounded-lg transition-colors"
                        title="Eliminar producto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
