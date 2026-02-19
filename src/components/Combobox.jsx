import { useState, useRef, useEffect } from 'react'

export default function Combobox({ value, onChange, options, placeholder = 'Search or type...' }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState(value || '')
  const wrapperRef = useRef(null)

  useEffect(() => { setQuery(value || '') }, [value])

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase())
  )

  const handleInput = (e) => {
    setQuery(e.target.value)
    setOpen(true)
    onChange({ value: e.target.value, label: e.target.value, category: null })
  }

  const handleSelect = (opt) => {
    setQuery(opt.label)
    onChange(opt)
    setOpen(false)
  }

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInput}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
      />
      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>

      {open && filtered.length > 0 && (
        <ul className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-soft-lg max-h-60 overflow-auto py-1">
          {filtered.map((opt) => (
            <li
              key={opt.value}
              onClick={() => handleSelect(opt)}
              className={`px-4 py-2.5 cursor-pointer text-sm hover:bg-gray-50 ${
                opt.label === query ? 'bg-gray-50 font-medium' : ''
              }`}
            >
              <span className="text-gray-900">{opt.label}</span>
              {opt.category && (
                <span className="ml-2 text-xs text-gray-400">{opt.category}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {open && query && filtered.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-soft-lg py-3 px-4">
          <p className="text-sm text-gray-500">No match — using "<span className="text-gray-900 font-medium">{query}</span>" as custom type</p>
        </div>
      )}
    </div>
  )
}
