import Tooltip from './Tooltip'

const GRADE_DESC = {
  A: 'Fully functional; all key layers working. Best for critical use.',
  B: 'Mostly functional; minor limitations. Suitable for most applications.',
  C: 'Partially functional; some layers degraded. Good for non-critical use.',
  D: 'Limited functionality; significant restrictions. Use for learning or spare parts.',
}

export default function GradeBadge({ grade, showLabel = true, className = '' }) {
  const colors = {
    A: 'bg-green-50 text-green-700 border-green-200',
    B: 'bg-gray-100 text-gray-700 border-gray-300',
    C: 'bg-gray-50 text-gray-500 border-gray-200',
    D: 'bg-gray-50 text-gray-400 border-gray-200',
  }
  const c = colors[grade] || colors.D
  return (
    <Tooltip content={GRADE_DESC[grade] || 'Grade not specified'}>
      <span
        className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-medium ${c} ${className}`}
      >
        {showLabel ? `Grade ${grade}` : grade}
      </span>
    </Tooltip>
  )
}
