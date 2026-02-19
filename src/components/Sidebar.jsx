import { NavLink } from 'react-router-dom'

export default function Sidebar({ items, basePath, collapsed, onToggle }) {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 flex flex-col gap-0.5 py-4">
        {items.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={basePath + to}
            end={to === ''}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl text-sm font-medium tracking-tight ${
                collapsed ? 'px-3 py-2.5 justify-center' : 'px-4 py-2.5'
              } ${
                isActive
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`
            }
          >
            {icon && <span className="w-5 h-5 shrink-0">{icon}</span>}
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className="mx-3 mb-4 flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100"
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
        </svg>
        {!collapsed && <span className="text-xs">Collapse</span>}
      </button>
    </div>
  )
}
