import { Navbar } from "./components/layout/Nav/Nav.jsx"
import CartDrawer from "./components/layout/CartDrawer/CartDrawer.jsx";
import  SearchOverlay  from "./components/layout/searchOverlay/searchOverlay.jsx";
import Hero from "./components/Hero/Hero.jsx";
import { Routes, Route } from "react-router-dom";
import Footer from "./components/layout/Footer/Footer.jsx"
import WhatsAppButton from "./components/layout/whatsappButton/whatsappButton.jsx";

export default function App() {



  return (
    <>
      <Navbar />
      <SearchOverlay />
      <CartDrawer />
      <Hero />
      <Hero />
      <WhatsAppButton />
      <Footer />
    </>
  )
}
