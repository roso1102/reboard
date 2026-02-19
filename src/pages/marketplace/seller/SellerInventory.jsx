import Card from '../../../components/Card'
import GradeBadge from '../../../components/GradeBadge'
import Badge from '../../../components/Badge'
import { MOCK_SELLER_LISTINGS } from '../../../data/mockData'

export default function SellerInventory() {
  const items = MOCK_SELLER_LISTINGS
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-gray-500 mt-1">Components available to list</p>
      </div>
      <div className="overflow-x-auto">
        <Card padding={false}>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Grade</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Reusability %</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Quantity</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id} className="border-b border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-4 py-3"><GradeBadge grade={c.grade} showLabel={false} /></td>
                  <td className="px-4 py-3 text-gray-600">{c.reusability}%</td>
                  <td className="px-4 py-3 text-gray-600">{c.quantity}</td>
                  <td className="px-4 py-3"><Badge variant="success">{c.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
      {items.length === 0 && (
        <Card className="py-12 text-center text-gray-500">No inventory items.</Card>
      )}
    </div>
  )
}
