import Card from '../../../components/Card'
import { VALUE_RECOVERED_PER_MONTH } from '../../../data/mockData'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function SellerAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Listing and sales metrics</p>
      </div>
      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Value recovered (seller view, demo)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={VALUE_RECOVERED_PER_MONTH}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v / 1000}K`} />
              <Tooltip formatter={(v) => [`₹${(v / 1000).toFixed(1)}K`, 'Value']} />
              <Line type="monotone" dataKey="value" stroke="#111827" strokeWidth={2} dot={{ fill: '#111827' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
