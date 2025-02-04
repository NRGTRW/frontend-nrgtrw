import React from "react";
import { Routes, Route, useLocation, matchPath, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import {  useAuth } from "./context/AuthContext";
import { ToastContainer, Slide } from "react-toastify";

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
import ResetPasswordPage from "./pages/ResetPasswordPage";
import VerifyOTPPage from "./pages/VerifyOTPPage";
import AboutUs from "./pages/AboutUsPage";
import ContactUs from "./pages/ContactUsPage";
import FAQPage from "./pages/FAQPage";
import MyOrder from "./pages/MyOrderPage";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import ProductList from "./admin/ProductList";
import ProductForm from "./admin/ProductForm";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (!["admin", "root_admin"].includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

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
            closeOnClick
            pauseOnHover
            draggable
            transition={Slide}
          />
          {isValidRoute && <ContentBellowNavbar />}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
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
                <Route
                  path="/profile"
                  element={
                      <ProfilePage />
                  }
                />
                {/* Admin Routes */}
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminLayout>
                        <Routes>
                          <Route path="dashboard" element={<AdminDashboard />} />
                          <Route path="products" element={<ProductList />} />
                          <Route path="add-product" element={<ProductForm />} />
                        </Routes>
                      </AdminLayout>
                    </AdminRoute>
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
            </motion.div>
          </AnimatePresence>
        </>
  );
};

export default App;
