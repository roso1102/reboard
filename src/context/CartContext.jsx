import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'egrade-cart'

function loadCart() {
  try {
    const raw = sessionStorage.getItem(CART_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed) ? parsed : []
    }
  } catch (_) {}
  return []
}

function saveCart(items) {
  try {
    sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  } catch (_) {}
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)

  useEffect(() => {
    saveCart(items)
  }, [items])

  const addItem = useCallback((component, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === component.id)
      if (existing) {
        return prev.map((i) =>
          i.id === component.id ? { ...i, quantity: (i.quantity ?? 1) + quantity } : i
        )
      }
      return [...prev, { ...component, quantity }]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, i) => sum + (i.quantity ?? 1), 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
