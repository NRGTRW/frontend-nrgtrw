import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import useSWR from "swr";
import api from "../../services/api";
import defaultProfilePicture from "/default-profile.webp";
import cartImage from "/images/shopping-cart.png";
import heartOutline from "/wishlist-outline.png";
import heartFilled from "/wishlist-filled.png";
import "./navbar.css";
import CartPreview from "../../pages/CartPage/CartPreview";
import HamburgerIcon from "../../components/HamburgerIcon/HamburgerIcon";
import UserRow from "./UserRow";
import NRGLandingPage from "../../pages/NRGLandingPage/NRGLandingPage";

const getAuthToken = () => localStorage.getItem("authToken");

const fetcher = async (url) => {
  const token = getAuthToken();
  if (!token) {
    console.warn("Skipping profile fetch: No auth token.");
    return null;
  }
  try {
    const response = await api.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error.response?.status);
    if (error.response?.status === 401) {
      console.warn("Token might be expired. Logging out.");
      localStorage.removeItem("authToken");
    }
    return null;
  }
};

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const cartContainerRef = useRef(null);
  const navigate = useNavigate();

  const { getTotalQuantity } = useCart();
  const { wishlist } = useWishlist();
  const wishlistCount = wishlist.length;

  const { data: profile } = useSWR(
    getAuthToken() ? "/profile" : null,
    fetcher,
    { refreshInterval: getAuthToken() ? 3000 : 0 }
  );

  const isAdmin =
    profile?.role === "ADMIN" || profile?.role === "ROOT_ADMIN";

  // Collapsible state for sidebar
  const [clothingDetailsOpen, setClothingDetailsOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e) {
      if (
        menuRef.current?.contains(e.target) ||
        buttonRef.current?.contains(e.target)
      )
        return;
      setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  useEffect(() => {
    // Set a data-theme attribute for future JS-based theme switching if needed
    const match = window.matchMedia('(prefers-color-scheme: dark)');
    const setTheme = () => {
      document.documentElement.setAttribute('data-theme', match.matches ? 'dark' : 'light');
    };
    setTheme();
    match.addEventListener('change', setTheme);
    return () => match.removeEventListener('change', setTheme);
  }, []);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const handleNavigation = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const isLoggedIn = !!profile;
  const handleAuthenticatedNavigation = (protectedPath, fallbackPath) => {
    if (isLoggedIn) handleNavigation(protectedPath);
    else handleNavigation(fallbackPath);
  };

  const profilePicture = profile?.profilePicture
    ? profile.profilePicture.startsWith("http")
      ? profile.profilePicture
      : `${import.meta.env.VITE_IMAGE_BASE_URL}/${profile.profilePicture}`
    : defaultProfilePicture;

  const handleCartMouseEnter = () => setShowCartPreview(true);
  const handleCartMouseLeave = () => setShowCartPreview(false);
  const handleCartClick = () => setShowCartPreview((prev) => !prev);

  return (
    <header className="navbar">
      <div className="top-bar">
        <div className="left-section" style={{ display: "flex", alignItems: "center" }}>
          <HamburgerIcon
            isOpen={menuOpen}
            toggleMenu={toggleMenu}
            buttonRef={buttonRef}
          />
        </div>
        <li
          className="logo"
          onClick={() => handleNavigation("/")}
          tabIndex={0}
          aria-label="Navigate to home"
        >
          NRG
        </li>
        <div className="right-container">
          {/* Admin Dashboard Button - Prominent Position */}
          {isAdmin && (
              <Link
                to="/admin/dashboard"
              className="admin-dashboard-btn"
                aria-label="Admin Dashboard"
              title="Admin Dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 16px',
                backgroundColor: 'var(--navbar-accent)',
                color: '#fff',
                borderRadius: '6px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                marginRight: '12px',
                transition: 'all 0.3s ease',
                border: '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d4a017';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--navbar-accent)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                style={{ marginRight: '6px' }}
                >
                  <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
                </svg>
              Dashboard
              </Link>
          )}
          
          {/* Other Admin Icons */}
          {isAdmin && (
            <>
              <Link
                to="/admin/create-product"
                className="admin-icon"
                aria-label="Create Product"
                title="Create Product"
                style={{ marginRight: '8px' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                </svg>
              </Link>
              <Link
                to="/admin/fitness"
                className="admin-icon"
                aria-label="Fitness Programs"
                title="Fitness Programs"
                style={{ marginRight: '8px' }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z" />
                </svg>
              </Link>
              <Link
                to="/admin/fitness-analytics"
                className="admin-icon"
                aria-label="Fitness Analytics"
                title="Analytics"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z" />
                </svg>
              </Link>
            </>
          )}
          <div className="wishlist-container" style={{ position: "relative" }}>
            <img
              src={wishlistCount > 0 ? heartFilled : heartOutline}
              alt="Wishlist"
              className="wishlist-icon"
              onClick={() => handleAuthenticatedNavigation("/wishlist", "/login")}
              tabIndex={0}
              aria-label="Navigate to wishlist"
            />
            {wishlistCount > 0 && (
              <span className="badge">{wishlistCount}</span>
            )}
          </div>

          <div
            ref={cartContainerRef}
            className="cart-container"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
            onClick={() => setShowCartPreview((prev) => !prev)}
            style={{ position: "relative" }}
          >
            <img
              src={cartImage}
              alt="Shopping Cart"
              className="cart-icon"
              onClick={() => navigate("/cart")}
              tabIndex={0}
              aria-label="View cart"
            />
            {getTotalQuantity() > 0 && (
              <div className="cart-bubble-container">
                <span
                  className="cart-bubble"
                  aria-label={`${getTotalQuantity()} items in cart`}
                >
                  {getTotalQuantity()}
                </span>
              </div>
            )}
            {showCartPreview && <CartPreview />}
          </div>

          <UserRow
            user={profile}
            profilePicture={profilePicture}
            defaultProfilePicture={defaultProfilePicture}
            handleClick={() =>
              handleAuthenticatedNavigation("/profile", "/login")
            }
          />
        </div>
      </div>

      {/* Side menu */}
      <ul ref={menuRef} className={`menu ${menuOpen ? "show" : ""}`}>
        {/* Clothing Section */}
        <div className="menu-section">
          <div className="menu-section-title">Clothing</div>
          <li onClick={() => setClothingDetailsOpen((open) => !open)} style={{ cursor: 'pointer', userSelect: 'none' }}>
            Clothing Details
            <span className={`arrow${clothingDetailsOpen ? ' open' : ''}`}>▼</span>
        </li>
          <ul className={`collapsible${clothingDetailsOpen ? ' open' : ''}`}>
            <li onClick={() => handleNavigation("/clothing-details")}>Home</li>
            <li onClick={() => handleNavigation("/clothing")}>Clothing</li>
            <li onClick={() => handleNavigation("/materials")}>Materials</li>
            <li onClick={() => handleNavigation("/inspiration")}>Inspiration</li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="menu-section">
          <div className="menu-section-title">Services</div>
          <li onClick={() => handleNavigation("/NRGLandingPage")} className="service-link">All Services</li>
          <li onClick={() => handleNavigation("/fitness")} className="service-link">Fitness</li>
          <li onClick={() => handleNavigation("/tech")} className="service-link">Tech</li>
          <li onClick={() => handleNavigation("/clothing")} className="service-link">Clothing</li>
          <li onClick={() => handleNavigation("/designs")} className="service-link">Designs</li>
          <li onClick={() => handleNavigation("/vision")} className="service-link">Vision</li>
        </div>

        {/* Legal Section */}
        <div className="menu-section">
          <div className="menu-section-title">Legal</div>
          <li onClick={() => handleNavigation("/terms")}>Terms and Conditions</li>
        </div>
      </ul>
    </header>
  );
};

export default Navbar;
