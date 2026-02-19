import { useState, useMemo } from 'react'
import Card from '../../components/Card'
import Badge from '../../components/Badge'
import GradeBadge from '../../components/GradeBadge'
import { MOCK_COMPONENTS } from '../../data/mockData'

const STATUS_VARIANTS = { Internal: 'primary', Listed: 'success', Sold: 'default' }

export default function InstitutionInventory() {
  const [search, setSearch] = useState('')
  const [gradeFilter, setGradeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [view, setView] = useState('table')

  const items = useMemo(() => {
    let list = [...MOCK_COMPONENTS]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          (c.useCases && c.useCases.some((u) => u.toLowerCase().includes(q)))
      )
    }
    if (gradeFilter) list = list.filter((c) => c.grade === gradeFilter)
    if (categoryFilter) list = list.filter((c) => c.category === categoryFilter)
    return list
  }, [search, gradeFilter, categoryFilter])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">Components and status</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView('table')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'table' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Table
          </button>
          <button
            type="button"
            onClick={() => setView('card')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium ${view === 'card' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Card
          </button>
        </div>
      </div>

      <Card padding={false} className="p-4">
        <div className="flex flex-wrap gap-4">
          <input
            type="search"
            placeholder="Search by ID, name, use case…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[200px] rounded-xl border border-gray-200 px-4 py-2 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700"
          >
            <option value="">All grades</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2 text-gray-700"
          >
            <option value="">All categories</option>
            <option value="Microcontroller">Microcontroller</option>
            <option value="Sensor">Sensor</option>
            <option value="Driver">Driver</option>
            <option value="Communication">Communication</option>
            <option value="Power Module">Power Module</option>
          </select>
        </div>
      </Card>

      {view === 'table' ? (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Component ID</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Grade</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Reusability %</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Quantity</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Location</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((c) => (
                  <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.id}</td>
                    <td className="px-4 py-3 text-gray-600">{c.name}</td>
                    <td className="px-4 py-3">
                      <GradeBadge grade={c.grade} showLabel={false} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.reusability}%</td>
                    <td className="px-4 py-3 text-gray-600">{c.quantity}</td>
                    <td className="px-4 py-3 text-gray-600">{c.location}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_VARIANTS[c.status] || 'default'}>{c.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {items.length === 0 && (
            <div className="py-12 text-center text-gray-500">No components match filters.</div>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((c) => (
            <Card key={c.id} hover>
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-900">{c.name}</p>
                <GradeBadge grade={c.grade} showLabel={false} />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{c.id}</p>
              <p className="text-sm text-gray-600 mt-2">Reusability: {c.reusability}% · Qty: {c.quantity}</p>
              <p className="text-sm text-gray-600">{c.location}</p>
              <Badge variant={STATUS_VARIANTS[c.status] || 'default'} className="mt-2">{c.status}</Badge>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
