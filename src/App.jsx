import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider, useCart } from "./context/CartContext";

import Navbar        from "./components/Navbar/Navbar";
import Hero          from "./components/Hero/Hero";
import Products      from "./components/Products/Products";
import TopProducts   from "./components/Top Products/TopProducts";
import Banner        from "./components/Banner/Banner";
import Subscribe     from "./components/Subscribe/Subscribe";
import Testimonials  from "./components/Testimonials/Testimonials";
import Footer        from "./components/Footer/Footer";
import AuthRequiredModal from "./components/AuthRequiredModal";
import CheckoutModal from "./components/Checkout/CheckoutModal";
import CartDrawer    from "./components/Cart/CartDrawer";

import Landing        from "./pages/Landing";
import Login          from "./pages/Login";
import Register       from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword  from "./pages/ResetPassword";
import Orders         from "./pages/Orders";
import About          from "./pages/About";
import Contact        from "./pages/Contact";
import PrivacyPolicy  from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound       from "./pages/NotFound";
import Account        from "./pages/Account";

/* ─────────────────────────────────────────
   Shop layout
───────────────────────────────────────── */
const ShopLayout = () => {
  const { isLoggedIn } = useAuth();
  const { items: cartItems } = useCart();

  const [checkoutOpen, setCheckoutOpen]   = React.useState(false);
  const [checkoutProduct, setCheckoutProduct] = React.useState(null);
  const [cartOpen, setCartOpen]           = React.useState(false);
  const [authModal, setAuthModal]         = React.useState(false);

  // "Buy Now" — opens checkout pre-filled with one product
  const handleOrderPopup = (product = null) => {
    if (!isLoggedIn) { setAuthModal(true); return; }
    setCheckoutProduct(product);
    setCheckoutOpen(true);
  };

  // Cart icon click — open drawer
  const handleCartOpen = () => setCartOpen(true);

  // Checkout from cart drawer — opens checkout with cart contents
  const handleCheckoutFromCart = () => {
    setCheckoutProduct(null); // null = use global cart
    setCheckoutOpen(true);
  };

  React.useEffect(() => {
    AOS.init({ offset: 100, duration: 800, easing: "ease-in-out", delay: 100 });
    AOS.refresh();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar handleOrderPopup={handleOrderPopup} onCartOpen={handleCartOpen} />
      <div id="home">
        <Hero
          handleOrderPopup={handleOrderPopup}
          onShopNow={() => {
            const el = document.getElementById("products");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
        />
      </div>
      <div id="products"><Products handleOrderPopup={handleOrderPopup} /></div>
      <div id="top-rated"><TopProducts handleOrderPopup={handleOrderPopup} /></div>
      <div id="interior"><Banner /></div>
      <Subscribe />
      <div id="testimonials"><Testimonials /></div>
      <Footer />

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckoutFromCart}
        onAuthRequired={() => setAuthModal(true)}
      />

      {/* Checkout modal */}
      {checkoutOpen && (
        <CheckoutModal
          product={checkoutProduct}
          onClose={() => { setCheckoutOpen(false); setCheckoutProduct(null); }}
        />
      )}

      {/* Auth required modal */}
      {authModal && <AuthRequiredModal onClose={() => setAuthModal(false)} />}
    </div>
  );
};

/* ─────────────────────────────────────────
   Root app
───────────────────────────────────────── */
const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary
            flex items-center justify-center animate-pulse">
            <span className="text-white text-xl font-bold">M</span>
          </div>
          <div className="flex gap-1">
            {[0,1,2].map((i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/"                element={<Landing />} />
      <Route path="/shop"            element={<ShopLayout />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />
      <Route path="/orders"          element={<Orders />} />
      <Route path="/about"           element={<About />} />
      <Route path="/contact"         element={<Contact />} />
      <Route path="/privacy"         element={<PrivacyPolicy />} />
      <Route path="/terms"           element={<TermsOfService />} />
      <Route path="/account"         element={<Account />} />
      <Route path="*"                element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  </AuthProvider>
);

export default App;
