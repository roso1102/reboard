import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import Button from '../components/Button'
import Card from '../components/Card'

const FEATURES = [
  {
    title: 'Automated Layered Testing',
    desc: 'Systematic validation of each functional layer — GPIO, ADC, WiFi, and more.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    title: 'Reusability Scoring',
    desc: 'Data-driven grades (A–D) based on real test data. Know exactly what still works.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    title: 'Verified Certification',
    desc: 'E-Grade certified functional valuation — trusted by institutions and buyers.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Smart Matching Engine',
    desc: 'Describe what you need. Get matched to graded components by capability.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
]

const CIRCLE_STEPS = [
  {
    word: 'Test',
    desc: 'Run layered diagnostics on every electronic component.',
    stats: [
      { value: '1,247', label: 'Components Tested' },
      { value: '9', label: 'Functional Layers' },
    ],
  },
  {
    word: 'Grade',
    desc: 'Assign A–D grades based on functional capability.',
    stats: [
      { value: '4', label: 'Grade Levels (A–D)' },
      { value: '73%', label: 'Avg Reusability Score' },
    ],
  },
  {
    word: 'Recover',
    desc: 'Capture residual value from surplus and e-waste.',
    stats: [
      { value: '₹2.8L', label: 'Value Recovered' },
      { value: '41%', label: 'Scrap Reduction' },
    ],
  },
  {
    word: 'Reuse',
    desc: 'Route working components to new applications.',
    stats: [
      { value: '856', label: 'Components Reused' },
      { value: '68%', label: 'Reuse Rate' },
    ],
  },
  {
    word: 'Certify',
    desc: 'Issue verified E-Grade certification reports.',
    stats: [
      { value: '1,102', label: 'Certifications Issued' },
      { value: '100%', label: 'Audit Traceability' },
    ],
  },
  {
    word: 'List',
    desc: 'Publish graded components on the marketplace.',
    stats: [
      { value: '430', label: 'Active Listings' },
      { value: '12', label: 'Seller Institutions' },
    ],
  },
  {
    word: 'Match',
    desc: 'AI-powered matching to buyer requirements.',
    stats: [
      { value: '89%', label: 'Match Accuracy' },
      { value: '< 2s', label: 'Avg Response Time' },
    ],
  },
  {
    word: 'Allocate',
    desc: 'Circular allocation — nothing functional goes to waste.',
    stats: [
      { value: '320 kg', label: 'CO₂ Emissions Saved' },
      { value: '0%', label: 'Functional Waste' },
    ],
  },
]

function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

function CircularEconomy() {
  const wrapperRef = useRef(null)
  const [step, setStep] = useState(0)
  const totalSteps = CIRCLE_STEPS.length

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return
    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect()
      const wrapperH = wrapper.offsetHeight
      const viewH = window.innerHeight
      const scrolled = -rect.top
      const scrollRange = wrapperH - viewH
      if (scrollRange <= 0) return
      const progress = Math.max(0, Math.min(1, scrolled / scrollRange))
      const raw = progress * totalSteps
      setStep(Math.min(totalSteps - 1, Math.floor(raw)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [totalSteps])

  const rotation = (step / totalSteps) * 360
  const current = CIRCLE_STEPS[step]
  const stepAngle = 360 / totalSteps

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${totalSteps * 70}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 w-full flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 flex items-center justify-center">
            <div className="relative w-80 h-80 md:w-[420px] md:h-[420px]">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <circle cx="200" cy="200" r="185" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                <circle cx="200" cy="200" r="160" fill="none" stroke="#e5e7eb" strokeWidth="2" />

                {CIRCLE_STEPS.map((s, i) => {
                  const angle = (i * stepAngle - 90) * (Math.PI / 180)
                  const x = 200 + 172 * Math.cos(angle)
                  const y = 200 + 172 * Math.sin(angle)
                  const isActive = i === step
                  const isPast = i < step
                  return (
                    <g key={s.word}>
                      <circle
                        cx={x} cy={y} r={isActive ? 8 : 5}
                        fill={isActive ? '#16a34a' : isPast ? '#6b7280' : '#d1d5db'}
                        style={{ transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      />
                      <text
                        x={x}
                        y={y + (y < 200 ? -16 : 20)}
                        textAnchor="middle"
                        className={`text-[11px] uppercase tracking-wider ${
                          isActive ? 'fill-gray-900' : isPast ? 'fill-gray-500' : 'fill-gray-300'
                        }`}
                        style={{
                          fontWeight: isActive ? 700 : 500,
                          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {s.word}
                      </text>
                    </g>
                  )
                })}

                <g style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: '200px 200px',
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  <line x1="200" y1="200" x2="200" y2="45" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" />
                  <circle cx="200" cy="45" r="5" fill="#16a34a" />
                </g>

                <circle cx="200" cy="200" r="80" fill="white" stroke="#e5e7eb" strokeWidth="1.5" />
                <circle cx="200" cy="200" r="6" fill="#111827" />

                <text
                  x="200" y="196"
                  textAnchor="middle"
                  style={{ fontSize: '22px', fontWeight: 700, fill: '#111827', transition: 'all 0.4s ease-out' }}
                  key={current.word}
                >
                  {current.word}
                </text>
                <text x="200" y="216" textAnchor="middle" style={{ fontSize: '9px', fontWeight: 600, fill: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {step + 1} / {totalSteps}
                </text>
              </svg>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6">
            <div>
              <p className="text-sm font-medium text-eco-600 uppercase tracking-widest">Circular Economy</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Electronics deserve<br />a <span className="highlight-green">second life</span>.
              </h2>
            </div>

            <div
              className="bg-gray-50 rounded-2xl border border-gray-100 p-6 min-h-[110px] flex flex-col justify-center"
              key={step}
              style={{ animation: 'fadeInUp 0.35s ease-out both' }}
            >
              <p className="text-2xl font-bold text-gray-900">{current.word}</p>
              <p className="mt-1.5 text-gray-600 leading-relaxed">{current.desc}</p>
            </div>

            <div className="flex gap-2">
              {CIRCLE_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full ${
                    i === step ? 'bg-eco-500 w-8' : i < step ? 'bg-gray-400 w-4' : 'bg-gray-200 w-4'
                  }`}
                  style={{ transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
              ))}
            </div>

            <div
              className="grid grid-cols-2 gap-4"
              key={`stats-${step}`}
              style={{ animation: 'fadeInUp 0.35s ease-out both' }}
            >
              {current.stats.map((s) => (
                <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-soft">
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null)
  const visible = useInView(ref)
  return (
    <div
      ref={ref}
      className={`${className} ${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
    >
      {children}
    </div>
  )
}

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold tracking-tight text-gray-900">E-Grade</span>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#about" className="hover:text-gray-900">About</a>
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#circular" className="hover:text-gray-900">Circular Economy</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/institution">
              <Button variant="ghost" className="text-sm">Institution Login</Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="primary" className="text-sm">Marketplace</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section id="about" className="max-w-5xl mx-auto px-6 pt-24 pb-16 text-center">
          <p className="text-sm font-medium text-eco-600 uppercase tracking-widest animate-fade-in-up">
            Electronic Asset Recovery Platform
          </p>
          <h1 className="mt-4 text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.08] animate-fade-in-up animate-delay-100">
            Prevent Functional<br />
            Electronics from<br />
            <span className="highlight-green">Becoming Waste</span>
          </h1>
          <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
            Graded functional valuation & circular allocation for electronic components.
            Test. Grade. Recover. Reuse.
          </p>
          <div className="mt-10 flex gap-4 justify-center flex-wrap animate-fade-in-up animate-delay-300">
            <Link to="/institution">
              <Button variant="primary" className="text-base px-8 py-3.5">
                Institution Login
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="secondary" className="text-base px-8 py-3.5">
                Browse Marketplace
              </Button>
            </Link>
          </div>
        </section>

        <div id="circular">
          <CircularEconomy />
        </div>

        <section id="features" className="max-w-6xl mx-auto px-6 py-20">
          <AnimatedSection className="text-center mb-16">
            <p className="text-sm font-medium text-eco-600 uppercase tracking-widest">How it works</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              From waste to <span className="highlight-green">value</span> in four steps
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((f, i) => (
              <AnimatedSection key={f.title} className={`animate-delay-${(i + 1) * 100}`}>
                <Card hover className="h-full">
                  <div className="text-gray-900 mb-4">{f.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </section>

        <AnimatedSection>
          <section className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
              Ready to <span className="highlight-green">recover value</span>?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Join institutions and buyers building a circular electronics economy.
            </p>
            <div className="mt-10 flex gap-4 justify-center flex-wrap">
              <Link to="/institution">
                <Button variant="primary" className="text-base px-8 py-3.5">
                  Get Started
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="secondary" className="text-base px-8 py-3.5">
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </section>
        </AnimatedSection>
      </main>

      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
          <span className="text-sm font-bold text-gray-900">E-Grade</span>
          <div className="flex flex-wrap gap-6 text-sm text-gray-500">
            <a href="#about" className="hover:text-gray-900">About</a>
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Sustainability Report</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
