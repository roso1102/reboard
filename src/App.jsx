import { Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import PageLoader from './components/PageLoader'
import Landing from './pages/Landing'
import InstitutionLayout from './layouts/InstitutionLayout'
import InstitutionOverview from './pages/institution/InstitutionOverview'
import TestNewComponent from './pages/institution/TestNewComponent'
import InstitutionInventory from './pages/institution/InstitutionInventory'
import InstitutionAnalytics from './pages/institution/InstitutionAnalytics'
import InstitutionSettings from './pages/institution/InstitutionSettings'
import MarketplaceHome from './pages/marketplace/MarketplaceHome'
import ComponentDetail from './pages/marketplace/ComponentDetail'
import Cart from './pages/marketplace/Cart'
import SellerLayout from './layouts/SellerLayout'
import SellerListings from './pages/marketplace/seller/SellerListings'
import SellerSales from './pages/marketplace/seller/SellerSales'
import SellerInventory from './pages/marketplace/seller/SellerInventory'
import SellerAnalytics from './pages/marketplace/seller/SellerAnalytics'

function App() {
  return (
    <CartProvider>
      <PageLoader>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/institution" element={<InstitutionLayout />}>
            <Route index element={<InstitutionOverview />} />
            <Route path="test" element={<TestNewComponent />} />
            <Route path="inventory" element={<InstitutionInventory />} />
            <Route path="analytics" element={<InstitutionAnalytics />} />
            <Route path="settings" element={<InstitutionSettings />} />
          </Route>
          <Route path="/marketplace" element={<MarketplaceHome />} />
          <Route path="/marketplace/component/:id" element={<ComponentDetail />} />
          <Route path="/marketplace/cart" element={<Cart />} />
          <Route path="/marketplace/seller" element={<SellerLayout />}>
            <Route index element={<SellerListings />} />
            <Route path="sales" element={<SellerSales />} />
            <Route path="inventory" element={<SellerInventory />} />
            <Route path="analytics" element={<SellerAnalytics />} />
          </Route>
        </Routes>
      </PageLoader>
    </CartProvider>
  )
}

export default App
