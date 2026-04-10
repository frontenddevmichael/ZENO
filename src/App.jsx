import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './store/authStore'
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Nav/Nav.jsx";
import CartDrawer from "./components/layout/CartDrawer/CartDrawer.jsx";
import CartPage from "./components/CartPage/CartPage.jsx";
import SearchOverlay from "./components/layout/searchOverlay/searchOverlay.jsx";
import HomePage from "./home/Home.jsx";
import Contact from "./pages/ContactPage.jsx";
import About from "./pages/AboutPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import Footer from "./components/layout/Footer/Footer.jsx";
import OrderConfirmPage from './pages/OrderConfirmPage'
import LoginPage from "./pages/LoginPage.jsx";
import SignupPage from "./pages/SignupPage.jsx";
import ProductDetailPage from "../src/components/products/ProductDetail.jsx";
import ProfileDrawer from './components/layout/ProfileDrawer/ProfileDrawer'
import ProfilePage from './pages/ProfilePage/ProfilePage'



function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user)
  if (!user) {
    return <Navigate to="/login" />
  } else {
    return children
  }
}

export async function handleSignOut() {
  await supabase.auth.signOut()
}

export default function App() {
  const setUser = useAuthStore((state) => state.setUser)
  const clearUser = useAuthStore((state) => state.clearUser)

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
    <>
      <Navbar />
      <SearchOverlay />
      <CartDrawer />
      <ProfileDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<ProtectedRoute>
          <CheckoutPage />
        </ProtectedRoute>} />

        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/order/:txRef" element={<OrderConfirmPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/404" element={<div>404 - Product Not Found</div>} />
      </Routes>

      <Footer />
    </>
  );
}