import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; // Fixed import
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/global.css";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import ClothingPage from "./pages/ClothingPage";
import MaterialsPage from "./pages/MaterialsPage";
import InspirationPage from "./pages/InspirationPage";
import AuthPage from "./pages/AuthPage";
import SignUpPage from "./pages/SignUpPage";
import WishlistPage from "./pages/WishlistPage";
import ContentBellowNavbar from "./components/ContentBellowNavbar";

const App = () => {
  const routes = [
    { path: "/", component: HomePage },
    { path: "/product/:productId", component: ProductPage },
    { path: "/cart", component: CartPage },
    { path: "/profile", component: ProfilePage },
    { path: "/clothing", component: ClothingPage },
    { path: "/materials", component: MaterialsPage },
    { path: "/inspiration", component: InspirationPage },
    { path: "/wishlist", component: WishlistPage },
    { path: "/login", component: () => <AuthPage type="login" /> },
    { path: "/signup", component: SignUpPage },
  ];

  return (
    <AuthProvider>
      <CartProvider>
        <ToastContainer />
        <ContentBellowNavbar />
        <Routes>
          {routes.map(({ path, component: Component }, index) => (
            <Route
              key={path || index}
              path={path}
              element={
                <main>
                  {path !== "*" && <Navbar />}
                  <ScrollToTop />
                  <main style={{ minHeight: "calc(100vh - 120px)" }}>
                    <Component />
                  </main>
                  {path !== "*" && <Footer />}
                </main>
              }
            />
          ))}
          <Route
            path="*"
            element={
              <main>
                <NotFoundPage />
              </main>
            }
          />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
