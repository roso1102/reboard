export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  disabled,
  onClick,
  ...rest
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium tracking-tight focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants = {
    primary:
      'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-900 shadow-soft hover:shadow-soft-lg px-6 py-3',
    secondary:
      'bg-white text-gray-900 hover:bg-gray-50 focus:ring-gray-400 border-2 border-gray-900 px-6 py-3',
    ghost:
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-300 px-4 py-2',
  }
  const styles = `${base} ${variants[variant]} ${className}`

  return (
    <button type={type} className={styles} disabled={disabled} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}
