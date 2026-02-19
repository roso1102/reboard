import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { MOCK_COMPONENTS, MOCK_SELLER_LISTINGS, LAYER_NAMES } from '../data/mockData'

const StoreContext = createContext(null)

const STORE_KEY = 'reboard-store'
const ORDERS_KEY = 'reboard-orders'

function loadFromStorage(key, fallback) {
  try {
    const raw = sessionStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch {}
  return fallback
}

function saveToStorage(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify(data)) } catch {}
}

function buildComponentFromResult(componentType, modelName, category, serial, result) {
  const id = `comp-${Date.now().toString(36)}`
  const layers = {}
  LAYER_NAMES.forEach((l) => { layers[l] = !!result.layers?.[l] })

  return {
    id,
    name: componentType || 'Unknown Component',
    type: category || 'Microcontroller',
    category: category || 'Microcontroller',
    imageUrl: '',
    grade: result.grade || 'C',
    reusability: result.reusability || 50,
    layers,
    price: parseInt((result.estimatedValue || '₹200').replace(/[^0-9]/g, '')) || 200,
    seller: 'You',
    sellerType: 'Verified Seller',
    location: 'Local',
    quantity: 1,
    status: 'Internal',
    serialNumber: serial || id,
    capabilityMatrix: result.capabilityMatrix || LAYER_NAMES.map((l) => ({
      feature: l, status: layers[l] ? 'Working' : 'N/A', notes: layers[l] ? 'Tested' : '—',
    })),
    useCases: result.useCases || ['Prototyping'],
    testTimestamp: new Date().toISOString(),
    modelName: modelName || '',
    co2Saved: result.co2Saved || '~0.2 kg',
    recommendation: result.recommendation || '',
  }
}

export function StoreProvider({ children }) {
  const [components, setComponents] = useState(() =>
    loadFromStorage(STORE_KEY, MOCK_COMPONENTS)
  )
  const [orders, setOrders] = useState(() =>
    loadFromStorage(ORDERS_KEY, [])
  )

  useEffect(() => { saveToStorage(STORE_KEY, components) }, [components])
  useEffect(() => { saveToStorage(ORDERS_KEY, orders) }, [orders])

  const addComponent = useCallback((componentType, modelName, category, serial, result, listOnMarketplace = false) => {
    const comp = buildComponentFromResult(componentType, modelName, category, serial, result)
    comp.status = listOnMarketplace ? 'Listed' : 'Internal'
    setComponents((prev) => [comp, ...prev])
    return comp
  }, [])

  const listComponent = useCallback((id) => {
    setComponents((prev) => prev.map((c) => c.id === id ? { ...c, status: 'Listed' } : c))
  }, [])

  const unlistComponent = useCallback((id) => {
    setComponents((prev) => prev.map((c) => c.id === id ? { ...c, status: 'Internal' } : c))
  }, [])

  const marketplaceComponents = components.filter((c) => c.status === 'Listed')
  const inventoryComponents = components
  const sellerListings = components.filter((c) => c.status === 'Listed' && c.seller === 'You')

  const placeOrder = useCallback((cartItems, buyerInfo) => {
    const order = {
      id: `ORD-${Date.now().toString(36).toUpperCase()}`,
      items: cartItems.map((i) => ({
        componentId: i.id,
        name: i.name,
        grade: i.grade,
        price: i.price,
        quantity: i.quantity ?? 1,
      })),
      buyer: buyerInfo,
      total: cartItems.reduce((s, i) => s + (i.price || 0) * (i.quantity ?? 1), 0),
      status: 'Confirmed',
      placedAt: new Date().toISOString(),
    }
    setOrders((prev) => [order, ...prev])

    setComponents((prev) => prev.map((c) => {
      const ordered = cartItems.find((i) => i.id === c.id)
      if (ordered) {
        const newQty = Math.max(0, (c.quantity || 1) - (ordered.quantity ?? 1))
        return { ...c, quantity: newQty, status: newQty === 0 ? 'Sold' : c.status }
      }
      return c
    }))

    return order
  }, [])

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status } : o))
  }, [])

  return (
    <StoreContext.Provider value={{
      components: inventoryComponents,
      marketplaceComponents,
      sellerListings,
      orders,
      addComponent,
      listComponent,
      unlistComponent,
      placeOrder,
      updateOrderStatus,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
