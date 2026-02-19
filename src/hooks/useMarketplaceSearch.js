import { useMemo, useState } from 'react'
import { MOCK_COMPONENTS, LAYER_NAMES } from '../data/mockData'

function matchQuery(component, query) {
  if (!query || !query.trim()) return true
  const q = query.toLowerCase().trim()
  const text = [
    component.name,
    component.category,
    component.useCases?.join(' '),
    ...LAYER_NAMES.filter((l) => component.layers?.[l]).map((l) => l.toLowerCase()),
    ...LAYER_NAMES.filter((l) => !component.layers?.[l]).map((l) => `no ${l}`),
  ].join(' ')
  if (text.includes(q)) return true
  if (q.includes('gpio') && component.layers?.GPIO) return true
  if (q.includes('wifi') && component.layers?.WiFi) return true
  if (q.includes('only') && component.layers?.GPIO && !component.layers?.WiFi) return true
  if (q.includes('board') && component.category === 'Microcontroller') return true
  return false
}

function similarityScore(component, query) {
  if (!query || !query.trim()) return 100
  let score = 0
  const q = query.toLowerCase()
  if (q.includes('gpio') && component.layers?.GPIO) score += 25
  if (q.includes('wifi') && component.layers?.WiFi) score += 20
  if (q.includes('no wifi') && !component.layers?.WiFi) score += 20
  if (q.includes('adc') && component.layers?.ADC) score += 15
  if (component.useCases?.some((u) => u.toLowerCase().includes('gpio only'))) score += 10
  if (component.name.toLowerCase().includes(q.split(/\s/)[0])) score += 15
  return Math.min(100, 50 + score)
}

export function useMarketplaceSearch(components = MOCK_COMPONENTS) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [grade, setGrade] = useState('')
  const [minReusability, setMinReusability] = useState('')
  const [location, setLocation] = useState('')
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')

  const results = useMemo(() => {
    let list = components.filter((c) => matchQuery(c, query))
    if (category) list = list.filter((c) => c.category === category)
    if (grade) list = list.filter((c) => c.grade === grade)
    if (minReusability) list = list.filter((c) => c.reusability >= Number(minReusability))
    if (location) list = list.filter((c) => c.location === location)
    if (priceMin) list = list.filter((c) => c.price >= Number(priceMin))
    if (priceMax) list = list.filter((c) => c.price <= Number(priceMax))
    list = list.map((c) => ({ ...c, similarity: similarityScore(c, query) }))
    list.sort((a, b) => b.similarity - a.similarity)
    return list
  }, [components, query, category, grade, minReusability, location, priceMin, priceMax])

  return {
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
  }
}
