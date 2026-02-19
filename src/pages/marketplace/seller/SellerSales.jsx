import Card from '../../../components/Card'

export default function SellerSales() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <p className="text-gray-500 mt-1">Orders and buyer requests</p>
      </div>
      <Card className="py-12 text-center text-gray-500">
        No sales yet. Buyer requests will appear here (demo).
      </Card>
    </div>
  )
}
