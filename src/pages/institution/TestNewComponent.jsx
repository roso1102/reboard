import { useState, useRef, useEffect } from 'react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Badge from '../../components/Badge'
import GradeBadge from '../../components/GradeBadge'
import Combobox from '../../components/Combobox'
import { useLeafBurst } from '../../components/LeafBurst'
import { CATEGORIES } from '../../data/mockData'
import {
  callGemini,
  buildDiagnosticPrompt,
  buildIdentifyPrompt,
  buildCircuitDiagramPrompt,
  hasApiKey,
} from '../../services/gemini'
import { downloadReport } from '../../services/reportGenerator'
import { useStore } from '../../context/StoreContext'

const LAYER_NAMES = ['GPIO', 'ADC', 'PWM', 'UART', 'SPI', 'I2C', 'WiFi', 'BLE', 'Power']

const KNOWN_COMPONENTS = [
  { value: 'ESP32-WROOM-32', label: 'ESP32-WROOM-32', category: 'Microcontroller' },
  { value: 'ESP8266', label: 'NodeMCU ESP8266', category: 'Microcontroller' },
  { value: 'STM32F103C8', label: 'STM32F103C8 (Blue Pill)', category: 'Microcontroller' },
  { value: 'Arduino Nano', label: 'Arduino Nano', category: 'Microcontroller' },
  { value: 'Arduino Uno', label: 'Arduino Uno', category: 'Microcontroller' },
  { value: 'ATmega328P', label: 'ATmega328P (bare)', category: 'Microcontroller' },
  { value: 'Raspberry Pi Pico', label: 'Raspberry Pi Pico', category: 'Microcontroller' },
  { value: 'DHT22', label: 'DHT22 Temperature & Humidity', category: 'Sensor' },
  { value: 'DHT11', label: 'DHT11 Temperature & Humidity', category: 'Sensor' },
  { value: 'MPU6050', label: 'MPU6050 IMU (Gyro + Accel)', category: 'Sensor' },
  { value: 'BME280', label: 'BME280 Environmental Sensor', category: 'Sensor' },
  { value: 'HC-SR04', label: 'HC-SR04 Ultrasonic Sensor', category: 'Sensor' },
  { value: 'L298N', label: 'L298N Dual H-Bridge Driver', category: 'Driver' },
  { value: 'A4988', label: 'A4988 Stepper Driver', category: 'Driver' },
  { value: 'DRV8825', label: 'DRV8825 Stepper Driver', category: 'Driver' },
  { value: 'HC-05', label: 'HC-05 Bluetooth Module', category: 'Communication' },
  { value: 'NRF24L01', label: 'NRF24L01 2.4GHz Radio', category: 'Communication' },
  { value: 'SIM800L', label: 'SIM800L GSM Module', category: 'Communication' },
  { value: 'LM2596', label: 'LM2596 Buck Converter', category: 'Power Module' },
  { value: 'AMS1117', label: 'AMS1117 3.3V Regulator', category: 'Power Module' },
  { value: 'TP4056', label: 'TP4056 Li-ion Charger', category: 'Power Module' },
]

const CATEGORY_MAP = {}
KNOWN_COMPONENTS.forEach((c) => { CATEGORY_MAP[c.value.toLowerCase()] = c.category })

function inferCategory(componentType) {
  const lower = (componentType || '').toLowerCase()
  for (const [key, cat] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key) || key.includes(lower)) return cat
  }
  if (/sensor|dht|bme|mpu|hc-sr|ir|ldr|pir/i.test(lower)) return 'Sensor'
  if (/driver|motor|h-bridge|l298|a4988|drv/i.test(lower)) return 'Driver'
  if (/bluetooth|bt|wifi|rf|nrf|gsm|lora|sim/i.test(lower)) return 'Communication'
  if (/buck|boost|ldo|regulator|charger|power|lm25|ams|tp40/i.test(lower)) return 'Power Module'
  return 'Microcontroller'
}

