import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import SalesPage from "./pages/SalesPage.jsx";
// import CategoryPage from "./pages/CategoryPage";
// import ProductPage from "./pages/ProductPage";
// import ProfilePage from "./pages/ProfilePage";
// import NotFound from "./pages/NotFound";
import HomePage from "./pages/HomePage.jsx";
import "./assets/styles/global.css";

const App = () => {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sales"
            element={<SalesPage />}
          />
          {/* <Route path="/categories/:slug" element={<CategoryPage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export default App;
