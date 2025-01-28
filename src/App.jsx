import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
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
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";
import WishlistPage from "./pages/WishlistPage";
import ContentBellowNavbar from "./components/ContentBellowNavbar";
import PrivateRoute from "./components/PrivateRoute";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import AboutUs from "./pages/AboutUsPage";
import ContactUs from "./pages/ContactUsPage";
import FAQPage from "./pages/FAQPage";
import MyOrder from "./pages/MyOrderPage";

const App = () => {
  const routes = [
    { path: "/", component: HomePage },
    { path: "/product/:productId", component: ProductPage },
    { path: "/cart", component: CartPage },
    { path: "/clothing", component: ClothingPage },
    { path: "/materials", component: MaterialsPage },
    { path: "/inspiration", component: InspirationPage },
    { path: "/wishlist", component: WishlistPage },
    { path: "/login", component: LogInPage },
    { path: "/signup", component: SignUpPage },
    { path: "/profile", component: ProfilePage },
    { path: "/reset-password/:token", component: ResetPasswordPage },
    {path: "/verify-otp", component: VerifyOTPPage },
    { path: "/about-us", component: AboutUs },
    { path: "/contact-us", component: ContactUs },
    { path: "/faq", component: FAQPage },
    { path: "/my-order", component: MyOrder },
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
                    <Component />
                  {path !== "*" && <Footer />}
                </main>
              }
            />
          ))}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
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
