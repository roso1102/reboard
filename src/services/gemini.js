const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent'

export async function callGemini(prompt, imageBase64 = null) {
  if (!GEMINI_API_KEY) return null

  const parts = [{ text: prompt }]

  if (imageBase64) {
    const match = imageBase64.match(/^data:(image\/\w+);base64,(.+)$/)
    if (match) {
      parts.unshift({
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      })
    }
  }

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 4096 },
    }),
  })

  if (!res.ok) {
    const err = await res.text().catch(() => '')
    console.error('[Gemini API]', res.status, err)
    return null
  }
  const data = await res.json()
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null
}

export async function testConnection() {
  if (!GEMINI_API_KEY) return { ok: false, error: 'No API key set' }
  try {
    const result = await callGemini('Reply with exactly: {"status":"ok","model":"gemini-2.5-flash"}')
    if (result) return { ok: true, response: result }
    return { ok: false, error: 'Empty response' }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

export function buildDiagnosticPrompt(componentType, modelName, category, testDataPreview) {
  return `You are an electronic component diagnostic system for E-Grade, a circular economy platform that tests and grades electronic components for reuse.

Component: ${componentType}
Model: ${modelName || 'Unknown'}
Category: ${category}
${testDataPreview ? `Test Data Sample:\n${testDataPreview}\n` : ''}

Generate a detailed diagnostic report in this exact JSON format (return ONLY valid JSON, no markdown):
{
  "reusability": <number 0-100>,
  "grade": "<A|B|C|D>",
  "summary": "<2-3 sentence summary of the component condition>",
  "layers": {
    "GPIO": { "working": <boolean>, "notes": "<brief note>" },
    "ADC": { "working": <boolean>, "notes": "<brief note>" },
    "PWM": { "working": <boolean>, "notes": "<brief note>" },
    "UART": { "working": <boolean>, "notes": "<brief note>" },
    "SPI": { "working": <boolean>, "notes": "<brief note>" },
    "I2C": { "working": <boolean>, "notes": "<brief note>" },
    "WiFi": { "working": <boolean>, "notes": "<brief note>" },
    "BLE": { "working": <boolean>, "notes": "<brief note>" },
    "Power": { "working": <boolean>, "notes": "<brief note>" }
  },
  "useCases": ["<use case 1>", "<use case 2>", ...],
  "risks": ["<risk 1>", "<risk 2>"],
  "co2Saved": "<estimated kg CO2 saved by reusing instead of discarding>",
  "estimatedValue": "<estimated INR value>",
  "recommendation": "<detailed 4-6 sentence recommendation covering: what the component is best suited for now, any limitations to be aware of, suggested testing before deployment, and end with a disclaimer: 'Disclaimer: This assessment is generated via automated diagnostics and intelligent analysis. It should not be relied upon for safety-critical, medical, aerospace, or life-support applications. Always perform independent verification and compliance testing before deploying in production environments.'>"
}

Be realistic based on the component type. If it's a sensor, WiFi/BLE should be false. Match the category to appropriate layer capabilities. The recommendation must be detailed and always end with the disclaimer about not using for critical applications.`
}

export function buildIdentifyPrompt() {
  return `Look at this electronic component image. Identify it and return ONLY valid JSON (no markdown):
{
  "modelName": "<identified model name>",
  "componentType": "<type like Microcontroller, Sensor, Driver, etc>",
  "category": "<category>",
  "confidence": "<high|medium|low>"
}`
}

export function buildCircuitDiagramPrompt(componentType, modelName) {
  return `You are an electronics expert. For the component "${modelName || componentType}", provide a detailed pin-out / circuit connection guide as ASCII art or structured text. Return ONLY valid JSON:
{
  "pinout": "<ASCII art or text diagram showing pin layout>",
  "pins": [
    { "pin": "<pin name>", "function": "<function>", "notes": "<notes>" }
  ],
  "voltage": "<operating voltage>",
  "keySpecs": ["<spec 1>", "<spec 2>", "<spec 3>"]
}`
}

export const hasApiKey = () => !!GEMINI_API_KEY
