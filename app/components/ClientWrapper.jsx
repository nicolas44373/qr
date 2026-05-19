'use client'

import { CartProvider } from '../context/CartContext'
import CartDrawer from './CartDrawer'

export default function ClientWrapper({ children }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  )
}
