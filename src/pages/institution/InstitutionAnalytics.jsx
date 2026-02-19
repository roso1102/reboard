import Card from '../../components/Card'
import {
  FAILURE_RATE_BY_LAYER,
  REUSABILITY_BY_CATEGORY,
  VALUE_RECOVERED_PER_MONTH,
} from '../../data/mockData'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts'

export default function InstitutionAnalytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-500 mt-1">Failure rates, reusability, and value recovered</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Failure Rate by Layer (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={FAILURE_RATE_BY_LAYER} layout="vertical" margin={{ left: 50 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 25]} tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="layer" tick={{ fontSize: 12 }} width={50} />
                <Tooltip />
                <Bar dataKey="rate" fill="#6b7280" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-gray-900 mb-4">Average Reusability by Category (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={REUSABILITY_BY_CATEGORY} margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="avg" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="font-bold text-gray-900 mb-4">Value Recovered Per Month (₹)</h3>
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
