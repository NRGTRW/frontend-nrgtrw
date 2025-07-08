// src/App.jsx
import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  matchPath,
  Navigate,
} from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Globals/Navbar/Navbar";
import Footer from "./Globals/Footer/Footer";
import ScrollToTop from "./Globals/ScrollToTop";
import { useAuth } from "./context/AuthContext";
import { ToastContainer, Slide } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "./Globals/global.css";

import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage/ProductPage";
import CartPage from "./pages/CartPage/CartPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import ClothingPage from "./pages/ClothingPage/ClothingPage"; 
import MaterialsPage from "./pages/MaterialsPage/MaterialsPage";
import InspirationPage from "./pages/InspirationPage/InspirationPage";
import LogInPage from "./pages/AuthPages/LogInPage";
import SignUpPage from "./pages/AuthPages/SignUpPage";
import WishlistPage from "./pages/WishlistPage/WishlistPage";
import ContentBellowNavbar from "./components/ContentBellowNavbar/ContentBellowNavbar";
import ResetPasswordPage from "./pages/AuthPages/ResetPasswordPage";
import VerifyOTPPage from "./pages/AuthPages/VerifyOTPPage";
import AboutUs from "./pages/FooterReferals/AboutUsPage";
import ContactUs from "./pages/FooterReferals/ContactUsPage";
import FAQPage from "./pages/FooterReferals/FAQPage";
import MyOrder from "./pages/FooterReferals/MyOrderPage";
import AdminDashboard from "./admin/AdminDashboard";
import CreateAProductPage from "./admin/CreateAProductPage";
import TermsPage from "./pages/TermsAndConditions/TermsAndConditions";
import NRGLandingPage from "./pages/NRGLandingPage/NRGLandingPage";
import Fitness from "./pages/Fitness/Fitness";

// New Checkout page imports
import CheckoutPage from "./pages/CheckOutPage/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckOutPage/CheckoutSuccessPage";
import CheckoutCancelledPage from "./pages/CheckOutPage/CheckoutCancelledPage";

// ------------------ AdminRoute ------------------
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    if (!loading && user) {
      const userRole = user.role?.trim().toUpperCase();
      setIsAuthorized(["ADMIN", "ROOT_ADMIN"].includes(userRole));
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (isAuthorized === false) return <Navigate to="/" replace />;
  if (isAuthorized) return children;

  return <div>Verifying permissions...</div>;
};

// ------------------ App Component ------------------
const App = () => {
  const location = useLocation();

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
    { path: "/verify-otp", component: VerifyOTPPage },
    { path: "/about-us", component: AboutUs },
    { path: "/contact-us", component: ContactUs },
    { path: "/faqs", component: FAQPage },
    { path: "/my-order", component: MyOrder },
    { path: "/NRGLandingPage", component: NRGLandingPage },
    { path: "/Fitness", component: Fitness },

    
    // Checkout Routes:
    { path: "/checkout", component: CheckoutPage },
    { path: "/checkout-success", component: CheckoutSuccessPage },
    { path: "/checkout-cancelled", component: CheckoutCancelledPage },
    { path: "/terms", component: TermsPage },
  ];

  const isValidRoute = routes.some((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  );

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        transition={Slide}
        style={{
          top: "120px", // Shifts the toasts lower so they appear under the navbar
          zIndex: 9999,
        }}
        toastStyle={{
          background: "#f9f9f9", // Light background for a light theme
          color: "#333", // Dark text for readability
          border: "1px solid #ddd", // Subtle border
          borderRadius: "4px", // Slightly rounded corners
          fontFamily: "Arial, sans-serif",
          fontWeight: "500",
          boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)", // Soft shadow
        }}
      />
      {isValidRoute && <ContentBellowNavbar />}
      {/* Smoother animation on route transitions */}
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Routes location={location} key={location.pathname}>
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
          {/* Redundant Profile route if needed */}
          <Route path="/profile" element={<ProfilePage />} />
          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Navbar />
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route
                    path="create-a-product"
                    element={<CreateAProductPage />}
                  />
                </Routes>
                <Footer />
              </AdminRoute>
            }
          />
          {/* Catch-all for undefined routes */}
          <Route
            path="*"
            element={
              <main>
                <NotFoundPage />
              </main>
            }
          />
        </Routes>
      </motion.div>
    </>
  );
};

export default App;
