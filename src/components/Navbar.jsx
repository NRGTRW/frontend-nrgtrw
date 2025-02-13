import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import api from "../services/api";
import defaultProfilePicture from "/default-profile.webp";
import cartImage from "/images/shopping-cart.png";
import heartOutline from "/wishlist-outline.png";
import heartFilled from "/wishlist-filled.png";
import "../assets/styles/navbar.css";
import CartPreview from "./CartPreview";
import HamburgerIcon from "./HamburgerIcon";
import UserRow from "./UserRow";
import LanguageSwitcher from "./LanguageSwitcher"; // Import the language switcher

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

  const isTouchDevice =
    "ontouchstart" in window || navigator.maxTouchPoints > 0;

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

  useEffect(() => {
    if (isTouchDevice && showCartPreview) {
      const handleOutsideTouch = (e) => {
        if (
          cartContainerRef.current &&
          !cartContainerRef.current.contains(e.target)
        ) {
          setShowCartPreview(false);
        }
      };
      document.addEventListener("touchstart", handleOutsideTouch);
      return () =>
        document.removeEventListener("touchstart", handleOutsideTouch);
    }
  }, [isTouchDevice, showCartPreview]);

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

  const handleCartMouseEnter = () => {
    if (!isTouchDevice) {
      setShowCartPreview(true);
    }
  };
  const handleCartMouseLeave = () => {
    if (!isTouchDevice) {
      setShowCartPreview(false);
    }
  };

  const handleCartClick = () => {
    if (isTouchDevice) {
      setShowCartPreview((prev) => !prev);
    }
  };

  return (
    <header className="navbar">
      <div className="top-bar">
        <HamburgerIcon
          isOpen={menuOpen}
          toggleMenu={toggleMenu}
          buttonRef={buttonRef}
        />
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
            onMouseEnter={handleCartMouseEnter}
            onMouseLeave={handleCartMouseLeave}
            onClick={handleCartClick}
            style={{ position: "relative" }}
          >
            <img
              src={cartImage}
              alt={t("navbar.cartAlt", "Shopping Cart")}
              className="cart-icon"
              onClick={() => {
                if (!isTouchDevice) {
                  handleNavigation("/cart");
                }
              }}
              tabIndex={0}
              aria-label={t("navbar.viewCart", "View cart")}
            />
            {getTotalQuantity() > 0 && (
              <div className="cart-bubble-container">
                <span
                  className="cart-bubble"
                  aria-label={`${getTotalQuantity()} ${t("navbar.itemsInCart", "items in cart")}`}
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

        {/* Language switcher added at the bottom of the side menu */}
        <li style={{ paddingTop: "16px" }}>
          <LanguageSwitcher />
        </li>
      </ul>
    </header>
  );
};

export default Navbar;
