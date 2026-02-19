import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import VerifiedBadge from '../../components/VerifiedBadge'
import GradeBadge from '../../components/GradeBadge'
import Badge from '../../components/Badge'
import { ReusabilityModal } from '../../components/ReusabilityScore'
import { MOCK_COMPONENTS, LAYER_NAMES } from '../../data/mockData'
import { useCart } from '../../context/CartContext'

function similarity(comp, other) {
  if (comp.id === other.id) return 0
  let s = 0
  LAYER_NAMES.forEach((l) => {
    if (comp.layers?.[l] === other.layers?.[l]) s += 10
  })
  if (comp.category === other.category) s += 20
  return Math.min(100, s + 20)
}

function gradeDescription(grade) {
  if (grade === 'A') return 'Excellent — all tested layers fully operational, production-ready'
  if (grade === 'B') return 'Good — most layers functional with minor limitations'
  if (grade === 'C') return 'Fair — significant degradation, suitable for learning/prototyping only'
  return 'Poor — major failures detected, salvage or educational use only'
}

function riskAssessment(component) {
  const risks = []
  if (component.grade >= 'C') risks.push('Degraded subsystems may affect reliability under sustained load')
  if (!component.layers?.Power) risks.push('Power subsystem not verified')
  if (component.reusability < 70) risks.push('Below 70% reusability — limited functional lifespan')
  if (component.grade === 'D') risks.push('Not recommended for any functional application')
  if (risks.length === 0) {
    risks.push('No critical risks — verify under your specific load conditions')
    risks.push('Recommended: run a thermal stress test before deployment')
  }
  return risks
}