function deriveLayerNotes(name, entry) {
  if (!entry || entry.tested === false) return 'Not applicable'
  const parts = []
  if (entry.pinsWorking != null && entry.pinsTotal != null) parts.push(`${entry.pinsWorking}/${entry.pinsTotal} pins`)
  if (entry.pinsFailed?.length) parts.push(`failed: ${entry.pinsFailed.join(', ')}`)
  if (entry.channels != null) parts.push(`${entry.channels} ch`)
  if (entry.linearityError != null) parts.push(`err ${entry.linearityError}%`)
  if (entry.channelsWorking != null && entry.channelsTotal != null) parts.push(`${entry.channelsWorking}/${entry.channelsTotal} ch`)
  if (entry.dutyCycleAcc != null) parts.push(`${entry.dutyCycleAcc}% duty`)
  if (entry.integrity != null) parts.push(`${entry.integrity}% integrity`)
  if (entry.loopback) parts.push(`loopback: ${entry.loopback}`)
  if (entry.rssi != null) parts.push(`RSSI ${entry.rssi}`)
  if (entry.throughputMbps != null) parts.push(`${entry.throughputMbps} Mbps`)
  if (entry.idleMa != null) parts.push(`${entry.idleMa}mA idle`)
  if (entry.vregV != null) parts.push(`${entry.vregV}V reg`)
  if (entry.sleepUa != null) parts.push(`${entry.sleepUa}µA sleep`)
  if (entry.devicesFound != null) parts.push(`${entry.devicesFound} devices`)
  return parts.length > 0 ? parts.join(', ') : entry.result || '—'
}

function parseTestDataLayers(rawText) {
  try {
    const data = JSON.parse(rawText)
    const src = data.layers || data
    const result = {}
    LAYER_NAMES.forEach((name) => {
      const entry = src[name]
      if (!entry || entry.tested === false) {
        result[name] = { working: false, status: 'N/A', notes: 'Not applicable' }
      } else {
        const r = (entry.result || '').toUpperCase()
        const pass = r === 'PASS'
        const degraded = r === 'DEGRADED' || r === 'PARTIAL'
        const fail = r === 'FAIL'
        result[name] = {
          working: pass || degraded,
          status: fail ? 'Failed' : degraded ? 'Degraded' : pass ? 'Working' : 'Unknown',
          notes: deriveLayerNotes(name, entry),
          pass, degraded, fail,
        }
      }
    })
    return { parsed: true, layers: result, raw: data }
  } catch {
    return { parsed: false }
  }
}

