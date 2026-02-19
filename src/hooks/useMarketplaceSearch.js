import { useMemo, useState, useCallback, useRef } from 'react'
import { LAYER_NAMES } from '../data/mockData'
import { callGemini, hasApiKey } from '../services/gemini'

const FEATURE_KEYWORDS = {
  wifi: { layers: ['WiFi'], cats: [], terms: ['wifi', 'wireless', 'internet', 'iot', 'connected', 'web', 'cloud', 'remote'] },
  ble: { layers: ['BLE'], cats: [], terms: ['bluetooth', 'ble', 'bt'] },
  gpio: { layers: ['GPIO'], cats: [], terms: ['gpio', 'pin', 'digital', 'io'] },
  adc: { layers: ['ADC'], cats: [], terms: ['adc', 'analog', 'sensor reading', 'voltage reading'] },
  pwm: { layers: ['PWM'], cats: [], terms: ['pwm', 'servo', 'motor', 'speed control', 'dimming'] },
  uart: { layers: ['UART'], cats: [], terms: ['uart', 'serial', 'rs232', 'debug'] },
  spi: { layers: ['SPI'], cats: [], terms: ['spi', 'display', 'sd card', 'flash'] },
  i2c: { layers: ['I2C'], cats: [], terms: ['i2c', 'iic', 'sensor bus'] },
  mcu: { layers: [], cats: ['Microcontroller'], terms: ['microcontroller', 'mcu', 'board', 'controller', 'processor', 'esp', 'arduino', 'stm'] },
  sensor: { layers: [], cats: ['Sensor'], terms: ['sensor', 'temperature', 'humidity', 'pressure', 'imu', 'gyro', 'accel', 'ultrasonic', 'weather', 'environment', 'motion', 'detect'] },
  driver: { layers: [], cats: ['Driver'], terms: ['driver', 'motor', 'stepper', 'h-bridge', 'actuator', 'robot', 'dc motor'] },
  comm: { layers: [], cats: ['Communication'], terms: ['communication', 'radio', 'nrf', 'lora', 'gsm', 'sim', 'rf', 'transceiver'] },
  power: { layers: ['Power'], cats: ['Power Module'], terms: ['power', 'battery', 'regulator', 'buck', 'boost', 'charger', 'low power', 'energy'] },
}

function extractFeatures(queryText) {
  const q = queryText.toLowerCase()
  const matched = { layers: new Set(), cats: new Set(), keywords: [] }

  for (const [key, feat] of Object.entries(FEATURE_KEYWORDS)) {
    if (feat.terms.some((t) => q.includes(t))) {
      feat.layers.forEach((l) => matched.layers.add(l))
      feat.cats.forEach((c) => matched.cats.add(c))
      matched.keywords.push(key)
    }
  }

  return {
    layers: [...matched.layers],
    cats: [...matched.cats],
    keywords: matched.keywords,
    hasIntent: matched.keywords.length > 0,
  }
}

function scoreComponent(component, features) {
  if (!features.hasIntent) return { score: 50, reasons: [] }

  let score = 0
  const reasons = []

  features.layers.forEach((l) => {
    if (component.layers?.[l]) {
      score += 20
      reasons.push(l)
    }
  })

  if (features.cats.length > 0) {
    if (features.cats.includes(component.category)) {
      score += 25
    } else {
      score -= 15
    }
  }

  const nameL = component.name.toLowerCase()
  features.keywords.forEach((kw) => {
    if (nameL.includes(kw)) score += 10
    if (component.useCases?.some((u) => u.toLowerCase().includes(kw))) score += 8
  })

  if (component.grade === 'A') score += 5
  else if (component.grade === 'B') score += 3
  else if (component.grade === 'D') score -= 10

  score += Math.round(component.reusability / 20)

  return { score: Math.max(0, Math.min(100, score)), reasons }
}

function buildReason(component, features) {
  const parts = []
  const matchedLayers = features.layers.filter((l) => component.layers?.[l])
  if (matchedLayers.length > 0) parts.push(`Has ${matchedLayers.join(', ')}`)
  if (features.cats.includes(component.category)) parts.push(component.category)
  if (component.grade <= 'B') parts.push(`Grade ${component.grade}`)
  return parts.length > 0 ? parts.join(' · ') : null
}

const INTENT_PROMPT = `Extract the electronic component requirements from this project description. Return ONLY valid JSON:
{"layers":["WiFi","GPIO",...],"categories":["Microcontroller","Sensor",...],"keywords":["iot","temperature",...]}
Only include layers from: GPIO,ADC,PWM,UART,SPI,I2C,WiFi,BLE,Power
Only include categories from: Microcontroller,Sensor,Driver,Communication,Power Module
Project: `

export function useMarketplaceSearch(components = []) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('')
  const [grade, setGrade] = useState('')
  const [sortBy, setSortBy] = useState('relevance')
  const [smartFeatures, setSmartFeatures] = useState(null)
  const [searching, setSearching] = useState(false)
  const abortRef = useRef(null)

  const filteredResults = useMemo(() => {
    const features = smartFeatures || extractFeatures(query)
    let list = components.map((c) => {
      const { score, reasons } = scoreComponent(c, features)
      const reason = features.hasIntent ? buildReason(c, features) : null
      return { ...c, relevance: score, matchReason: reason }
    })

    if (features.hasIntent) {
      list.sort((a, b) => b.relevance - a.relevance)
    } else if (!query.trim()) {
      // no query — show all
    } else {
      const q = query.toLowerCase()
      list = list.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.useCases?.some((u) => u.toLowerCase().includes(q))
      )
    }

    if (category) list = list.filter((c) => c.category === category)
    if (grade) list = list.filter((c) => c.grade === grade)

    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'reusability') list.sort((a, b) => b.reusability - a.reusability)

    return list
  }, [components, query, category, grade, sortBy, smartFeatures])

  const runSmartSearch = useCallback(async (searchQuery) => {
    const localFeatures = extractFeatures(searchQuery)
    setSmartFeatures(localFeatures)

    if (!hasApiKey() || localFeatures.hasIntent) {
      setSearching(false)
      return
    }

    setSearching(true)
    const myRun = Symbol()
    abortRef.current = myRun

    try {
      const raw = await callGemini(INTENT_PROMPT + `"${searchQuery}"`)
      if (abortRef.current !== myRun) return

      if (raw) {
        const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
        const jsonMatch = clean.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          const enhanced = {
            layers: [...new Set([...localFeatures.layers, ...(parsed.layers || [])])],
            cats: [...new Set([...localFeatures.cats, ...(parsed.categories || [])])],
            keywords: [...new Set([...localFeatures.keywords, ...(parsed.keywords || [])])],
            hasIntent: true,
          }
          setSmartFeatures(enhanced)
        }
      }
    } catch (err) {
      console.warn('[SmartSearch] Intent extraction failed:', err.message)
    }

    if (abortRef.current === myRun) setSearching(false)
  }, [])

  const clearSmartResults = useCallback(() => {
    setSmartFeatures(null)
  }, [])

  return {
    query, setQuery,
    category, setCategory,
    grade, setGrade,
    sortBy, setSortBy,
    results: filteredResults,
    searching,
    smartActive: !!smartFeatures?.hasIntent,
    runSmartSearch,
    clearSmartResults,
  }
}
