import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import GradeBadge from '../../components/GradeBadge'
import Badge from '../../components/Badge'
import { useStore } from '../../context/StoreContext'

export default function DashboardListings() {
  const { sellerListings } = useStore()

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Marketplace Listings</h1>
        <p className="text-gray-500 mt-1">Components you have listed on the marketplace</p>
      </div>

      {sellerListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sellerListings.map((c) => (
            <Card key={c.id} hover>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">{c.name}</h3>
                <GradeBadge grade={c.grade} showLabel={false} />
              </div>
              <p className="text-sm text-gray-500 mt-0.5">{c.id}</p>
              <p className="text-sm text-gray-600 mt-2">Reusability: {c.reusability}% · ₹{c.price}</p>
              <p className="text-sm text-gray-600">Qty: {c.quantity} · {c.location}</p>
              <Badge variant="success" className="mt-2">{c.status}</Badge>
              <Link to={`/marketplace/component/${c.id}`} className="mt-3 inline-block text-sm text-gray-500 hover:text-gray-900 hover:underline">
                View on Marketplace →
              </Link>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center text-gray-500">
          No listings yet. Grade components via Test Component, then list from Inventory.
        </Card>
      )}
    </div>
  )
}
