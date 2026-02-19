import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import VerifiedBadge from '../../components/VerifiedBadge'
import GradeBadge from '../../components/GradeBadge'
import { ReusabilityModal } from '../../components/ReusabilityScore'
import { MOCK_COMPONENTS } from '../../data/mockData'
import { useCart } from '../../context/CartContext'

function similarity(comp, other) {
  if (comp.id === other.id) return 0
  let s = 0
  const layers = ['GPIO', 'ADC', 'PWM', 'UART', 'WiFi', 'BLE']
  layers.forEach((l) => {
    if (comp.layers?.[l] === other.layers?.[l]) s += 15
  })
  if (comp.category === other.category) s += 20
  return Math.min(100, s + 30)
}

export default function ComponentDetail() {
  const { id } = useParams()
  const component = MOCK_COMPONENTS.find((c) => c.id === id)
  const [reusabilityModalOpen, setReusabilityModalOpen] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const [bulkRequested, setBulkRequested] = useState(false)
  const { addItem } = useCart()

  if (!component) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-semibold">Component not found.</p>
          <Link to="/marketplace" className="text-gray-900 hover:underline mt-2 inline-block font-bold">
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const similar = MOCK_COMPONENTS.filter((c) => c.id !== id)
    .map((c) => ({ ...c, score: similarity(component, c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const handleAddToCart = () => {
    addItem(component, 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link to="/marketplace" className="text-sm text-gray-500 hover:text-gray-900 font-semibold">
            ← Marketplace
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8 animate-fade-in">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-2xl border-2 border-gray-200 bg-white flex items-center justify-center overflow-hidden">
              {component.imageUrl ? (
                <img src={component.imageUrl} alt={component.name} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <span className="text-sm font-bold text-gray-500">
                  {component.name.split(' ').map((part) => part[0]).join('').slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{component.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <VerifiedBadge />
                <GradeBadge grade={component.grade} />
                <button
                  type="button"
                  onClick={() => setReusabilityModalOpen(true)}
                  className="text-sm text-gray-500 hover:text-gray-900 underline decoration-dotted font-semibold"
                >
                  Reusability: {component.reusability}%
                </button>
              </div>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">₹{component.price}</p>
        </div>

        <Card>
          <h3 className="font-bold text-gray-900 mb-3">Capability Matrix</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-100 font-semibold">
                <th className="pb-2 pr-4">Feature</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Notes</th>
              </tr>
            </thead>
            <tbody>
              {component.capabilityMatrix?.map((row) => (
                <tr key={row.feature} className="border-b border-gray-50">
                  <td className="py-2 pr-4 font-semibold">{row.feature}</td>
                  <td className="py-2 pr-4">{row.status}</td>
                  <td className="py-2 text-gray-500">{row.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h3 className="font-bold text-gray-900 mb-2">Functional Breakdown</h3>
          <p className="text-sm text-gray-600">
            Category: {component.category}. Tested on {component.testTimestamp ? new Date(component.testTimestamp).toLocaleDateString() : 'N/A'}.
          </p>
          <div className="mt-2">
            <p className="text-sm font-bold text-gray-700">Approved Use Cases</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {component.useCases?.map((u) => (
                <span key={u} className="rounded-lg bg-gray-900 text-white px-2.5 py-0.5 text-xs font-bold">
                  {u}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-gray-900 mb-2">Seller Info</h3>
          <p className="text-sm text-gray-600 font-medium">{component.seller} ({component.sellerType}) · {component.location}</p>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button variant="primary" onClick={handleAddToCart}>Add to Cart</Button>
          <Button variant="secondary" onClick={() => setContactSent(true)}>Contact Seller</Button>
          <Button variant="ghost" onClick={() => setBulkRequested(true)}>Request Bulk</Button>
        </div>
        {contactSent && <p className="text-sm text-green-600 font-semibold">Message sent (demo).</p>}
        {bulkRequested && <p className="text-sm text-green-600 font-semibold">Bulk request submitted (demo).</p>}

        {similar.length > 0 && (
          <Card>
            <h3 className="font-bold text-gray-900 mb-4">Similar Matches</h3>
            <div className="space-y-3">
              {similar.map((c) => (
                <Link
                  key={c.id}
                  to={`/marketplace/component/${c.id}`}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100"
                >
                  <span className="font-bold text-gray-900">{c.name}</span>
                  <span className="text-sm text-gray-500 font-semibold">{c.score}% match</span>
                </Link>
              ))}
            </div>
          </Card>
        )}
      </main>

      <ReusabilityModal open={reusabilityModalOpen} onClose={() => setReusabilityModalOpen(false)} />
    </div>
  )
}
