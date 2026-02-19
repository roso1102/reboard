import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { StoreProvider } from './context/StoreContext'
import PageLoader from './components/PageLoader'
import Landing from './pages/Landing'
import DashboardLayout from './layouts/DashboardLayout'
import InstitutionOverview from './pages/institution/InstitutionOverview'
import TestNewComponent from './pages/institution/TestNewComponent'
import InstitutionInventory from './pages/institution/InstitutionInventory'
import DashboardListings from './pages/institution/DashboardListings'
import InstitutionAnalytics from './pages/institution/InstitutionAnalytics'
import InstitutionSettings from './pages/institution/InstitutionSettings'
import DashboardOrders from './pages/institution/DashboardOrders'
import MarketplaceHome from './pages/marketplace/MarketplaceHome'
import ComponentDetail from './pages/marketplace/ComponentDetail'
import Cart from './pages/marketplace/Cart'
import Checkout from './pages/marketplace/Checkout'

function App() {
  return (
    <StoreProvider>
      <CartProvider>
        <PageLoader>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<InstitutionOverview />} />
              <Route path="test" element={<TestNewComponent />} />
              <Route path="inventory" element={<InstitutionInventory />} />
              <Route path="listings" element={<DashboardListings />} />
              <Route path="orders" element={<DashboardOrders />} />
              <Route path="analytics" element={<InstitutionAnalytics />} />
              <Route path="settings" element={<InstitutionSettings />} />
            </Route>
            <Route path="/marketplace" element={<MarketplaceHome />} />
            <Route path="/marketplace/component/:id" element={<ComponentDetail />} />
            <Route path="/marketplace/cart" element={<Cart />} />
            <Route path="/marketplace/checkout" element={<Checkout />} />
          </Routes>
        </PageLoader>
      </CartProvider>
    </StoreProvider>
  )
}

export default App
