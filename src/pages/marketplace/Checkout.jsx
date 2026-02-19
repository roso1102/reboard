import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import GradeBadge from '../../components/GradeBadge'
import { useCart } from '../../context/CartContext'
import { useStore } from '../../context/StoreContext'

export default function Checkout() {
  const { items, clearCart, totalItems } = useCart()
  const { placeOrder } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState('details')
  const [orderId, setOrderId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', org: '', address: '', notes: '' })

  const subtotal = items.reduce((s, i) => s + (i.price || 0) * (i.quantity ?? 1), 0)

  const handleChange = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    const order = placeOrder(items, form)
    setOrderId(order.id)
    clearCart()
    setStep('confirmed')
  }

  if (items.length === 0 && step !== 'confirmed') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link to="/marketplace" className="mt-3 inline-block text-green-600 hover:text-green-700 font-medium">
            ← Browse Marketplace
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Confirmed</h2>
          <p className="mt-2 text-gray-500">Your order <span className="font-mono font-bold text-gray-900">{orderId}</span> has been placed.</p>
          <p className="mt-1 text-sm text-gray-400">The seller has been notified and will process your order.</p>
          <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            You just contributed to the circular electronics economy
          </div>
          <div className="mt-8 flex gap-3 justify-center">
            <Link to="/marketplace"><Button variant="secondary">Continue Shopping</Button></Link>
            <Link to="/dashboard/orders"><Button variant="primary">View Orders</Button></Link>
          </div>
          <p className="mt-4 text-xs text-gray-400">This is a demo. No payment was processed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 z-30 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">Re<span className="text-green-600">Board</span></Link>
          <Link to="/marketplace/cart" className="text-sm text-gray-500 hover:text-gray-900 font-medium">← Back to Cart</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-1 space-y-5">
            <Card>
              <h3 className="font-bold text-gray-900 mb-4">Buyer Details</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input required value={form.name} onChange={handleChange('name')} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input required type="email" value={form.email} onChange={handleChange('email')} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="you@example.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input value={form.phone} onChange={handleChange('phone')} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="+91 98765 43210" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                    <input value={form.org} onChange={handleChange('org')} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Company / Lab / University" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
                  <textarea required rows={2} value={form.address} onChange={handleChange('address')} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Full address" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order Notes</label>
                  <textarea rows={2} value={form.notes} onChange={handleChange('notes')} className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500" placeholder="Special requests, bulk requirements, etc." />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold text-gray-900 mb-3">Payment</h3>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-center">
                <p className="text-sm text-gray-500">Payment is simulated for this demo.</p>
                <p className="text-xs text-gray-400 mt-1">No real transaction will be processed.</p>
              </div>
            </Card>

            <Button type="submit" variant="primary" className="w-full py-3 text-base">
              Place Order · ₹{subtotal}
            </Button>
          </form>

          <div className="w-full lg:w-80 shrink-0">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 sticky top-20">
              <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                      {i.imageUrl ? (
                        <img src={i.imageUrl} alt={i.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[8px] font-bold text-gray-400">{i.name?.slice(0, 3)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{i.name}</p>
                      <p className="text-xs text-gray-400">Qty: {i.quantity ?? 1} · <GradeBadge grade={i.grade} showLabel={false} /></p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">₹{(i.price || 0) * (i.quantity ?? 1)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-gray-900">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-100">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{subtotal}</span>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Recovered components — reducing e-waste
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