function estimateCO2(component) {
  if (component.grade === 'A') return '~0.5 kg'
  if (component.grade === 'B') return '~0.3 kg'
  if (component.grade === 'C') return '~0.1 kg'
  return '~0 kg'
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">Component not found.</p>
          <Link to="/marketplace" className="text-green-600 hover:text-green-700 mt-2 inline-block font-bold">
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  const similar = MOCK_COMPONENTS.filter((c) => c.id !== id)
    .map((c) => ({ ...c, score: similarity(component, c) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const activeLayers = LAYER_NAMES.filter((l) => component.layers?.[l])
  const inactiveLayers = LAYER_NAMES.filter((l) => !component.layers?.[l])
  const risks = riskAssessment(component)
  const co2 = estimateCO2(component)
  const gradeColor = component.grade === 'A' ? 'text-green-600' : component.grade === 'B' ? 'text-gray-900' : component.grade === 'C' ? 'text-gray-500' : 'text-red-500'

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 z-30 bg-white/90 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/marketplace" className="text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Marketplace
          </Link>
          <Link to="/marketplace/cart" className="text-sm text-gray-500 hover:text-gray-900">Cart</Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 animate-fade-in">

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-6">

            <div className="flex items-start gap-5">
              <div className="w-20 h-20 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                {component.imageUrl ? (
                  <img src={component.imageUrl} alt={component.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="text-sm font-bold text-gray-400">
                    {component.name.split(' ').map((p) => p[0]).join('').slice(0, 3).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{component.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                      <VerifiedBadge />
                      <span className="text-xs text-gray-400">{component.category}</span>
                      <span className="text-xs text-gray-400">·</span>
                      <span className="text-xs text-gray-400">{component.serialNumber}</span>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-gray-900 shrink-0">₹{component.price}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-gray-100 p-4 text-center">
                <p className={`text-3xl font-bold ${gradeColor}`}>{component.grade}</p>
                <p className="text-[11px] text-gray-500 mt-1">Grade</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-3xl font-bold text-gray-900">{component.reusability}%</p>
                <p className="text-[11px] text-gray-500 mt-1">Reusability</p>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-100 p-4 text-center">
                <p className="text-2xl font-bold text-green-700">{co2}</p>
                <p className="text-[11px] text-gray-500 mt-1">CO₂ Saved</p>
              </div>
              <div className="rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{component.quantity}</p>
                <p className="text-[11px] text-gray-500 mt-1">Available</p>
              </div>
            </div>

            <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-bold text-gray-900">Grade {component.grade}</span> — {gradeDescription(component.grade)}.
                This component has been tested across {LAYER_NAMES.length} diagnostic layers with{' '}
                <span className="font-medium">{activeLayers.length} active</span> and{' '}
                <span className="font-medium">{inactiveLayers.length} inactive/unavailable</span>.
                {component.testTimestamp && <> Last tested on {new Date(component.testTimestamp).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}.</>}
              </p>
            </div>

            <Card>
              <h3 className="font-bold text-gray-900 mb-3">Layer Status</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-4">
                {LAYER_NAMES.map((name) => {
                  const active = component.layers?.[name]
                  return (
                    <div key={name} className={`rounded-lg border p-2.5 text-center text-xs transition-all ${
                      active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}>
                      <p className="font-bold">{name}</p>
                      <p className="text-[10px] mt-0.5">{active ? 'Active' : 'N/A'}</p>
                    </div>
                  )
                })}
              </div>
            </Card>

            {component.capabilityMatrix && component.capabilityMatrix.length > 0 && (
              <Card>
                <h3 className="font-bold text-gray-900 mb-3">Capability Matrix</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-xs">Feature</th>
                        <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-xs">Status</th>
                        <th className="text-left px-4 py-2.5 font-medium text-gray-500 text-xs">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {component.capabilityMatrix.map((row) => (
                        <tr key={row.feature} className="border-t border-gray-100">
                          <td className="px-4 py-2.5 font-medium text-gray-900">{row.feature}</td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              row.status === 'Working' ? 'bg-green-500' : row.status === 'Degraded' ? 'bg-yellow-500' : 'bg-gray-300'
                            }`} />
                            {row.status}
                          </td>
                          <td className="px-4 py-2.5 text-gray-500">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h3 className="font-bold text-gray-900 mb-3">Approved Use Cases</h3>
                <div className="flex flex-wrap gap-2">
                  {component.useCases?.map((u) => (
                    <Badge key={u} variant="primary">{u}</Badge>
                  ))}
                </div>
                {(!component.useCases || component.useCases.length === 0) && (
                  <p className="text-sm text-gray-400">No specific use cases listed</p>
                )}
              </Card>

              <Card>
                <h3 className="font-bold text-gray-900 mb-3">Risk Assessment</h3>
                <ul className="space-y-1.5">
                  {risks.map((r) => (
                    <li key={r} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-300 shrink-0 mt-0.5">•</span>
                      {r}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <Card>
              <h3 className="font-bold text-gray-900 mb-3">Environmental Impact</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-bold text-green-700">{co2}</p>
                  <p className="text-xs text-gray-500">CO₂ prevented</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{component.reusability}%</p>
                  <p className="text-xs text-gray-500">Functional recovery</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">{activeLayers.length}/{LAYER_NAMES.length}</p>
                  <p className="text-xs text-gray-500">Active layers</p>
                </div>
              </div>
              <div className="mt-4 rounded-lg bg-green-50 border border-green-100 px-4 py-3">
                <p className="text-xs text-green-700 leading-relaxed">
                  By purchasing this recovered component instead of buying new, you help prevent electronic waste and reduce manufacturing emissions.
                  Each reused component extends the lifecycle of critical materials like silicon, copper, and rare earth elements.
                </p>
              </div>
            </Card>

          </div>

          <div className="w-full md:w-72 shrink-0 space-y-4">

            <div className="rounded-2xl border border-gray-100 bg-white p-5 sticky top-20">
              <p className="text-2xl font-bold text-gray-900">₹{component.price}</p>
              <div className="flex items-center gap-2 mt-1">
                <GradeBadge grade={component.grade} />
                <button
                  type="button"
                  onClick={() => setReusabilityModalOpen(true)}
                  className="text-xs text-gray-500 hover:text-gray-900 underline decoration-dotted"
                >
                  {component.reusability}% reusable
                </button>
              </div>

              <div className="mt-2">
                <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${component.reusability}%`,
                      background: component.reusability >= 85 ? '#16a34a' : component.reusability >= 70 ? '#111827' : '#9ca3af',
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button variant="primary" className="w-full" onClick={() => addItem(component, 1)}>
                  Add to Cart
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => setContactSent(true)}>
                  Contact Seller
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setBulkRequested(true)}>
                  Request Bulk
                </Button>
              </div>

              {contactSent && <p className="mt-2 text-xs text-green-600 font-medium">Message sent (demo).</p>}
              {bulkRequested && <p className="mt-2 text-xs text-green-600 font-medium">Bulk request submitted (demo).</p>}

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Seller</span>
                  <span className="text-gray-900 font-medium">{component.seller}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Type</span>
                  <span className="text-gray-900 font-medium">{component.sellerType}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Location</span>
                  <span className="text-gray-900 font-medium">{component.location}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Available</span>
                  <span className="text-gray-900 font-medium">{component.quantity} units</span>
                </div>
              </div>
            </div>

            {similar.length > 0 && (
              <div className="rounded-2xl border border-gray-100 bg-white p-5">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Similar Components</h3>
                <div className="space-y-2.5">
                  {similar.map((c) => (
                    <Link
                      key={c.id}
                      to={`/marketplace/component/${c.id}`}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-9 h-9 rounded-lg border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                        {c.imageUrl ? (
                          <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span className="text-[8px] font-bold text-gray-400">
                            {c.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate group-hover:text-green-700 transition-colors">{c.name}</p>
                        <p className="text-[10px] text-gray-400">Grade {c.grade} · {c.reusability}% · ₹{c.price}</p>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium shrink-0">{c.score}%</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </main>

      <ReusabilityModal open={reusabilityModalOpen} onClose={() => setReusabilityModalOpen(false)} />
    </div>
  )
}
