import { useState, useEffect } from 'react'

export default function PageLoader({ children }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-gray-200" />
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-gray-900 border-t-transparent animate-spin" />
        </div>
        <p className="mt-6 text-xl font-extrabold tracking-tight text-gray-900">
          E-Grade
        </p>
        <p className="mt-1 text-sm text-gray-500 font-medium">
          Loading platform...
        </p>
      </div>
    )
  }

  return <div className="animate-fade-in">{children}</div>
}
