import { useEffect } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'

// Layout
import { Navbar } from './components/layout/Nav/Nav.jsx'
import CartDrawer from './components/layout/CartDrawer/CartDrawer.jsx'
import SearchOverlay from './components/layout/searchOverlay/searchOverlay.jsx'
import ProfileDrawer from './components/layout/ProfileDrawer/ProfileDrawer'
import Footer from './components/layout/Footer/Footer.jsx'

// Pages
import HomePage from './home/Home.jsx'
import ShopPage from './pages/ShopPage.jsx'
import About from './pages/AboutPage.jsx'
import Contact from './pages/ContactPage.jsx'
import CartPage from './components/CartPage/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderConfirmPage from './pages/OrderConfirmPage'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ProductDetailPage from './components/products/ProductDetail.jsx'
import NotFoundPage from './pages/NotFoundPage'

// ── Protected route wrapper ──────────────────────────────
function ProtectedRoute({ children }) {
  const user = useAuthStore(state => state.user)
  if (!user) return <Navigate to="/login" />
  return children
}

// ── Main layout — has navbar, drawers, footer ────────────
function MainLayout() {
  return (
    <>
      <Navbar />
      <SearchOverlay />
      <CartDrawer />
      <ProfileDrawer />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/order/:txRef" element={<OrderConfirmPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/checkout" element={
          <ProtectedRoute><CheckoutPage /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><ProfilePage /></ProtectedRoute>
        } />
      </Routes>

      <Footer />
    </>
  )
}

// ── Root app ─────────────────────────────────────────────
export default function App() {
  const setUser = useAuthStore(state => state.setUser)
  const clearUser = useAuthStore(state => state.clearUser)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
      } else {
        clearUser()
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Routes>
      <Route path="/*" element={<MainLayout />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}