export default function Card({ children, className = '', padding = true, hover }) {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-soft border border-gray-100
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:shadow-soft-lg hover:border-gray-200 hover:-translate-y-0.5' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
