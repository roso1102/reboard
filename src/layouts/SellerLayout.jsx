import { useState } from 'react'
import { Outlet, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

const NAV = [
  {
    to: '', label: 'My Listings',
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>,
  },
  {
    to: '/sales', label: 'Sales',
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    to: '/inventory', label: 'Inventory',
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  },
  {
    to: '/analytics', label: 'Analytics',
    icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  },
]

export default function SellerLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside
        className={`${collapsed ? 'w-16' : 'w-56'} border-r border-gray-200 bg-white flex flex-col shrink-0`}
        style={{ transition: 'width 0.2s ease' }}
      >
        <div className={`border-b border-gray-100 ${collapsed ? 'p-3 text-center' : 'p-4'}`}>
          <Link to="/marketplace" className={`font-bold text-gray-900 ${collapsed ? 'text-sm' : 'text-lg'}`}>
            {collapsed ? 'E' : 'E-Grade'}
          </Link>
          {!collapsed && <p className="text-xs text-gray-500 mt-0.5">Seller Dashboard</p>}
        </div>
        <Sidebar items={NAV} basePath="/marketplace/seller" collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
