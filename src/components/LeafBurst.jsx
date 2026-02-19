import { useState, useCallback } from 'react'

const LEAF_CHARS = ['🍃', '🌿', '☘️', '🍀', '🌱']

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

export function useLeafBurst() {
  const [leaves, setLeaves] = useState([])

  const burst = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    const batch = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      char: LEAF_CHARS[i % LEAF_CHARS.length],
      x: cx + randomBetween(-10, 10),
      y: cy + randomBetween(-10, 10),
      lx: randomBetween(-50, 50),
      ly: randomBetween(-60, -20),
      lr: randomBetween(-120, 120),
    }))
    setLeaves(batch)
    setTimeout(() => setLeaves([]), 1000)
  }, [])

  const LeafLayer = () =>
    leaves.length > 0 ? (
      <>
        {leaves.map((l) => (
          <span
            key={l.id}
            className="leaf-particle"
            style={{
              left: l.x,
              top: l.y,
              '--lx': `${l.lx}px`,
              '--ly': `${l.ly}px`,
              '--lr': `${l.lr}deg`,
            }}
          >
            {l.char}
          </span>
        ))}
      </>
    ) : null

  return { burst, LeafLayer }
}
