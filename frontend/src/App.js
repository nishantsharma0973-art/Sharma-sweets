import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import CartDrawer from "@/components/CartDrawer";

import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import About from "@/pages/About";
import Gallery from "@/pages/Gallery";
import Catering from "@/pages/Catering";
import Testimonials from "@/pages/Testimonials";
import Contact from "@/pages/Contact";
import Checkout from "@/pages/Checkout";
import OrderSuccess from "@/pages/OrderSuccess";

function ScrollToTop() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}

function App() {
  return (
    <div className="App bg-cream text-ink">
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <FloatingWhatsApp />
          <Toaster position="top-center" richColors closeButton />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/about" element={<About />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/catering" element={<Catering />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
            </Routes>
          </main>

          <Footer />
          <ScrollToTop />
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;