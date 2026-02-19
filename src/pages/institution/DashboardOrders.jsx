import Card from '../../components/Card'
import Badge from '../../components/Badge'
import Button from '../../components/Button'
import { useStore } from '../../context/StoreContext'

const STATUS_VARIANT = {
  Confirmed: 'primary',
  Processing: 'warning',
  Shipped: 'success',
  Delivered: 'success',
  Cancelled: 'default',
}

const NEXT_STATUS = {
  Confirmed: 'Processing',
  Processing: 'Shipped',
  Shipped: 'Delivered',
}

export default function DashboardOrders() {
  const { orders, updateOrderStatus } = useStore()

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-500 mt-1">Incoming buyer orders for your listed components</p>
      </div>

      {orders.length === 0 ? (
        <Card className="py-16 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 mb-4">
            <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No orders yet.</p>
          <p className="text-gray-400 text-xs mt-1">When buyers purchase your listed components, orders will appear here.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-gray-900">{order.id}</h3>
                    <Badge variant={STATUS_VARIANT[order.status] || 'default'}>{order.status}</Badge>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(order.placedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    {' · '}
                    {new Date(order.placedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <p className="text-xl font-bold text-gray-900">₹{order.total}</p>
              </div>

              <div className="rounded-xl border border-gray-100 overflow-hidden mb-4">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Component</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Grade</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-500 text-xs">Qty</th>
                      <th className="text-right px-4 py-2 font-medium text-gray-500 text-xs">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-50">
                        <td className="px-4 py-2.5 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-2.5">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            item.grade === 'A' ? 'bg-green-50 text-green-700' : item.grade === 'B' ? 'bg-gray-100 text-gray-700' : 'bg-gray-50 text-gray-500'
                          }`}>{item.grade}</span>
                        </td>
                        <td className="px-4 py-2.5 text-gray-600">{item.quantity}</td>
                        <td className="px-4 py-2.5 text-right font-medium text-gray-900">₹{item.price * item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {order.buyer && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-xs">
                  <div>
                    <span className="text-gray-400">Buyer</span>
                    <p className="font-medium text-gray-900 mt-0.5">{order.buyer.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email</span>
                    <p className="font-medium text-gray-900 mt-0.5">{order.buyer.email}</p>
                  </div>
                  {order.buyer.org && (
                    <div>
                      <span className="text-gray-400">Organization</span>
                      <p className="font-medium text-gray-900 mt-0.5">{order.buyer.org}</p>
                    </div>
                  )}
                  {order.buyer.phone && (
                    <div>
                      <span className="text-gray-400">Phone</span>
                      <p className="font-medium text-gray-900 mt-0.5">{order.buyer.phone}</p>
                    </div>
                  )}
                </div>
              )}

              {order.buyer?.address && (
                <div className="text-xs mb-4">
                  <span className="text-gray-400">Shipping Address</span>
                  <p className="font-medium text-gray-900 mt-0.5">{order.buyer.address}</p>
                </div>
              )}

              {NEXT_STATUS[order.status] && (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => updateOrderStatus(order.id, NEXT_STATUS[order.status])}
                  >
                    Mark as {NEXT_STATUS[order.status]}
                  </Button>
                  {order.status === 'Confirmed' && (
                    <Button
                      variant="ghost"
                      onClick={() => updateOrderStatus(order.id, 'Cancelled')}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
