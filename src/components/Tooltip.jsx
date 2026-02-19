import { useState } from 'react'

export default function Tooltip({ content, children, className = '' }) {
  const [show, setShow] = useState(false)
  return (
    <span
      className={`relative inline-flex ${className}`}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs text-white bg-gray-800 rounded-lg whitespace-nowrap shadow-lg"
          role="tooltip"
        >
          {content}
        </span>
      )}
    </span>
  )
}
