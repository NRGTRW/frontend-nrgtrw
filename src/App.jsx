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
import CosmicBackground from './components/CosmicBackground/CosmicBackground';
import FeedbackWidget from './components/FeedbackWidget/FeedbackWidget';
// import TestimonialsSection from './components/Testimonials/TestimonialsSection';
import SEOHead from './components/SEO/SEOHead';

// Page-specific cosmic palettes
const cosmicPalettes = {
  landing: {
    gradient: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    nebula1: 'rgba(245, 197, 24, 0.22)', // gold
    nebula2: 'rgba(120, 119, 198, 0.18)', // purple
    star: '#fffbe6',
    accent: '#ffe067',
    planet: '#ffe067',
    crown: '#f5c518',
  },
  fitness: {
    gradient: ['#191919', '#1a1a1a', '#23211a', '#bfa14a'],
    nebula1: 'rgba(245, 197, 24, 0.18)',
    nebula2: 'rgba(191, 161, 74, 0.12)',
    star: '#ffe067',
    accent: '#ffe067',
    planet: '#ffe067',
    crown: '#bfa14a',
  },
  tech: {
    gradient: ['#0a1016', '#101622', '#1a2a3a', '#19fff5'],
    nebula1: 'rgba(30, 180, 255, 0.18)',
    nebula2: 'rgba(25, 255, 245, 0.12)',
    star: '#19fff5',
    accent: '#19fff5',
    planet: '#19fff5',
    crown: '#7eeeff',
  },
  product: {
    gradient: ['#fffbe6', '#e6b800', '#bfa14a', '#23211a'],
    nebula1: 'rgba(230, 184, 0, 0.18)',
    nebula2: 'rgba(191, 161, 74, 0.12)',
    star: '#ffe067',
    accent: '#e6b800',
    planet: '#ffe067',
    crown: '#bfa14a',
  },
  notfound: {
    gradient: ['#23211a', '#1a1a1a', '#333', '#bfa14a'],
    nebula1: 'rgba(255, 100, 200, 0.18)',
    nebula2: 'rgba(100, 200, 255, 0.12)',
    star: '#fff',
    accent: '#ffe067',
    planet: '#fffbe6',
    crown: '#e6b800',
  },
  default: {
    gradient: ['#0a0a0a', '#1a1a2e', '#16213e', '#0f3460', '#533483'],
    nebula1: 'rgba(255, 100, 200, 0.4)',
    nebula2: 'rgba(100, 200, 255, 0.3)',
    star: '#fff',
    accent: '#ffe067',
    planet: '#ffe067',
    crown: '#f5c518',
  },
};

function getCosmicPalette(pathname) {
  if (pathname === '/' || pathname === '/NRGLandingPage') return cosmicPalettes.landing;
  if (pathname.startsWith('/fitness')) return cosmicPalettes.fitness;
  if (pathname.startsWith('/tech')) return cosmicPalettes.tech;
  if (pathname.startsWith('/product')) return cosmicPalettes.product;
  if (pathname.startsWith('/not-found') || pathname === '/404') return cosmicPalettes.notfound;
  if (pathname.startsWith('/profile')) return cosmicPalettes.landing;
  if (pathname.startsWith('/clothing')) return cosmicPalettes.product;
  if (pathname.startsWith('/materials')) return cosmicPalettes.product;
  if (pathname.startsWith('/inspiration')) return cosmicPalettes.landing;
  if (pathname.startsWith('/wishlist')) return cosmicPalettes.product;
  return cosmicPalettes.default;
}
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
  const { selectedRequest, setSelectedRequest } = useChatContext();
  const [sidebarHovered, setSidebarHovered] = useState(false);
  // All translation-related state and modals removed. English only.

  // SEO configuration based on current route
  const getSEOConfig = () => {
    const pathname = location.pathname;
    
    switch (pathname) {
      case '/':
        return {
          title: 'NRG - Premium Fitness & Lifestyle',
          description: 'Transform your lifestyle with premium fitness programs, high-quality clothing, and cutting-edge tech solutions.',
          keywords: 'fitness, lifestyle, clothing, tech, premium, transformation',
          image: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/vision.png'
        };
      case '/fitness':
        return {
          title: 'Fitness Programs',
          description: 'Premium fitness programs designed for maximum results. Transform your body and mind with expert guidance.',
          keywords: 'fitness, workout, training, programs, transformation',
          image: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/Fitness.jpg'
        };
      case '/tech':
        return {
          title: 'Tech Projects',
          description: 'Explore cutting-edge technology projects and innovative solutions.',
          keywords: 'tech, technology, projects, innovation, development',
          image: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/Tech.webp'
        };
      case '/clothing':
        return {
          title: 'Premium Clothing',
          description: 'High-quality, stylish clothing designed for performance and comfort.',
          keywords: 'clothing, fashion, premium, style, quality',
          image: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/Clothing.jpg'
        };
      case '/vision':
        return {
          title: 'Our Vision',
          description: 'Discover the vision behind NRG and our commitment to excellence.',
          keywords: 'vision, mission, excellence, commitment, future',
          image: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/vision.png'
        };
      default:
        return {
          title: 'NRG - Premium Fitness & Lifestyle',
          description: 'Premium fitness programs, high-quality clothing, and cutting-edge tech solutions.',
          keywords: 'fitness, lifestyle, clothing, tech, premium',
          image: 'https://nrgtrw-images.s3.eu-central-1.amazonaws.com/vision.png'
        };
    }
  };

  const seoConfig = getSEOConfig();

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
      <SEOHead {...seoConfig} />
      {(location.pathname === '/tech' || location.pathname === '/NRGLandingPage' || location.pathname === '/' || location.pathname === '/vision') && (
        <CosmicBackground palette={getCosmicPalette(location.pathname)} />
      )}
      <FeedbackWidget />
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
      {/* Testimonials Section - Show on main pages */}
      {/* {(location.pathname === '/' || location.pathname === '/clothing' || location.pathname === '/fitness') && (
        <TestimonialsSection />
      )} */}
    </>
  );
};

export default App;