function generateFallbackResult(componentType, category, testDataText) {
  if (testDataText) {
    const td = parseTestDataLayers(testDataText)
    if (td.parsed) {
      const layers = {}
      const capabilityMatrix = []
      let passCount = 0
      let testedCount = 0
      const risks = []

      LAYER_NAMES.forEach((name) => {
        const l = td.layers[name]
        layers[name] = l.working
        capabilityMatrix.push({ feature: name, status: l.status, notes: l.notes })
        if (l.status !== 'N/A') {
          testedCount++
          if (l.pass) passCount++
          else if (l.degraded) { passCount += 0.5; risks.push(`${name}: ${l.notes}`) }
          else if (l.fail) risks.push(`${name} FAILED: ${l.notes}`)
        }
      })

      const reusability = testedCount > 0 ? Math.round((passCount / testedCount) * 100) : 50
      const grade = reusability >= 85 ? 'A' : reusability >= 70 ? 'B' : reusability >= 55 ? 'C' : 'D'
      const failedLayers = LAYER_NAMES.filter((n) => td.layers[n].fail)
      const degradedLayers = LAYER_NAMES.filter((n) => td.layers[n].degraded)
      const workingLayers = LAYER_NAMES.filter((n) => td.layers[n].pass)

      const useCases = []
      if (grade <= 'B') useCases.push('General Purpose')
      if (layers.WiFi) useCases.push('IoT')
      if (layers.PWM) useCases.push('Motor Control')
      if (grade >= 'C') useCases.push('Learning')
      useCases.push('Prototyping')
      if (grade === 'D') { useCases.length = 0; useCases.push('Parts Salvage', 'Educational Teardown') }

      const summary = failedLayers.length > 0
        ? `${componentType} shows ${failedLayers.length} failed layer(s) (${failedLayers.join(', ')})${degradedLayers.length ? ` and ${degradedLayers.length} degraded (${degradedLayers.join(', ')})` : ''}. Only ${workingLayers.length} of ${testedCount} tested layers fully operational.`
        : degradedLayers.length > 0
        ? `${componentType} has ${degradedLayers.length} degraded layer(s) (${degradedLayers.join(', ')}). ${workingLayers.length} layers fully working.`
        : `${componentType} passed all ${testedCount} tested layers successfully.`

      return {
        summary,
        capabilityMatrix, layers, reusability, grade, useCases,
        risks: risks.length > 0 ? risks.slice(0, 6) : ['No critical risks detected — verify under sustained load'],
        co2Saved: grade <= 'B' ? `~${(0.3 + Math.random() * 0.5).toFixed(1)} kg` : grade === 'C' ? '~0.1 kg' : '~0 kg (salvage only)',
        estimatedValue: grade === 'A' ? '₹300–500' : grade === 'B' ? '₹150–300' : grade === 'C' ? '₹50–150' : '₹0–50 (parts only)',
        recommendation: `This ${componentType} has been assessed at Grade ${grade} with a ${reusability}% reusability score. ${grade === 'A' ? 'All tested layers passed — suitable for production-grade and general-purpose applications.' : grade === 'B' ? 'Most layers are functional with minor degradation — suitable for standard non-critical applications.' : grade === 'C' ? `Significant degradation detected in ${degradedLayers.concat(failedLayers).join(', ')}. Only suitable for learning, basic prototyping, or single-function use where failed layers are not required.` : `Catastrophic failure across ${failedLayers.length} layers. This component is NOT suitable for any functional application. Recommended for parts salvage or educational teardown only.`} We recommend performing a sustained load test and thermal stress validation before deploying in any live environment. Disclaimer: This assessment is generated via automated diagnostics and intelligent analysis. It should not be relied upon for safety-critical, medical, aerospace, or life-support applications. Always perform independent verification and compliance testing before deploying in production environments.`,
      }
    }
  }

  const seed = (componentType || '').length + (category || '').length
  const isMcu = category === 'Microcontroller'
  const isSensor = category === 'Sensor'
  const layers = {
    GPIO: true, ADC: isMcu || isSensor, PWM: isMcu,
    UART: isMcu, SPI: isMcu || isSensor, I2C: isMcu || isSensor,
    WiFi: /esp32|esp8266/i.test(componentType), BLE: /esp32/i.test(componentType),
    Power: true,
  }
  const testedCount = Object.values(layers).filter(Boolean).length
  const reusability = 55 + (seed % 30)
  const grade = reusability >= 85 ? 'A' : reusability >= 70 ? 'B' : reusability >= 55 ? 'C' : 'D'
  const capabilityMatrix = LAYER_NAMES.map((name) => ({
    feature: name, status: layers[name] ? 'Working' : 'N/A', notes: layers[name] ? 'No test data — assumed functional' : 'Not applicable',
  }))
  const useCases = ['Learning', 'Prototyping']
  if (layers.WiFi) useCases.push('IoT')
  if (layers.PWM) useCases.push('Motor Control')
  if (isSensor) useCases.push('Data Collection')
  return {
    summary: `${componentType} graded as ${grade} (no test data uploaded — score is estimated). ${testedCount} applicable layers assumed functional.`,
    capabilityMatrix, layers, reusability, grade, useCases,
    risks: ['No test data uploaded — results are estimated', 'Upload test data for accurate grading'],
    co2Saved: `~${(0.2 + Math.random() * 0.3).toFixed(1)} kg`,
    estimatedValue: `₹${60 + seed * 10}`,
    recommendation: `This ${componentType} has been assessed at Grade ${grade} with a ${reusability}% estimated reusability score. Note: no test data was provided, so this is a rough estimate based on component type only. Upload actual test data (.json) for an accurate layer-by-layer diagnosis. We recommend performing a sustained load test and thermal stress validation before deploying in any live environment. Disclaimer: This assessment is generated via automated diagnostics and intelligent analysis. It should not be relied upon for safety-critical, medical, aerospace, or life-support applications. Always perform independent verification and compliance testing before deploying in production environments.`,
  }
}

