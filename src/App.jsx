import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import PageLoader from './components/PageLoader'
import Landing from './pages/Landing'
import DashboardLayout from './layouts/DashboardLayout'
import InstitutionOverview from './pages/institution/InstitutionOverview'
import TestNewComponent from './pages/institution/TestNewComponent'
import InstitutionInventory from './pages/institution/InstitutionInventory'
import DashboardListings from './pages/institution/DashboardListings'
import InstitutionAnalytics from './pages/institution/InstitutionAnalytics'
import InstitutionSettings from './pages/institution/InstitutionSettings'
import MarketplaceHome from './pages/marketplace/MarketplaceHome'
import ComponentDetail from './pages/marketplace/ComponentDetail'
import Cart from './pages/marketplace/Cart'

function App() {
  return (
    <CartProvider>
      <PageLoader>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<InstitutionOverview />} />
            <Route path="test" element={<TestNewComponent />} />
            <Route path="inventory" element={<InstitutionInventory />} />
            <Route path="listings" element={<DashboardListings />} />
            <Route path="analytics" element={<InstitutionAnalytics />} />
            <Route path="settings" element={<InstitutionSettings />} />
          </Route>
          <Route path="/marketplace" element={<MarketplaceHome />} />
          <Route path="/marketplace/component/:id" element={<ComponentDetail />} />
          <Route path="/marketplace/cart" element={<Cart />} />
        </Routes>
      </PageLoader>
    </CartProvider>
  )
}

export default App
