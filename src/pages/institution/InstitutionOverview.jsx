import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import {
  INSTITUTION_KPIS,
  MONTHLY_RECOVERY,
  FAILURE_TYPES,
  FAILURE_RATE_BY_LAYER,
  REUSABILITY_BY_CATEGORY,
} from '../../data/mockData'
import { useStore } from '../../context/StoreContext'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts'

const KPI_ITEMS = [
  {
    key: 'totalTested',
    label: 'Components Tested',
    format: (v) => v.toLocaleString(),
    change: '+124 this month',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    key: 'recoveredValue',
    label: 'Value Recovered',
    format: (v) => `₹${(v / 1000).toFixed(0)}K`,
    change: '+₹47.6K this month',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    key: 'reusabilityRate',
    label: 'Reusability Rate',
    format: (v) => `${v}%`,
    change: '+3% vs last quarter',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    key: 'scrapReduction',
    label: 'Scrap Reduction',
    format: (v) => `${v}%`,
    change: 'vs traditional disposal',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
]

const CO2_MONTHLY = [
  { month: 'Aug', saved: 28 },
  { month: 'Sep', saved: 36 },
  { month: 'Oct', saved: 41 },
  { month: 'Nov', saved: 48 },
  { month: 'Dec', saved: 52 },
  { month: 'Jan', saved: 58 },
  { month: 'Feb', saved: 64 },
]

const GRADE_COLORS = { A: '#16a34a', B: '#111827', C: '#6b7280', D: '#d1d5db' }

const totalCO2Saved = CO2_MONTHLY.reduce((s, m) => s + m.saved, 0)

const STATUS_VARIANT = { Confirmed: 'primary', Processing: 'warning', Shipped: 'success', Delivered: 'success', Cancelled: 'default' }

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function InstitutionOverview() {
  const { components, orders } = useStore()

  const gradeDistribution = (() => {
    const counts = { A: 0, B: 0, C: 0, D: 0 }
    components.forEach((c) => { counts[c.grade] = (counts[c.grade] || 0) + 1 })
    return Object.entries(counts).map(([grade, count]) => ({ grade, count }))
  })()

  const recentTests = components.slice(0, 4).map((c) => ({
    name: c.name,
    grade: c.grade,
    time: c.testTimestamp ? timeAgo(c.testTimestamp) : '—',
    reusability: c.reusability,
  }))

  const pendingOrders = orders.filter((o) => o.status !== 'Delivered' && o.status !== 'Cancelled')

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Real-time recovery metrics, sustainability impact & quick actions</p>
        </div>
        <div className="flex gap-3">
          <Link to="/dashboard/test" className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Test New Component
          </Link>
          <Link to="/dashboard/inventory" className="inline-flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50">
            Inventory
          </Link>
          <Link to="/dashboard/orders" className="relative inline-flex items-center gap-2 border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50">
            Orders
            {pendingOrders.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-green-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{pendingOrders.length}</span>
            )}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_ITEMS.map(({ key, label, format, change, icon }) => (
          <Card key={key}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-1.5 text-2xl font-bold text-gray-900">
                  {format(INSTITUTION_KPIS[key])}
                </p>
                <p className="mt-1 text-xs text-eco-600 font-medium">{change}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-xl text-gray-400">
                {icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-1 bg-gradient-to-br from-eco-50 to-white border-eco-100">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-eco-100 rounded-xl text-eco-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Environmental Impact</h3>
              <p className="text-sm text-gray-500">CO₂ emissions prevented</p>
            </div>
          </div>
          <p className="text-4xl font-bold text-eco-600">{totalCO2Saved} kg</p>
          <p className="text-sm text-gray-500 mt-1">Total CO₂ saved to date</p>
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CO2_MONTHLY}>
                <defs>
                  <linearGradient id="co2fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(v) => [`${v} kg`, 'CO₂ Saved']} />
                <Area type="monotone" dataKey="saved" stroke="#16a34a" fill="url(#co2fill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/70 rounded-xl p-2.5 border border-eco-100">
              <p className="text-lg font-bold text-gray-900">~{(totalCO2Saved * 0.05).toFixed(0)}</p>
              <p className="text-[11px] text-gray-500">Trees Equivalent</p>
            </div>
            <div className="bg-white/70 rounded-xl p-2.5 border border-eco-100">
              <p className="text-lg font-bold text-gray-900">{(totalCO2Saved * 4.6).toFixed(0)} km</p>
              <p className="text-[11px] text-gray-500">Car Driving Offset</p>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Recovery Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHLY_RECOVERY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `₹${v / 1000}K`} axisLine={false} tickLine={false} />
                <RechartsTooltip formatter={(v) => [`₹${(v / 1000).toFixed(1)}K`, 'Value']} />
                <Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={2.5} dot={{ fill: '#111827', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Failure Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={FAILURE_TYPES}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  innerRadius={45}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#d1d5db' }}
                >
                  {FAILURE_TYPES.map((_, i) => (
                    <Cell key={i} fill={FAILURE_TYPES[i].color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Grade Distribution</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeDistribution} barCategoryGap="30%">
                <XAxis dataKey="grade" tick={{ fontSize: 13, fontWeight: 600 }} stroke="#9ca3af" axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" axisLine={false} tickLine={false} allowDecimals={false} />
                <RechartsTooltip formatter={(v) => [v, 'Components']} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeDistribution.map((d) => (
                    <Cell key={d.grade} fill={GRADE_COLORS[d.grade]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Failure Rate by Layer</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FAILURE_RATE_BY_LAYER} layout="vertical" barCategoryGap="20%">
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis dataKey="layer" type="category" tick={{ fontSize: 11 }} stroke="#9ca3af" axisLine={false} tickLine={false} width={50} />
                <RechartsTooltip formatter={(v) => [`${v}%`, 'Failure Rate']} />
                <Bar dataKey="rate" fill="#6b7280" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Tests</h3>
            <Link to="/dashboard/inventory" className="text-sm text-gray-500 hover:text-gray-900 font-medium">View all</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentTests.map((t, idx) => (
              <div key={`${t.name}-${idx}`} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white ${
                    t.grade === 'A' ? 'bg-green-600' : t.grade === 'B' ? 'bg-gray-900' : t.grade === 'C' ? 'bg-gray-500' : 'bg-gray-300'
                  }`}>
                    {t.grade}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{t.reusability}%</p>
                  <p className="text-[11px] text-gray-400">reusability</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Reusability by Category</h3>
          <div className="space-y-4 mt-2">
            {REUSABILITY_BY_CATEGORY.map((c) => (
              <div key={c.category}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-700">{c.category}</span>
                  <span className="text-sm font-bold text-gray-900">{c.avg}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${c.avg}%`,
                      background: c.avg >= 85 ? '#16a34a' : c.avg >= 75 ? '#111827' : '#6b7280',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <p className="text-sm text-gray-500">Quick insight</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              Power Modules and Sensors have the highest reusability at 88% and 85%, making them the most recoverable categories in your inventory.
            </p>
          </div>
        </Card>
      </div>

      {orders.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-900">Recent Orders</h3>
              <p className="text-xs text-gray-400 mt-0.5">{pendingOrders.length} pending · {orders.length} total</p>
            </div>
            <Link to="/dashboard/orders" className="text-sm text-gray-500 hover:text-gray-900 font-medium">View all →</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={STATUS_VARIANT[o.status] || 'default'}>{o.status}</Badge>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{o.id}</p>
                    <p className="text-xs text-gray-400">{o.buyer?.name || 'Buyer'} · {o.items.length} item{o.items.length > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{o.total}</p>
                  <p className="text-[11px] text-gray-400">{timeAgo(o.placedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
