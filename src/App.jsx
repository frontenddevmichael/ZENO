import { Routes, Route } from "react-router-dom";
// Ensure your import paths match your actual folder structure!
import { Navbar } from "./components/layout/Nav/Nav.jsx";
import CartDrawer from "./components/layout/CartDrawer/CartDrawer.jsx";
import SearchOverlay from "./components/layout/searchOverlay/searchOverlay.jsx";
import HomePage from "./home/Home.jsx";
import Contact from "./pages/ContactPage.jsx";
import About from "./pages/AboutPage.jsx";
import ProductPage from "./pages/ProductDetails.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import Footer from "./components/layout/Footer/Footer.jsx"; // Fixed path

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
          <Route path="/shop/:slug" element={<ProductPage />} />
      </Routes>

      <Footer />
    </>
  );
}