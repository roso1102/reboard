import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/Button'
import VerifiedBadge from '../../components/VerifiedBadge'
import GradeBadge from '../../components/GradeBadge'
import { useMarketplaceSearch } from '../../hooks/useMarketplaceSearch'
import { CATEGORIES } from '../../data/mockData'
import { useCart } from '../../context/CartContext'
import { hasApiKey } from '../../services/gemini'

const QUICK_PROMPTS = [
  'Microcontroller with WiFi for IoT',
  'Temperature & humidity sensor',
  'Motor driver for robotics',
  'Low-power board for battery project',
  'Communication module with Bluetooth',
]

const LAYER_ICONS = {
  WiFi: '📶', BLE: '🔵', GPIO: '🔌', ADC: '📊', PWM: '⚡', UART: '🔗', SPI: '🔄', I2C: '🔀', Power: '🔋',
}

function ComponentCard({ component }) {
  const isTopGrade = component.grade === 'A'
  const activeLayers = Object.entries(component.layers || {}).filter(([, v]) => v).map(([k]) => k)
  const topLayers = activeLayers.slice(0, 5)

  return (
    <Link
      to={`/marketplace/component/${component.id}`}
      className={`group relative block rounded-2xl bg-white overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${
        isTopGrade ? 'ring-1 ring-green-200' : 'ring-1 ring-gray-100'
      }`}
    >
      {isTopGrade && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600" />
      )}

      <div className="p-5">
        <div className="flex items-start gap-3.5">
          <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            {component.imageUrl ? (
              <img src={component.imageUrl} alt={component.name} className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <span className="text-xs font-bold text-gray-400">
                {component.name.split(' ').map((p) => p[0]).join('').slice(0, 3).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-gray-900 text-[15px] leading-snug group-hover:text-green-700 transition-colors">{component.name}</h3>
              <GradeBadge grade={component.grade} showLabel={false} />
            </div>
            <p className="text-xs text-gray-400 mt-1">{component.category} · {component.location}</p>
          </div>
        </div>

        {component.matchReason && (
          <div className="mt-3 rounded-lg bg-green-50 border border-green-100 px-3 py-2 flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-green-700 leading-relaxed font-medium">{component.matchReason}</p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-1">
          {topLayers.map((l) => (
            <span key={l} className="text-[10px] bg-gray-50 text-gray-600 border border-gray-100 rounded-md px-1.5 py-0.5 font-medium">
              {LAYER_ICONS[l] || ''} {l}
            </span>
          ))}
          {activeLayers.length > 5 && (
            <span className="text-[10px] text-gray-400 px-1.5 py-0.5">+{activeLayers.length - 5}</span>
          )}
        </div>

        {component.useCases && component.useCases.length > 0 && (
          <div className="mt-2.5 flex flex-wrap gap-1">
            {component.useCases.slice(0, 3).map((u) => (
              <span key={u} className="text-[10px] bg-gray-900 text-white rounded-full px-2 py-0.5 font-medium">{u}</span>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-gray-50 bg-gray-50/50 px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold text-gray-900">₹{component.price}</span>
          <span className="text-xs text-gray-400">Qty: {component.quantity}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="w-14 h-1.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${component.reusability}%`,
                  background: component.reusability >= 85 ? '#16a34a' : component.reusability >= 70 ? '#111827' : '#9ca3af',
                }}
              />
            </div>
            <span className="text-[10px] font-medium text-gray-500">{component.reusability}%</span>
          </div>
          <VerifiedBadge />
        </div>
      </div>
    </Link>
  )
}

export default function MarketplaceHome() {
  const {
    query, setQuery,
    category, setCategory,
    grade, setGrade,
    sortBy, setSortBy,
    results,
    searching,
    smartActive,
    runSmartSearch,
    clearSmartResults,
  } = useMarketplaceSearch()
  const { totalItems } = useCart()
  const [inputValue, setInputValue] = useState('')
  const textareaRef = useRef(null)

  const handleSearch = () => {
    const val = inputValue.trim()
    if (!val) return
    setQuery(val)
    runSmartSearch(val)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSearch()
    }
  }

  const handleQuickPrompt = (prompt) => {
    setInputValue(prompt)
    setQuery(prompt)
    runSmartSearch(prompt)
  }

  const handleClear = () => {
    setInputValue('')
    setQuery('')
    clearSmartResults()
    textareaRef.current?.focus()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100 sticky top-0 z-30 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            Re<span className="text-green-600">Board</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/marketplace" className="text-gray-900 font-medium">Marketplace</Link>
            <Link to="/marketplace/cart" className="text-gray-500 hover:text-gray-900 transition-colors">
              Cart {totalItems > 0 && <span className="ml-0.5 text-xs bg-gray-900 text-white px-1.5 py-0.5 rounded-full">{totalItems}</span>}
            </Link>
            <Link to="/dashboard">
              <Button variant="ghost" className="text-sm">Dashboard</Button>
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
          What are you <span className="highlight-green">building</span>?
        </h1>
        <p className="mt-3 text-gray-500 text-lg">
          Describe your project and we'll match you with recovered components.
        </p>

        <div className="mt-8 relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. I'm building a weather monitoring station that needs temperature sensing, WiFi connectivity, and low power consumption..."
            rows={3}
            className="w-full rounded-2xl border-2 border-gray-200 bg-gray-50 px-5 py-4 text-gray-900 placeholder-gray-400 resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:bg-white transition-all text-[15px] leading-relaxed"
          />
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <button
              type="button"
              onClick={handleSearch}
              disabled={!inputValue.trim() || searching}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              {searching ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                  </svg>
                  Matching...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handleQuickPrompt(p)}
              className="text-xs bg-gray-50 text-gray-600 border border-gray-200 rounded-full px-3.5 py-1.5 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {!hasApiKey() && (
          <p className="mt-3 text-xs text-gray-400">
            Smart matching uses keyword search. Add a Gemini API key for intelligent project-based matching.
          </p>
        )}
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-16">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 mr-3">
            {['', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                  category === cat
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {cat || 'All'}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-gray-200" />

          <div className="flex items-center gap-1.5 ml-2">
            {['', 'A', 'B', 'C', 'D'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGrade(g)}
                className={`text-xs font-medium w-7 h-7 rounded-lg border transition-all flex items-center justify-center ${
                  grade === g
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                }`}
              >
                {g || '★'}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 bg-white"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
              <option value="reusability">Reusability</option>
            </select>
          </div>
        </div>

        {smartActive && (
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-sm text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Intelligent matching</span>
              </div>
              <span className="text-xs text-gray-500">{results.length} components ranked for your project</span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Clear search
            </button>
          </div>
        )}

        {!smartActive && !query && (
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">{results.length} components available</p>
          </div>
        )}

        {searching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl ring-1 ring-gray-100 bg-white overflow-hidden animate-pulse">
                <div className="p-5 space-y-3">
                  <div className="flex gap-3.5">
                    <div className="w-14 h-14 rounded-xl bg-gray-100" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                      <div className="h-3 bg-gray-50 rounded-lg w-1/2" />
                    </div>
                  </div>
                  <div className="h-10 bg-green-50 rounded-lg" />
                  <div className="flex gap-1">
                    <div className="h-5 bg-gray-50 rounded w-12" />
                    <div className="h-5 bg-gray-50 rounded w-10" />
                    <div className="h-5 bg-gray-50 rounded w-14" />
                  </div>
                </div>
                <div className="border-t border-gray-50 bg-gray-50/50 px-5 py-3">
                  <div className="h-4 bg-gray-100 rounded w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((c) => (
              <ComponentCard key={c.id} component={c} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No components match your criteria.</p>
            <button type="button" onClick={handleClear} className="mt-2 text-sm text-green-600 hover:text-green-700 font-medium">
              Clear filters
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
