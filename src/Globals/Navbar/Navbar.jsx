import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import useSWR from "swr";
import api from "../../services/api";
import { useTranslation } from "react-i18next";
import defaultProfilePicture from "/default-profile.webp";
import cartImage from "/images/shopping-cart.png";
import heartOutline from "/wishlist-outline.png";
import heartFilled from "/wishlist-filled.png";
import "./navbar.css";
import CartPreview from "../../pages/CartPage/CartPreview";
import HamburgerIcon from "../../components/HamburgerIcon/HamburgerIcon";
import UserRow from "./UserRow";
import LanguageSwitcher from "./LanguageSwitcher";
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
  const { t } = useTranslation();

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

  return (
    <header className="navbar">
      <div className="top-bar">
        <div className="left-section" style={{ display: "flex", alignItems: "center" }}>
          <HamburgerIcon
            isOpen={menuOpen}
            toggleMenu={toggleMenu}
            buttonRef={buttonRef}
          />
          {/* Place the LanguageSwitcher dropdown next to the hamburger */}
          <LanguageSwitcher />
        </div>
        <li
          className="logo"
          onClick={() => handleNavigation("/")}
          tabIndex={0}
          aria-label={t("navbar.home", "Navigate to home")}
        >
          NRG
        </li>
        <div className="right-container">
          {isAdmin && (
            <>
              <Link
                to="/clothing"
                className="admin-icon"
                aria-label={t("navbar.adminDashboard", "Admin Dashboard")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 13h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1zm-1 7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v4zm10 0a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v7zm1-10h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1z" />
                </svg>
              </Link>
              <Link
                to="/admin/create-a-product"
                className="admin-icon"
                aria-label={t("navbar.addProduct", "Add Product")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z" />
                </svg>
              </Link>
              <Link
                to="/admin/dashboard"
                className="admin-icon"
                aria-label={t("navbar.manageProducts", "Manage Products")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 22h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2zm3-6h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm0-5h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2zm0-5h8a1 1 0 0 1 0 2H8a1 1 0 0 1 0-2z" />
                </svg>
              </Link>
            </>
          )}

          <div className="wishlist-container" style={{ position: "relative" }}>
            <img
              src={wishlistCount > 0 ? heartFilled : heartOutline}
              alt={t("navbar.wishlistAlt", "Wishlist")}
              className="wishlist-icon"
              onClick={() =>
                handleAuthenticatedNavigation("/wishlist", "/login")
              }
              tabIndex={0}
              aria-label={t("navbar.navigateToWishlist", "Navigate to wishlist")}
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
              alt={t("navbar.cartAlt", "Shopping Cart")}
              className="cart-icon"
              onClick={() => navigate("/cart")}
              tabIndex={0}
              aria-label={t("navbar.viewCart", "View cart")}
            />
            {getTotalQuantity() > 0 && (
              <div className="cart-bubble-container">
                <span
                  className="cart-bubble"
                  aria-label={`${getTotalQuantity()} ${t(
                    "navbar.itemsInCart",
                    "items in cart"
                  )}`}
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
        <li onClick={() => handleNavigation("/")}>
          {t("navbar.menu.home", "HOME")}
        </li>
        <li onClick={() => handleNavigation("/clothing")}>
          {t("navbar.menu.clothing", "CLOTHING")}
        </li>
        <li onClick={() => handleNavigation("/materials")}>
          {t("navbar.menu.materials", "MATERIALS")}
        </li>
        <li onClick={() => handleNavigation("/inspiration")}>
          {t("navbar.menu.inspiration", "INSPIRATION")}
        </li>
        <li onClick={() => handleNavigation("/terms")}>
          {t("navbar.menu.termsAndConditions", "TERMS AND CONDITIONS")}
        </li>
        {/* <li onClick={() => handleNavigation("/NRGLandingPage")}>
          {t("navbar.menu.services", "SERVICES")}
        </li> */}
      </ul>
    </header>
  );
};

export default Navbar;
