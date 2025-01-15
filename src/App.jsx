/* eslint-disable react/jsx-key */
import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ClothingPage from "./pages/ClothingPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import MaterialsPage from "./pages/MaterialsPage";
import InspirationPage from "./pages/InspirationPage";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage"; // Added ProfilePage
import ScrollToTop from "./components/ScrollToTop";
import SignupPage from "./pages/SignUpPage";
import "./assets/styles/global.css";
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  const hideNavbarAndFooter = location.pathname === "/not-found";

  return (
    <>
      {!hideNavbarAndFooter && <Navbar />}
      <ScrollToTop />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clothing" element={<ClothingPage />} />
          <Route path="/product/:productId" element={<ProductPage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<AuthPage type="login" />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!hideNavbarAndFooter && <Footer />}
    </>
  );
};

export default App;
