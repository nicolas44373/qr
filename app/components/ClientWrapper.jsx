'use client'

import { ClubProvider } from '../context/ClubContext'
import { CartProvider } from '../context/CartContext'
import CartDrawer from './CartDrawer'
import ClubModal from './ClubModal'
import FloatingCartBar from './FloatingCartBar'

export default function ClientWrapper({ children }) {
  return (
    <ClubProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <ClubModal />
        <FloatingCartBar />
      </CartProvider>
    </ClubProvider>
  )
}
