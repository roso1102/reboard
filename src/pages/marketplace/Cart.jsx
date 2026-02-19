import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import GradeBadge from '../../components/GradeBadge'
import { useCart } from '../../context/CartContext'

export default function Cart() {
  const { items, removeItem, updateQuantity, clearCart, totalItems } = useCart()

  const subtotal = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity ?? 1), 0)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 z-30 bg-white/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">Re<span className="text-green-600">Board</span></Link>
          <Link to="/marketplace" className="text-sm text-gray-500 hover:text-gray-900 font-medium">← Marketplace</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900">Cart ({totalItems})</h1>

        {items.length === 0 ? (
          <div className="mt-12 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
              </svg>
            </div>
            <p className="text-gray-500">Your cart is empty.</p>
            <Link to="/marketplace" className="mt-3 inline-block text-green-600 hover:text-green-700 font-medium">
              Browse Marketplace →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {items.map((i) => (
                <div key={i.id} className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                      {i.imageUrl ? (
                        <img src={i.imageUrl} alt={i.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[9px] font-bold text-gray-400">{i.name?.slice(0, 3)}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{i.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <GradeBadge grade={i.grade} showLabel={false} />
                        <span className="text-xs text-gray-400">₹{i.price} each</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <button type="button" onClick={() => updateQuantity(i.id, (i.quantity ?? 1) - 1)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm">−</button>
                      <span className="w-8 text-center text-sm font-bold">{i.quantity ?? 1}</span>
                      <button type="button" onClick={() => updateQuantity(i.id, (i.quantity ?? 1) + 1)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold text-sm">+</button>
                    </div>
                    <p className="font-bold text-gray-900 w-20 text-right">₹{(i.price || 0) * (i.quantity ?? 1)}</p>
                    <button type="button" onClick={() => removeItem(i.id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Subtotal ({totalItems} items)</span>
                <span className="text-lg font-bold text-gray-900">₹{subtotal}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Shipping</span>
                <span className="text-sm text-green-600 font-medium">Free</span>
              </div>
              <div className="flex gap-3">
                <Button variant="ghost" onClick={clearCart} className="flex-shrink-0">Clear</Button>
                <Link to="/marketplace/checkout" className="flex-1">
                  <Button variant="primary" className="w-full">Proceed to Checkout</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
