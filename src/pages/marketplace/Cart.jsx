import { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import GradeBadge from '../../components/GradeBadge'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart()
  const [orderPlaced, setOrderPlaced] = useState(false)

  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity ?? 1), 0)

  const handlePlaceOrder = () => {
    setOrderPlaced(true)
    clearCart()
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center animate-fade-in-up">
          <h2 className="text-xl font-bold text-gray-900">Order placed successfully (demo)</h2>
          <p className="mt-2 text-gray-500">This is a demo. No payment was processed.</p>
          <Link to="/marketplace" className="mt-6 inline-block">
            <Button variant="primary">Back to Marketplace</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">E-Grade</Link>
          <Link to="/marketplace" className="text-sm text-gray-500 hover:text-gray-900 font-semibold">← Marketplace</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Cart ({totalItems})</h1>

        {items.length === 0 ? (
          <Card className="mt-6 py-12 text-center">
            <p className="text-gray-500 font-semibold">Your cart is empty.</p>
            <Link to="/marketplace" className="mt-4 inline-block">
              <Button variant="primary">Browse Marketplace</Button>
            </Link>
          </Card>
        ) : (
          <>
            <div className="mt-6 space-y-4">
              {items.map((i) => (
                <Card key={i.id} className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-900">{i.name}</p>
                    <GradeBadge grade={i.grade} showLabel={false} className="mt-1" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(i.id, (i.quantity ?? 1) - 1)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{i.quantity ?? 1}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(i.id, (i.quantity ?? 1) + 1)}
                        className="w-8 h-8 rounded-lg border-2 border-gray-200 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                    <p className="font-bold text-gray-900 w-20">₹{(i.price || 0) * (i.quantity ?? 1)}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(i.id)}
                      className="text-sm text-red-600 hover:underline font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-lg font-bold text-gray-900">Subtotal: ₹{subtotal}</p>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={clearCart}>Clear cart</Button>
                <Button variant="primary" onClick={handlePlaceOrder}>Place order (demo)</Button>
              </div>
            </Card>
            <p className="mt-2 text-sm text-gray-500">No payment will be processed. This is a demo flow.</p>
          </>
        )}
      </main>
    </div>
  )
}
