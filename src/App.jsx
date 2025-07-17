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
import GoBackButton from "./components/GoBackButton/GoBackButton";

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
import FitnessAdmin from "./admin/FitnessAdmin";
import FitnessAnalytics from "./admin/FitnessAnalytics";
import TermsPage from "./pages/TermsAndConditions/TermsAndConditions";
import NRGLandingPage from "./pages/NRGLandingPage/NRGLandingPage";
import Fitness from "./pages/Fitness/Fitness";
import Tech from "./pages/Tech/Tech";
import ClothingDetailsPage from "./pages/ClothingDetailsPage";
import DesignPage from "./pages/DesignPage";
import VisionPage from "./pages/VisionPage";
import ProgramsPage from "./pages/ProgramsPage/ProgramsPage";

// New Checkout page imports
import CheckoutPage from "./pages/CheckOutPage/CheckoutPage";
import CheckoutSuccessPage from "./pages/CheckOutPage/CheckoutSuccessPage";
import CheckoutCancelledPage from "./pages/CheckOutPage/CheckoutCancelledPage";
import FitnessCheckoutPage from "./pages/CheckOutPage/FitnessCheckoutPage";

// ------------------ AdminRoute ------------------
import PropTypes from "prop-types";
import ProductionWarning from "./components/ProductionWarning/ProductionWarning";
import ChatSidebar from './components/Chat/ChatSidebar';
import ChatWindow from './components/Chat/ChatWindow';
import chatStyles from './components/Chat/ChatButton.module.css';
import { useChatContext } from './context/ChatContext';
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

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

// Language code to name mapping (partial, add more as needed)
// const LANGUAGE_NAMES = {
//   en: "English",
//   bg: "Bulgarian",
//   fr: "French",
//   de: "German",
//   es: "Spanish",
//   it: "Italian",
//   ru: "Russian",
//   zh: "Chinese",
//   ja: "Japanese",
//   ko: "Korean",
//   tr: "Turkish",
//   ar: "Arabic",
//   pt: "Portuguese",
//   // ... add more as needed
// };

// function getUserLanguage() {
//   const lang = (navigator.languages && navigator.languages[0]) || navigator.language || 'en';
//   const code = lang.split('-')[0];
//   return code;
// }

// ------------------ App Component ------------------
const App = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [chatOpen, setChatOpen] = useState(false);
  const { selectedRequest } = useChatContext();
  const [sidebarHovered, setSidebarHovered] = useState(false);
  // All translation-related state and modals removed. English only.

  // Clothing-related route matcher
  const clothingRelated = [
    "/clothing",
    "/clothing-details",
    "/materials",
    "/inspiration",
    "/wishlist"
  ];
  // Also match /product/:productId
  const isClothingPage =
    clothingRelated.some((p) => location.pathname.startsWith(p)) ||
    /^\/product\//.test(location.pathname);

  // Restore routes and isValidRoute logic
  const routes = [
    { path: "/", component: NRGLandingPage },
    { path: "/clothing-details", component: ClothingDetailsPage },
    { path: "/product/:productId", component: ProductPage },
    { path: "/cart", component: CartPage },
    { path: "/clothing", component: ClothingPage },
    { path: "/materials", component: MaterialsPage },
    { path: "/inspiration", component: InspirationPage },
    { path: "/designs", component: DesignPage },
    { path: "/vision", component: VisionPage },
    { path: "/programs/:programId", component: ProgramsPage },
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
    { path: "/tech", component: Tech },
    // Checkout Routes:
    { path: "/checkout", component: CheckoutPage },
    { path: "/fitness-checkout", component: FitnessCheckoutPage },
    { path: "/checkout-success", component: CheckoutSuccessPage },
    { path: "/checkout-cancelled", component: CheckoutCancelledPage },
    { path: "/terms", component: TermsPage },
  ];

  const isValidRoute = routes.some((route) =>
    matchPath({ path: route.path, end: true }, location.pathname)
  );

  // Helper to determine if current route is main page
  const isMainPage = location.pathname === "/";

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
      {isClothingPage && <ProductionWarning />}
      {isValidRoute && <ContentBellowNavbar />}
      {user && (
        <>
          <button
            className={chatStyles['chat-fab']}
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path d="M21 12c0 4.418-4.03 8-9 8-1.13 0-2.21-.16-3.19-.46L3 20l.7-3.11C3.25 15.13 3 14.08 3 13c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {chatOpen && (
            <div
              style={{
                position: 'fixed',
                bottom: 32,
                right: 32,
                width: 380,
                maxWidth: '95vw',
                height: 540,
                maxHeight: '80vh',
                background: 'rgba(255,255,255,0.92)',
                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.18)',
                zIndex: 10000,
                display: 'flex',
                borderRadius: 18,
                overflow: 'hidden',
                flexDirection: 'row',
                backdropFilter: 'blur(16px)',
                border: '1.5px solid var(--accent-primary)',
                transition: 'box-shadow 0.2s',
                minWidth: 0,
              }}
            >
              {/* Sidebar */}
              <div
                onMouseEnter={() => setSidebarHovered(true)}
                onMouseLeave={() => setSidebarHovered(false)}
                style={{
                  width: selectedRequest && !sidebarHovered ? 60 : 220,
                  minWidth: selectedRequest && !sidebarHovered ? 60 : 220,
                  maxWidth: selectedRequest && !sidebarHovered ? 60 : 220,
                  height: '100%',
                  overflowY: 'auto',
                  borderRight: '1.5px solid var(--accent-primary)',
                  background: 'rgba(255,255,255,0.7)',
                  flexShrink: 0,
                  transition: 'width 0.3s, min-width 0.3s, max-width 0.3s',
                  display: 'flex',
                }}
              >
                <ChatSidebar onClose={() => setChatOpen(false)} />
              </div>
              {/* Chat Window */}
              <div style={{
                 flex: 1,
                 height: '100%',
                 minWidth: 0,
                 overflowY: 'auto',
                 background: 'rgba(255,255,255,0.85)',
                 display: 'flex',
                 flexDirection: 'column',
                 position: 'relative',
                 left: 0,
              }}>
                <ChatWindow />
              </div>
              {/* Close Button */}
              <button
                onClick={() => setChatOpen(false)}
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  fontSize: 28,
                  background: '#181512',
                  border: 'none',
                  color: 'var(--accent-primary)',
                  cursor: 'pointer',
                  zIndex: 10001,
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'background 0.2s'
                }}
                aria-label="Close chat"
              >
                ×
              </button>
            </div>
          )}
        </>
      )}
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
                  {!isMainPage && <GoBackButton />}
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
                  <Route path="create-product" element={<CreateAProductPage />} />
                  <Route path="fitness" element={<FitnessAdmin />} />
                  <Route path="fitness-analytics" element={<FitnessAnalytics />} />
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