function generateFallbackCircuit(componentType) {
  const name = (componentType || 'Component').toUpperCase()
  return {
    pinout: `      ┌──────────┐\n VCC ─┤1       8├─ GND\n  IO ─┤2       7├─ TX\n  IO ─┤3       6├─ RX\n RST ─┤4       5├─ EN\n      └──────────┘\n        ${name}`,
    pins: [
      { pin: 'VCC', function: 'Power Input', notes: '3.3V / 5V' },
      { pin: 'GND', function: 'Ground', notes: 'Common ground' },
      { pin: 'TX', function: 'Transmit', notes: 'UART output' },
      { pin: 'RX', function: 'Receive', notes: 'UART input' },
      { pin: 'RST', function: 'Reset', notes: 'Active low' },
      { pin: 'EN', function: 'Enable', notes: 'Active high' },
    ],
    voltage: '3.3V – 5V',
    keySpecs: [`${name} module`, 'Standard pinout', 'See datasheet for full specs'],
  }
}

function DownloadDropdown({ onDownload }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download Report
        <svg className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden animate-fade-in">
          <button
            onClick={() => { onDownload('pdf'); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6zm2-5h2v-1H8v-2h3v-1H8v-1h4v6H8v-1zm5 0h1.5c.83 0 1.5-.67 1.5-1.5v-1c0-.83-.67-1.5-1.5-1.5H13v4zm1-3h.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H14v-2z"/></svg>
            PDF Document
          </button>
          <button
            onClick={() => { onDownload('html'); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors border-t border-gray-100"
          >
            <svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg>
            HTML Report
          </button>
        </div>
      )}
    </div>
  )
}

export default function TestNewComponent() {
  const [componentType, setComponentType] = useState('')
  const [category, setCategory] = useState('')
  const [modelName, setModelName] = useState('')
  const [serial, setSerial] = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [photoIdentifying, setPhotoIdentifying] = useState(false)
  const [testData, setTestData] = useState(null)
  const [testDataFull, setTestDataFull] = useState('')
  const [testDataPreview, setTestDataPreview] = useState('')
  const [circuitData, setCircuitData] = useState(null)
  const [circuitLoading, setCircuitLoading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [successAction, setSuccessAction] = useState(null)
  const photoRef = useRef(null)
  const dataRef = useRef(null)
  const { burst: burstInventory, LeafLayer: InventoryLeaves } = useLeafBurst()
  const { burst: burstMarketplace, LeafLayer: MarketplaceLeaves } = useLeafBurst()
  const { addComponent } = useStore()

  const handleComponentSelect = (opt) => {
    setComponentType(opt.label || opt.value)
    const cat = opt.category || inferCategory(opt.label || opt.value)
    setCategory(cat)
    setCircuitData(null)
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result
      setPhotoPreview(base64)

      if (hasApiKey()) {
        setPhotoIdentifying(true)
        try {
          const raw = await callGemini(buildIdentifyPrompt(), base64)
          if (raw) {
            const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            const parsed = JSON.parse(clean)
            if (parsed.modelName) setModelName(parsed.modelName)
            if (parsed.componentType) {
              setComponentType(parsed.componentType)
              setCategory(parsed.category || inferCategory(parsed.componentType))
            }
          }
        } catch { /* silent */ }
        setPhotoIdentifying(false)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDataUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setTestData(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target.result
      setTestDataFull(text)
      setTestDataPreview(text.slice(0, 500))
    }
    reader.readAsText(file)
  }

  const fetchCircuitDiagram = async () => {
    if (!componentType) return
    setCircuitLoading(true)
    try {
      if (hasApiKey()) {
        const raw = await callGemini(buildCircuitDiagramPrompt(componentType, modelName))
        if (raw) {
          const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
          setCircuitData(JSON.parse(clean))
          setCircuitLoading(false)
          return
        }
      }
    } catch { /* silent */ }
    setCircuitData(generateFallbackCircuit(componentType))
    setCircuitLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setSuccessAction(null)

    try {
      if (hasApiKey()) {
        const prompt = buildDiagnosticPrompt(componentType, modelName, category, testDataFull || testDataPreview)
        const raw = await callGemini(prompt, photoPreview)
        if (raw) {
          const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
          const parsed = JSON.parse(clean)
          const layers = {}
          const capabilityMatrix = []
          LAYER_NAMES.forEach((name) => {
            const l = parsed.layers?.[name]
            layers[name] = l?.working ?? false
            if (l) {
              capabilityMatrix.push({
                feature: name,
                status: l.working ? 'Working' : 'Disabled',
                notes: l.notes || (l.working ? 'OK' : 'N/A'),
              })
            }
          })
          setResult({
            ...parsed,
            layers,
            capabilityMatrix,
            reusability: parsed.reusability ?? 70,
            grade: parsed.grade ?? 'B',
            useCases: parsed.useCases ?? ['General Purpose'],
            risks: parsed.risks ?? [],
            geminiPowered: true,
          })
          setLoading(false)
          return
        }
      }
    } catch { /* silent */ }

    setTimeout(() => {
      setResult({
        ...generateFallbackResult(componentType, category, testDataFull || testDataPreview),
        geminiPowered: false,
      })
      setLoading(false)
    }, 1500)
  }

  const handleAddToInventory = (e) => {
    burstInventory(e)
    addComponent(componentType, modelName, category, serial, result, false)
    setSuccessAction('Added to internal inventory — visible in your Inventory page.')
  }

  const handleListOnMarketplace = (e) => {
    burstMarketplace(e)
    addComponent(componentType, modelName, category, serial, result, true)
    setSuccessAction('Listed on marketplace — now visible to buyers.')
  }

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Test New Component</h1>
        <p className="text-gray-500 mt-1">
          Identify, diagnose, and grade electronic components for recovery
          {hasApiKey() && <span className="ml-2 inline-flex items-center gap-1 text-xs text-green-600 font-medium"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Intelligent Diagnostics active</span>}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Component Type</label>
                <Combobox
                  value={componentType}
                  onChange={handleComponentSelect}
                  options={KNOWN_COMPONENTS}
                  placeholder="Type or select — e.g. ESP32, DHT22, L298N..."
                />
                {category && (
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-detected category: <span className="text-gray-600 font-medium">{category}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Model / SKU</label>
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    placeholder={photoPreview ? 'Inferred from photo' : 'e.g. ESP32-WROOM-32D'}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value)}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Component Photo</label>
                  <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => photoRef.current?.click()}
                    className="w-full rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:bg-gray-50 hover:border-gray-400 text-center"
                  >
                    {photoIdentifying ? (
                      <span className="text-green-600">Identifying component...</span>
                    ) : photoPreview ? (
                      <span className="text-gray-900 font-medium">Photo uploaded — click to replace</span>
                    ) : (
                      <><span className="block text-lg mb-1">📷</span>Upload photo for auto-identification</>
                    )}
                  </button>
                  {photoPreview && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={photoPreview} alt="Component" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                      <p className="text-xs text-gray-400">Image will be analyzed for auto-identification</p>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Data File</label>
                  <input ref={dataRef} type="file" accept=".json,.csv,.txt,.log" onChange={handleDataUpload} className="hidden" />
                  <button
                    type="button"
                    onClick={() => dataRef.current?.click()}
                    className="w-full rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 hover:bg-gray-50 hover:border-gray-400 text-center"
                  >
                    {testData ? (
                      <span className="text-gray-900 font-medium">{testData.name}</span>
                    ) : (
                      <><span className="block text-lg mb-1">📄</span>Upload .json, .csv, or .log</>
                    )}
                  </button>
                  {testDataPreview && (
                    <div className="mt-2 rounded-lg bg-gray-50 border border-gray-100 p-3 max-h-32 overflow-auto">
                      <pre className="text-[11px] text-gray-600 whitespace-pre-wrap font-mono leading-relaxed">{testDataPreview}</pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <Button type="submit" disabled={loading || !componentType}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                        <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                      </svg>
                      {hasApiKey() ? 'Running intelligent analysis...' : 'Running diagnostic...'}
                    </span>
                  ) : 'Run Diagnostic'}
                </Button>
                {componentType && (
                  <Button variant="ghost" type="button" onClick={fetchCircuitDiagram} disabled={circuitLoading}>
                    {circuitLoading ? 'Loading...' : '⚡ Fetch Pinout'}
                  </Button>
                )}
              </div>
            </form>
          </Card>

          {circuitData && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Circuit / Pinout Reference</h3>
                <span className="text-xs text-gray-400">{componentType}</span>
              </div>
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 mb-4 overflow-x-auto">
                <pre className="text-xs text-gray-700 font-mono leading-relaxed whitespace-pre">{circuitData.pinout}</pre>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Pin Reference</p>
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-1.5 font-medium text-gray-500">Pin</th>
                        <th className="text-left py-1.5 font-medium text-gray-500">Function</th>
                        <th className="text-left py-1.5 font-medium text-gray-500">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {circuitData.pins?.map((p) => (
                        <tr key={p.pin} className="border-b border-gray-50">
                          <td className="py-1.5 font-medium text-gray-900">{p.pin}</td>
                          <td className="py-1.5 text-gray-600">{p.function}</td>
                          <td className="py-1.5 text-gray-400">{p.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500">Operating Voltage</p>
                    <p className="text-sm font-medium text-gray-900">{circuitData.voltage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Key Specs</p>
                    <div className="flex flex-wrap gap-1.5">
                      {circuitData.keySpecs?.map((s) => (
                        <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="bg-gray-50 border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm mb-3">How it works</h3>
            <ol className="space-y-3 text-sm">
              {[
                { step: '1', title: 'Select or type component', desc: 'Category detected automatically' },
                { step: '2', title: 'Upload photo (optional)', desc: 'Auto-identifies model & specs' },
                { step: '3', title: 'Upload test data (optional)', desc: 'JSON, CSV, or log files' },
                { step: '4', title: 'Run Diagnostic', desc: 'Intelligent system analyzes & grades' },
              ].map((s) => (
                <li key={s.step} className="flex gap-3">
                  <span className="w-6 h-6 rounded-lg bg-gray-900 text-white text-xs font-bold flex items-center justify-center shrink-0">{s.step}</span>
                  <div>
                    <p className="font-medium text-gray-900">{s.title}</p>
                    <p className="text-gray-500 text-xs">{s.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          {!hasApiKey() && (
            <Card className="border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-1">Enable Intelligent Diagnostics</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Add your API key in <code className="bg-gray-100 px-1 rounded">.env</code> as <code className="bg-gray-100 px-1 rounded">VITE_GEMINI_API_KEY</code> for enhanced diagnostics, photo identification, and circuit diagram fetching. Works with fallback data without it.
              </p>
            </Card>
          )}

          {componentType && (
            <Card>
              <h3 className="font-bold text-gray-900 text-sm mb-2">Component Info</h3>
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500 text-xs">Type</dt>
                  <dd className="text-gray-900 font-medium">{componentType}</dd>
                </div>
                <div>
                  <dt className="text-gray-500 text-xs">Category</dt>
                  <dd className="text-gray-900 font-medium">{category || '—'}</dd>
                </div>
                {modelName && (
                  <div>
                    <dt className="text-gray-500 text-xs">Model</dt>
                    <dd className="text-gray-900 font-medium">{modelName}</dd>
                  </div>
                )}
                {serial && (
                  <div>
                    <dt className="text-gray-500 text-xs">Serial</dt>
                    <dd className="text-gray-900 font-mono text-xs">{serial}</dd>
                  </div>
                )}
              </dl>
            </Card>
          )}
        </div>
      </div>

      {successAction && (
        <div className="rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">
          {successAction}
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-fade-in-up">
          <Card>
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-900">Diagnostic Report</h3>
                  {result.geminiPowered && (
                    <span className="text-[10px] bg-gray-900 text-white px-2 py-0.5 rounded-full font-medium">Intelligent Analysis</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">{componentType}{modelName ? ` — ${modelName}` : ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">{result.reusability}%</p>
                  <p className="text-xs text-gray-400">reusability</p>
                </div>
                <GradeBadge grade={result.grade} />
              </div>
            </div>

            {result.summary && (
              <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{result.summary}</p>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="rounded-xl bg-white border border-gray-100 p-3 text-center shadow-soft">
                <p className="text-lg font-bold text-gray-900">{result.grade}</p>
                <p className="text-[11px] text-gray-500">Grade</p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-3 text-center shadow-soft">
                <p className="text-lg font-bold text-gray-900">{result.reusability}%</p>
                <p className="text-[11px] text-gray-500">Reusability</p>
              </div>
              <div className="rounded-xl bg-green-50 border border-green-100 p-3 text-center">
                <p className="text-lg font-bold text-green-700">{result.co2Saved || '~0.4 kg'}</p>
                <p className="text-[11px] text-gray-500">CO₂ Saved</p>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-3 text-center shadow-soft">
                <p className="text-lg font-bold text-gray-900">{result.estimatedValue || '₹—'}</p>
                <p className="text-[11px] text-gray-500">Est. Value</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Layer Status</p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {LAYER_NAMES.map((name) => {
                    const working = result.layers[name]
                    const cap = result.capabilityMatrix?.find((c) => c.feature === name)
                    const status = cap?.status || (working ? 'Working' : 'N/A')
                    const colorClass =
                      status === 'Working' ? 'bg-green-50 border-green-200 text-green-700'
                      : status === 'Degraded' ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      : status === 'Failed' ? 'bg-red-50 border-red-200 text-red-600'
                      : 'bg-gray-50 border-gray-200 text-gray-400'
                    return (
                      <div key={name} className={`rounded-lg border p-2 text-center text-xs ${colorClass}`}>
                        <p className="font-medium">{name}</p>
                        <p className="text-[10px] mt-0.5">{status}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Capability Matrix</p>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Feature</th>
                        <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Status</th>
                        <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.capabilityMatrix.map((row) => (
                        <tr key={row.feature} className="border-t border-gray-100">
                          <td className="px-4 py-2 font-medium text-gray-900">{row.feature}</td>
                          <td className="px-4 py-2">
                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                              row.status === 'Working' ? 'bg-green-500' : row.status === 'Degraded' ? 'bg-yellow-500' : row.status === 'Failed' ? 'bg-red-500' : 'bg-gray-300'
                            }`} />
                            {row.status}
                          </td>
                          <td className="px-4 py-2 text-gray-500">{row.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Approved Use Cases</p>
                  <div className="flex flex-wrap gap-2">
                    {result.useCases.map((u) => (
                      <Badge key={u} variant="primary">{u}</Badge>
                    ))}
                  </div>
                </div>
                {result.risks && result.risks.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Risk Factors</p>
                    <ul className="space-y-1">
                      {result.risks.map((r) => (
                        <li key={r} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-gray-300 shrink-0">•</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {result.recommendation && (
                <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs text-gray-400 mb-1">Recommendation</p>
                  <p className="text-sm text-gray-700">{result.recommendation}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <div className="relative">
                  <Button variant="primary" onClick={handleAddToInventory}>Add to Internal Inventory</Button>
                  <InventoryLeaves />
                </div>
                <div className="relative">
                  <Button variant="secondary" onClick={handleListOnMarketplace}>List on Marketplace</Button>
                  <MarketplaceLeaves />
                </div>
                <DownloadDropdown
                  onDownload={(fmt) => downloadReport({
                    componentType, modelName, serial, category, result,
                    testDataFile: testData?.name,
                  }, fmt)}
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
