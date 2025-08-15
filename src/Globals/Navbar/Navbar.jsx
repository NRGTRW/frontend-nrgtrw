import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
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
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";

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
  const location = useLocation();

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

  // Detect mobile for admin layout
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Dropdown state for admin options on mobile
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const adminDropdownRef = useRef(null);
  // Separate dropdown state for dashboard menu
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);
  const dashboardDropdownRef = useRef(null);

  // Close admin dropdown on outside click
  useEffect(() => {
    if (!adminDropdownOpen) return;
    function handleClickOutside(e) {
      if (
        adminDropdownRef.current &&
        !adminDropdownRef.current.contains(e.target)
      ) {
        setAdminDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [adminDropdownOpen]);
  // Close dashboard dropdown on outside click
  useEffect(() => {
    if (!dashboardDropdownOpen) return;
    function handleClickOutside(e) {
      if (
        dashboardDropdownRef.current &&
        !dashboardDropdownRef.current.contains(e.target)
      ) {
        setDashboardDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dashboardDropdownOpen]);

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
          className={`logo${isAdmin && isMobile ? ' admin-mobile' : ''}`}
          onClick={() => handleNavigation("/")}
          tabIndex={0}
          aria-label="Navigate to home"
        >
          NRG
        </li>
        {/* Dashboard Navigation Dropdown: Only on /admin/dashboard* and only under the logo, not in the right-container grid */}
        {isAdmin && location.pathname.startsWith('/admin/dashboard') && (
          isMobile ? (
            <div style={{ position: 'absolute', left: '50%', top: 'calc(var(--navbar-height, 60px) + 8px)', transform: 'translateX(-50%)', zIndex: 1002 }} ref={dashboardDropdownRef}>
              <button
                className="dashboard-nav-dropdown-trigger"
                aria-label="Dashboard Navigation"
                onClick={() => setDashboardDropdownOpen((open) => !open)}
                style={{
                  background: 'var(--navbar-accent)',
                  border: 'none',
                  borderRadius: 8,
                  padding: '2px 22px',
                  margin: '18px',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  boxShadow: dashboardDropdownOpen ? '0 4px 12px rgba(230,184,0,0.18)' : 'none',
                  transition: 'box-shadow 0.2s',
                  zIndex: 1001
                }}
              >
                Dashboard Menu
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 12, transition: 'transform 0.3s', transform: dashboardDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {dashboardDropdownOpen && (
                <div
                  className="dashboard-nav-dropdown-anim-wrapper"
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    minWidth: 220,
                    zIndex: 1002,
                    pointerEvents: dashboardDropdownOpen ? 'auto' : 'none',
                  }}
                >
                  <div
                    className={`dashboard-nav-dropdown-menu${dashboardDropdownOpen ? ' open' : ''}`}
                    style={{
                      background: 'var(--navbar-bg)',
                      border: '1px solid var(--navbar-accent)',
                      borderRadius: 8,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                      padding: '8px 0',
                      opacity: dashboardDropdownOpen ? 1 : 0,
                      transform: dashboardDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                      transition: 'opacity 0.25s, transform 0.25s',
                    }}
                  >
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'users' } }); setDashboardDropdownOpen(false); }}>
                      👥 User Management
                    </button>
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'waitlist' } }); setDashboardDropdownOpen(false); }}>
                      📋 Waitlist Management
                    </button>
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'analytics' } }); setDashboardDropdownOpen(false); }}>
                      📊 Analytics
                    </button>
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'products' } }); setDashboardDropdownOpen(false); }}>
                      🛍️ Product Management
                    </button>
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'orders' } }); setDashboardDropdownOpen(false); }}>
                      🛒 Order Management
                    </button>
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'system' } }); setDashboardDropdownOpen(false); }}>
                      ⚙️ System Health
                    </button>
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'activity' } }); setDashboardDropdownOpen(false); }}>
                      📝 Activity Logs
                    </button>
                    <button className={`dashboard-nav-dropdown-item`} style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', width: '100%', background: 'none', border: 'none', color: 'var(--navbar-text)', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }} onClick={() => { navigate('/admin/dashboard', { state: { dashboardTab: 'feedback' } }); setDashboardDropdownOpen(false); }}>
                      💬 Feedback
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', position: 'absolute', left: '50%', top: 'calc(var(--navbar-height, 60px) + 8px)', transform: 'translateX(-50%)', zIndex: 1002 }}>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'users' } })}>👥 User Management</button>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'waitlist' } })}>📋 Waitlist Management</button>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'analytics' } })}>📊 Analytics</button>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'products' } })}>🛍️ Product Management</button>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'orders' } })}>🛒 Order Management</button>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'system' } })}>⚙️ System Health</button>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'activity' } })}>📝 Activity Logs</button>
              <button className="dashboard-nav-btn" onClick={() => navigate('/admin/dashboard', { state: { dashboardTab: 'feedback' } })}>💬 Feedback</button>
            </div>
          )
        )}
        <div className={`right-container${isAdmin && isMobile ? ' admin-mobile' : ''}`}>
          {/* Only one fragment wrapping all children */}
          <>
            {/* Admin Add-ons Dropdown: Always visible for admins on mobile */}
            {isAdmin && isMobile && (
              <div style={{ position: 'relative' }} ref={adminDropdownRef}>
                <button
                  className="admin-dropdown-trigger"
                  aria-label="Admin Options"
                  onClick={() => setAdminDropdownOpen((open) => !open)}
                  style={{
                    background: 'var(--navbar-accent)',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8,
                    cursor: 'pointer',
                    boxShadow: adminDropdownOpen ? '0 4px 12px rgba(230,184,0,0.18)' : 'none',
                    transition: 'box-shadow 0.2s',
                    zIndex: 1001
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'transform 0.3s', transform: adminDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}><circle cx="12" cy="12" r="10"/><polyline points="8 10 12 14 16 10"/></svg>
                </button>
                {adminDropdownOpen && (
                  <div
                    className="admin-dropdown-anim-wrapper"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      right: 0,
                      minWidth: 180,
                      zIndex: 1002,
                      pointerEvents: adminDropdownOpen ? 'auto' : 'none',
                    }}
                  >
                    <div
                      className={`admin-dropdown-menu${adminDropdownOpen ? ' open' : ''}`}
                      style={{
                        background: 'var(--navbar-bg)',
                        border: '1px solid var(--navbar-accent)',
                        borderRadius: 8,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                        padding: '8px 0',
                        opacity: adminDropdownOpen ? 1 : 0,
                        transform: adminDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
                        transition: 'opacity 0.25s, transform 0.25s',
                      }}
                    >
                      <Link to="/admin/dashboard" className="admin-dropdown-item" style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', color: 'var(--navbar-text)', textDecoration: 'none', fontWeight: 600 }} onClick={() => setAdminDropdownOpen(false)}>
                        <svg width="18" height="18" fill="currentColor" style={{ marginRight: 8 }} viewBox="0 0 24 24"><path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z"/></svg>
                        Dashboard
                      </Link>
                      <Link to="/admin/create-product" className="admin-dropdown-item" style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', color: 'var(--navbar-text)', textDecoration: 'none', fontWeight: 600 }} onClick={() => setAdminDropdownOpen(false)}>
                        <svg width="18" height="18" fill="currentColor" style={{ marginRight: 8 }} viewBox="0 0 24 24"><path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"/></svg>
                        Create Product
                      </Link>
                      <Link to="/admin/fitness" className="admin-dropdown-item" style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', color: 'var(--navbar-text)', textDecoration: 'none', fontWeight: 600 }} onClick={() => setAdminDropdownOpen(false)}>
                        <svg width="18" height="18" fill="currentColor" style={{ marginRight: 8 }} viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/></svg>
                        Fitness Programs
                      </Link>
                      <Link to="/admin/fitness-analytics" className="admin-dropdown-item" style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', color: 'var(--navbar-text)', textDecoration: 'none', fontWeight: 600 }} onClick={() => setAdminDropdownOpen(false)}>
                        <svg width="18" height="18" fill="currentColor" style={{ marginRight: 8 }} viewBox="0 0 24 24"><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
                        Analytics
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
            {/* Admin Add-ons Inline Buttons: Always visible for admins on desktop */}
            {isAdmin && !isMobile && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
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
              </div>
          )}
          <div className="wishlist-container" style={{ position: "relative" }}>
            <img
              src={wishlistCount > 0 ? heartFilled : heartOutline}
              alt="Wishlist"
              className="wishlist-icon"
              style={{ filter: 'invert(var(--navbar-icon-invert, 0))' }}
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
              style={{ filter: 'invert(var(--navbar-icon-invert, 0))' }}
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
            <ThemeToggle />
          <UserRow user={profile} profilePicture={profilePicture} defaultProfilePicture={defaultProfilePicture} />
          </>
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
            <li onClick={() => handleNavigation("/")}>Home</li>
            <li onClick={() => handleNavigation("/clothing")}>Clothing</li>
            <li onClick={() => handleNavigation("/materials")}>Materials</li>
            <li onClick={() => handleNavigation("/inspiration")}>Inspiration</li>
          </ul>
        </div>

        {/* Services Section */}
        <div className="menu-section">
          <div className="menu-section-title">Services</div>
          <li onClick={() => handleNavigation("/")} className="service-link">All Services</li>
          <li onClick={() => handleNavigation("/fitness")} className="service-link">Fitness</li>
          <li onClick={() => handleNavigation("/tech")} className="service-link">Tech</li>
          <li onClick={() => handleNavigation("/clothing")} className="service-link">Clothing</li>
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
