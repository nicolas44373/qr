import { Search } from 'lucide-react'

export default function ProductFilters({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories }) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Buscar productos…"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
        />
      </div>
      <select
        value={selectedCategory}
        onChange={e => setSelectedCategory(e.target.value)}
        className="shrink-0 px-3 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all min-w-[150px] sm:min-w-[180px]"
      >
        <option value="all">Todas las categorías</option>
        {categories.map(c => (
          <option key={c.id} value={c.id.toString()}>{c.name}</option>
        ))}
      </select>
    </div>
  )
}
