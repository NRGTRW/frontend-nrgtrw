// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

// Lazy load components for better performance
const Navbar = lazy(() => import("./Globals/Navbar/Navbar"));
const Footer = lazy(() => import("./Globals/Footer/Footer"));
const ErrorBoundary = lazy(() => import("./Globals/ErrorBoundary"));
const CosmicBackground = lazy(
  () => import("./components/CosmicBackground/CosmicBackground"),
);
const FeedbackWidget = lazy(
  () => import("./components/FeedbackWidget/FeedbackWidget"),
);

// Lazy load pages
const NRGLandingPage = lazy(
  () => import("./pages/NRGLandingPage/NRGLandingPage"),
);
const Fitness = lazy(() => import("./pages/Fitness/Fitness"));
const ClothingPage = lazy(() => import("./pages/ClothingPage/ClothingPage"));
const ProductPage = lazy(() => import("./pages/ProductPage/ProductPage"));
const CartPage = lazy(() => import("./pages/CartPage/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckOutPage/CheckoutPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage/ProfilePage"));
const WishlistPage = lazy(() => import("./pages/WishlistPage/WishlistPage"));
const LogInPage = lazy(() => import("./pages/AuthPages/LogInPage"));
const SignUpPage = lazy(() => import("./pages/AuthPages/SignUpPage"));
const ResetPasswordPage = lazy(
  () => import("./pages/AuthPages/ResetPasswordPage"),
);
const NotFoundPage = lazy(() => import("./pages/NotFoundPage/NotFoundPage"));
const AdminDashboard = lazy(() => import("./admin/AdminDashboard"));
const FitnessAdmin = lazy(() => import("./admin/FitnessAdmin"));
const FitnessAnalytics = lazy(() => import("./admin/FitnessAnalytics"));
const CreateAProductPage = lazy(() => import("./admin/CreateAProductPage"));
const Tech = lazy(() => import("./pages/Tech/Tech"));
const LibraryPage = lazy(() => import("./pages/Library/LibraryPage"));
const MaterialsPage = lazy(() => import("./pages/MaterialsPage/MaterialsPage"));
const InspirationPage = lazy(
  () => import("./pages/InspirationPage/InspirationPage"),
);
const VisionPage = lazy(() => import("./pages/VisionPage"));
const DesignPage = lazy(() => import("./pages/DesignPage"));
const ClothingDetailsPage = lazy(() => import("./pages/ClothingDetailsPage"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage/ProgramsPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const TermsAndConditions = lazy(
  () => import("./pages/TermsAndConditions/TermsAndConditions"),
);
const AboutUsPage = lazy(() => import("./pages/FooterReferals/AboutUsPage"));
const ContactUsPage = lazy(
  () => import("./pages/FooterReferals/ContactUsPage"),
);
const FAQPage = lazy(() => import("./pages/FooterReferals/FAQPage"));

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <CosmicBackground />
      </Suspense>

      <div className="App">
        <Suspense fallback={<LoadingSpinner />}>
          <Navbar />
        </Suspense>

        <main className="main-content">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<NRGLandingPage />} />
              <Route path="/fitness" element={<Fitness />} />
              <Route path="/clothing" element={<ClothingPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/login" element={<LogInPage />} />
              <Route path="/signup" element={<SignUpPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/fitness" element={<FitnessAdmin />} />
              <Route path="/admin/analytics" element={<FitnessAnalytics />} />
              <Route path="/admin/create-product" element={<CreateAProductPage />} />
              <Route path="/admin/fitness-analytics" element={<FitnessAnalytics />} />
              <Route path="/tech" element={<Tech />} />
              <Route path="/library/*" element={<LibraryPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/inspiration" element={<InspirationPage />} />
              <Route path="/vision" element={<VisionPage />} />
              <Route path="/design" element={<DesignPage />} />
              <Route
                path="/clothing-details"
                element={<ClothingDetailsPage />}
              />
              <Route path="/programs" element={<ProgramsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/contact" element={<ContactUsPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>

        <Suspense fallback={<LoadingSpinner />}>
          <Footer />
        </Suspense>
      </div>

      <Suspense fallback={<LoadingSpinner />}>
        <FeedbackWidget />
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ErrorBoundary>
  );
}

export default App;
