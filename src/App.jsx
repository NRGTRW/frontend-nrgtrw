import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ClothingPage from "./pages/ClothingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFound from "./pages/NotFound.jsx";
import "./assets/styles/global.css";

const App = () => {
  return (
    <>
      <Routes>
        {/* Render Navbar and Footer for all pages except NotFound */}
        <Route
          path="*"
          element={
            <>
              <main>
                <NotFound />
              </main>
            </>
          }
        />
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
      </Routes>
    </>
  );
};

export default App;
