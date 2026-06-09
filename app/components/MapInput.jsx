'use client'

import React, { useEffect, useState, useRef } from 'react'
import { MapPin, Search, Loader2 } from 'lucide-react'

const DEFAULT_LAT = -26.82414
const DEFAULT_LNG = -65.22260

export default function MapInput({ address, onChangeAddress, lat, lng, onChangeCoords }) {
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const [query, setQuery] = useState(address || '')
  const [suggestions, setSuggestions] = useState([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markerInstanceRef = useRef(null)
  const debounceTimer = useRef(null)

  // 1. Cargar Leaflet desde CDN
  useEffect(() => {
    if (window.L) {
      setLeafletLoaded(true)
      return
    }

    const linkId = 'leaflet-css'
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link')
      link.id = linkId
      link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }

    const scriptId = 'leaflet-js'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.async = true
      script.onload = () => {
        setLeafletLoaded(true)
      }
      document.body.appendChild(script)
    } else {
      const interval = setInterval(() => {
        if (window.L) {
          setLeafletLoaded(true)
          clearInterval(interval)
        }
      }, 100)
      return () => clearInterval(interval)
    }
  }, [])

  // 2. Inicializar el mapa
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current) return

    const L = window.L
    const initialLat = lat || DEFAULT_LAT
    const initialLng = lng || DEFAULT_LNG

    // Crear mapa
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([initialLat, initialLng], 15)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(map)

      // Añadir control de zoom abajo a la derecha para diseño móvil
      L.control.zoom({ position: 'bottomright' }).addTo(map)

      mapInstanceRef.current = map
    }

    const map = mapInstanceRef.current

    // Pulsing custom pin icon using Leaflet divIcon
    const pulsingIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center">
          <div class="absolute w-10 h-10 bg-amber-500 rounded-full opacity-35 animate-ping" style="margin-top:-1px;"></div>
          <div class="w-7 h-7 bg-amber-500 border-2 border-white rounded-full shadow-lg flex items-center justify-center transform -translate-y-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-4 h-4 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
      `,
      className: 'custom-marker-pin',
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    })

    // Actualizar o crear marcador
    if (!markerInstanceRef.current) {
      const marker = L.marker([initialLat, initialLng], {
        icon: pulsingIcon,
        draggable: true
      }).addTo(map)

      // Escuchar el arrastre del pin
      marker.on('dragend', async (event) => {
        const pos = event.target.getLatLng()
        onChangeCoords(pos.lat, pos.lng)
        
        // Reverse geocoding para obtener la dirección aproximada del pin arrastrado
        const prettyAddress = await reverseGeocode(pos.lat, pos.lng)
        if (prettyAddress) {
          onChangeAddress(prettyAddress)
          setQuery(prettyAddress)
        }
      })

      markerInstanceRef.current = marker
    } else {
      markerInstanceRef.current.setLatLng([initialLat, initialLng])
      map.setView([initialLat, initialLng], map.getZoom())
    }

    // Limpieza al desmontar
    return () => {
      // Dejamos el mapa vivo o lo limpiamos. Es mejor no destruirlo en cada renderizado pequeño,
      // pero si cambia la referencia se reconstruirá
    }
  }, [leafletLoaded, lat, lng])

  // Geocodificación Inversa (Coordenadas -> Dirección)
  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await response.json()
      if (data && data.address) {
        const addr = data.address
        const road = addr.road || ''
        const houseNumber = addr.house_number || ''
        const suburb = addr.suburb || addr.neighbourhood || addr.city_district || ''
        const city = addr.city || addr.town || addr.village || ''

        if (road) {
          return `${road} ${houseNumber}${suburb ? `, ${suburb}` : ''}${city ? `, ${city}` : ''}`.trim()
        }
        return data.display_name
      }
    } catch (error) {
      console.error('Error en geocodificación inversa:', error)
    }
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`
  }

  // Búsqueda de Direcciones (Autocompletar)
  const searchAddress = async (searchText) => {
    if (!searchText.trim() || searchText.length < 3) {
      setSuggestions([])
      return
    }

    setSearching(true)
    try {
      // Sesgamos la búsqueda para Argentina (ar) y especialmente enfocamos en la zona de interés
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}&countrycodes=ar&limit=5&addressdetails=1`,
        { headers: { 'Accept-Language': 'es' } }
      )
      const data = await response.json()

      const formatted = data.map((item) => {
        const addr = item.address
        const road = addr.road || ''
        const number = addr.house_number || ''
        const city = addr.city || addr.town || addr.village || ''
        const state = addr.state || ''
        
        let label = item.display_name
        if (road) {
          label = `${road} ${number}${city ? `, ${city}` : ''}${state ? `, ${state}` : ''}`.replace(/,\s*,/g, ',')
        }

        return {
          label,
          lat: parseFloat(item.lat),
          lng: parseFloat(item.lon)
        }
      })
      
      setSuggestions(formatted)
      setShowDropdown(formatted.length > 0)
    } catch (error) {
      console.error('Error al autocompletar dirección:', error)
    } finally {
      setSearching(false)
    }
  }

  // Manejar cambios en el input con debounce
  const handleInputChange = (e) => {
    const val = e.target.value
    setQuery(val)
    onChangeAddress(val) // Actualizar campo de texto del cliente inmediatamente

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      searchAddress(val)
    }, 600)
  }

  const handleSelectSuggestion = (sugg) => {
    onChangeAddress(sugg.label)
    setQuery(sugg.label)
    onChangeCoords(sugg.lat, sugg.lng)
    setSuggestions([])
    setShowDropdown(false)

    // Centrar mapa
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([sugg.lat, sugg.lng], 16)
    }
    if (markerInstanceRef.current) {
      markerInstanceRef.current.setLatLng([sugg.lat, sugg.lng])
    }
  }

  return (
    <div className="space-y-3">
      {/* Buscador Autocompletable */}
      <div className="relative">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Dirección de entrega <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.length >= 3 && setSuggestions(suggestions.length > 0 ? suggestions : [])}
            placeholder="Ej: Av. Sarmiento 100, Tucumán"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 bg-white transition-all shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search className="h-4 w-4" />
          </div>
          {searching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-amber-500">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          )}
        </div>

        {/* Dropdown de sugerencias */}
        {showDropdown && suggestions.length > 0 && (
          <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-xl shadow-xl max-h-56 overflow-y-auto divide-y divide-gray-50 animate-in fade-in duration-200">
            {suggestions.map((sugg, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSuggestion(sugg)}
                className="w-full text-left px-4 py-3 text-xs text-gray-700 hover:bg-amber-50/50 hover:text-amber-900 transition-colors flex items-start gap-2.5"
              >
                <MapPin className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                <span className="font-semibold">{sugg.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Contenedor del Mapa */}
      <div className="relative rounded-2xl border border-gray-100 overflow-hidden shadow-inner bg-gray-50">
        {!leafletLoaded && (
          <div className="h-48 w-full flex flex-col items-center justify-center gap-2 text-gray-400">
            <Loader2 className="h-6 w-6 animate-spin text-amber-500" />
            <p className="text-xs font-medium">Cargando mapa interactivo...</p>
          </div>
        )}
        <div 
          ref={mapRef} 
          className="h-48 w-full z-10" 
          style={{ visibility: leafletLoaded ? 'visible' : 'hidden', position: leafletLoaded ? 'relative' : 'absolute' }}
        />
        {leafletLoaded && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg pointer-events-none">
            <p className="text-[10px] text-white font-bold flex items-center gap-1">
              📍 Arrastrá el pin para ajustar precisión
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
