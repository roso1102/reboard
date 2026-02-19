import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Button from '../../components/Button'
import VerifiedBadge from '../../components/VerifiedBadge'
import GradeBadge from '../../components/GradeBadge'
import { useMarketplaceSearch } from '../../hooks/useMarketplaceSearch'
import { LAYER_NAMES } from '../../data/mockData'
import { useCart } from '../../context/CartContext'

function LayerIcons({ layers }) {
  return (
    <div className="flex flex-wrap gap-1">
      {LAYER_NAMES.map((name) => (
        <span
          key={name}
          className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
            layers?.[name]
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-400'
          }`}
          title={name}
        >
          {name}
        </span>
      ))}
    </div>
  )
}

function ComponentThumbnail({ component }) {
  const initials = component.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return (
    <div className="w-14 h-14 rounded-2xl border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
      {component.imageUrl ? (
        <img
          src={component.imageUrl}
          alt={component.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-xs font-bold text-gray-500">{initials}</span>
      )}
    </div>
  )
}

export default function MarketplaceHome() {
  const {
    query,
    setQuery,
    category,
    setCategory,
    grade,
    setGrade,
    minReusability,
    setMinReusability,
    location,
    setLocation,
    priceMin,
    setPriceMin,
    priceMax,
    setPriceMax,
    results,
  } = useMarketplaceSearch()
  const { totalItems } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">E-Grade</Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link to="/marketplace" className="text-gray-900">Marketplace</Link>
            <Link to="/marketplace/cart" className="text-gray-600 hover:text-gray-900">
              Cart ({totalItems})
            </Link>
            <Link to="/marketplace/seller">
              <Button variant="ghost">Seller Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <input
            type="search"
            placeholder='Describe what you need (e.g., "microcontroller with ADC, no WiFi required")'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full max-w-2xl rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-gray-900 font-medium placeholder-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>

        <div className="flex gap-8">
          <aside className="w-56 shrink-0">
            <Card>
              <h3 className="font-bold text-gray-900 mb-3">Filters</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 font-medium">
                    <option value="">All</option>
                    <option value="Microcontroller">Microcontroller</option>
                    <option value="Sensor">Sensor</option>
                    <option value="Driver">Driver</option>
                    <option value="Communication">Communication</option>
                    <option value="Power Module">Power Module</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Min Reusability %</label>
                  <input type="number" min="0" max="100" value={minReusability} onChange={(e) => setMinReusability(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 font-medium" />
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Grade</label>
                  <select value={grade} onChange={(e) => setGrade(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 font-medium">
                    <option value="">All</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Location</label>
                  <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 font-medium">
                    <option value="">All</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Bangalore">Bangalore</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Price range</label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 font-medium" />
                    <input type="number" placeholder="Max" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} className="w-full rounded-lg border-2 border-gray-200 px-3 py-2 font-medium" />
                  </div>
                </div>
              </div>
            </Card>
          </aside>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((c) => (
              <Card key={c.id} hover>
                <div className="flex items-start gap-3">
                  <ComponentThumbnail component={c} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <VerifiedBadge />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">Reusability: {c.reusability}%</span>
                      <GradeBadge grade={c.grade} showLabel={false} />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <LayerIcons layers={c.layers} />
                </div>
                <p className="mt-3 text-lg font-bold text-gray-900">₹{c.price}</p>
                <p className="text-xs text-gray-500 font-medium">{c.sellerType} · {c.location}</p>
                <div className="mt-4">
                  <Link to={`/marketplace/component/${c.id}`} className="block">
                    <Button variant="primary" className="w-full">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
        {results.length === 0 && (
          <div className="py-16 text-center text-gray-500">No components match your filters.</div>
        )}
      </main>
    </div>
  )
}
