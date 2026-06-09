'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext(null)

const emptyCustomer = { nombre: '', celular: '', direccion: '', referencia: '', lat: null, lng: null }

export function CartProvider({ children }) {
  const [items, setItems]       = useState([])
  const [isOpen, setIsOpen]     = useState(false)
  const [customer, setCustomer] = useState(emptyCustomer)

  // Restaurar desde localStorage
  useEffect(() => {
    try {
      const savedItems    = localStorage.getItem('alenort-cart')
      const savedCustomer = localStorage.getItem('alenort-customer')
      if (savedItems)    setItems(JSON.parse(savedItems))
      if (savedCustomer) setCustomer(JSON.parse(savedCustomer))
    } catch {}
  }, [])

  useEffect(() => { localStorage.setItem('alenort-cart', JSON.stringify(items)) }, [items])
  useEffect(() => { localStorage.setItem('alenort-customer', JSON.stringify(customer)) }, [customer])

  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { ...product, quantity: 1 }]
    })
  }, [])

  const removeItem  = useCallback((id) => setItems(prev => prev.filter(i => i.id !== id)), [])

  const updateQty   = useCallback((id, qty) => {
    if (qty <= 0) setItems(prev => prev.filter(i => i.id !== id))
    else          setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i))
  }, [])

  const clearCart   = useCallback(() => setItems([]), [])

  const getQty      = useCallback((id) => items.find(i => i.id === id)?.quantity ?? 0, [items])

  const updateCustomer = useCallback((field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }))
  }, [])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + (parseFloat(i.price || 0) * i.quantity), 0)

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart, getQty,
      count, total,
      isOpen, setIsOpen,
      customer, updateCustomer,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
