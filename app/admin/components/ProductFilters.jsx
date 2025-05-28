import { Search } from 'lucide-react'

export default function ProductFilters({ 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  categories 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-500 h-5 w-5" />
        <input
          type="text"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-6 py-3 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-black placeholder-gray"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-yellow-200 rounded-xl focus:ring-4 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-200 text-black"
      >
        <option value="all">Todas las categorías</option>
        {categories.map(category => (
          <option key={category.id} value={category.id.toString()}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
