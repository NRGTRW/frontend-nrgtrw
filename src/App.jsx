import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

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

const routes = [
  { path: "/", component: HomePage },
  { path: "/product/:productId", component: ProductPage },
  { path: "/cart", component: CartPage },
  { path: "/profile", component: ProfilePage },
  { path: "/clothing", component: ClothingPage },
  { path: "/materials", component: MaterialsPage },
  { path: "/inspiration", component: InspirationPage },
  { path: "/login", component: () => <AuthPage type="login" /> },
  { path: "/signup", component: SignUpPage },
  { path: "*", component: NotFoundPage },
];

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Navbar />
        <ScrollToTop />
        <Routes>
          {routes.map((route, index) => (
            <Route
              key={route.path || index}
              path={route.path}
              element={<route.component />}
            />
          ))}
        </Routes>
        <Footer />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
