import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ClothingPage from "./pages/ClothingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProductPage from "./pages/ProductPage.jsx"; // Import ProductPage
import CartPage from "./pages/CartPage.jsx";
import "./assets/styles/global.css";

const App = () => {
  return (
    <>
      <Routes>
        {/* NotFound Route */}
        <Route
          path="*"
          element={
            <main>
              <NotFound />
            </main>
          }
        />

        {/* Home Route */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <HomePage />
              </main>
              <Footer />
            </>
          }
        />

        {/* Clothing Route */}
        <Route
          path="/clothing"
          element={
            <>
              <Navbar />
              <main>
                <ClothingPage />
              </main>
              <Footer />
            </>
          }
        />

        {/* Product Route */}
        <Route
          path="/product/:productId"
          element={
            <>
            <Navbar/>
            <ProductPage />
            <Footer />
            </>
          }
        />
        <Route path="/cart" element={
          <>
          <Navbar/>
          <CartPage />
          <Footer/>
          </>
        }
      />

      </Routes>
    </>
  );
};

export default App;
