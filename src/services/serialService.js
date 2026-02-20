const BAUD_RATE = 115200

export function isWebSerialSupported() {
  return 'serial' in navigator
}

export async function connectSerial() {
  if (!isWebSerialSupported()) throw new Error('Web Serial API not supported in this browser')

  const port = await navigator.serial.requestPort()
  await port.open({ baudRate: BAUD_RATE })
  return port
}

export async function disconnectSerial(port) {
  try {
    if (port?.readable?.locked) {
      const reader = port.readable.getReader()
      await reader.cancel()
      reader.releaseLock()
    }
    if (port?.writable?.locked) {
      const writer = port.writable.getWriter()
      await writer.close()
      writer.releaseLock()
    }
    await port.close()
  } catch {}
}

export async function sendCommand(port, command) {
  const writer = port.writable.getWriter()
  const encoder = new TextEncoder()
  await writer.write(encoder.encode(command + '\n'))
  writer.releaseLock()
}

/**
 * Reads serial output line-by-line. Calls onLine(text) for each line received.
 * Captures JSON between JSON_START / JSON_END markers and resolves with parsed object.
 * Rejects after timeoutMs if no JSON_END is received.
 */
export function readUntilJSON(port, { onLine, timeoutMs = 30000, signal } = {}) {
  return new Promise((resolve, reject) => {
    let cancelled = false
    let reader = null
    let buffer = ''
    let jsonLines = []
    let capturing = false
    let timeout = null

    const cleanup = () => {
      cancelled = true
      if (timeout) clearTimeout(timeout)
      if (reader) {
        try { reader.cancel() } catch {}
        try { reader.releaseLock() } catch {}
      }
    }

    if (signal) {
      signal.addEventListener('abort', () => {
        cleanup()
        reject(new DOMException('Aborted', 'AbortError'))
      })
    }

    timeout = setTimeout(() => {
      cleanup()
      reject(new Error('Timeout waiting for hardware response'))
    }, timeoutMs)

    async function pump() {
      try {
        reader = port.readable.getReader()

        while (!cancelled) {
          const { value, done } = await reader.read()
          if (done || cancelled) break

          buffer += new TextDecoder().decode(value)
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const raw of lines) {
            const line = raw.replace(/\r/g, '').trim()
            if (!line) continue

            if (onLine) onLine(line)

            if (line === 'JSON_START') {
              capturing = true
              jsonLines = []
              continue
            }

            if (line === 'JSON_END') {
              capturing = false
              const jsonStr = jsonLines.join('')
              try {
                const parsed = JSON.parse(jsonStr)
                cleanup()
                resolve(parsed)
                return
              } catch (e) {
                cleanup()
                reject(new Error('Failed to parse hardware JSON: ' + e.message))
                return
              }
            }

            if (capturing) {
              jsonLines.push(line)
            }
          }
        }
      } catch (e) {
        if (!cancelled) {
          cleanup()
          reject(e)
        }
      } finally {
        try { reader?.releaseLock() } catch {}
      }
    }

    pump()
  })
}
