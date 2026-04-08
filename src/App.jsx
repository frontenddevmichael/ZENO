import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/layout/Nav/Nav.jsx";
import CartDrawer from "./components/layout/CartDrawer/CartDrawer.jsx";
import CartPage from "./components/CartPage/CartPage.jsx";
import SearchOverlay from "./components/layout/searchOverlay/searchOverlay.jsx";
import HomePage from "./home/Home.jsx";
import Contact from "./pages/ContactPage.jsx";
import About from "./pages/AboutPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import Footer from "./components/layout/Footer/Footer.jsx";

// Import the ASSEMBLY page, not just the gallery
import ProductDetailPage from "../src/components/products/ProductDetail.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <SearchOverlay />
      <CartDrawer />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/shop/:slug" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/404" element={<div>404 - Product Not Found</div>} />
      </Routes>
      
      <Footer />
    </>
  );
}