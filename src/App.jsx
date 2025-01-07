/* eslint-disable react/jsx-key */
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
import "./assets/styles/global.css";
import AOS from "aos";
import "aos/dist/aos.css";

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
    });
  }, []);

  return (
    <>
      <Navbar />
      <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/clothing" element={<ClothingPage />} />
          <Route path="/product/:productId" element={[<ScrollToTop />, <ProductPage />]} />
          <Route path="/materials" element={[<ScrollToTop />, <MaterialsPage />]} />
          <Route path="/inspiration" element={[<ScrollToTop />, <InspirationPage />]} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<AuthPage type="login" />} />
<Route path="/signup" element={<AuthPage type="signup" />} />

          <Route path="/profile" element={<ProfilePage />} /> {/* Added Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
