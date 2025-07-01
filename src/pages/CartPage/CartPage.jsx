import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import GoBackButton from "../../components/GoBackButton/GoBackButton";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import "./cartPage.css";

const CartPage = () => {
  const { t } = useTranslation();
  const { cart, removeFromCart } = useCart();
  const { addToWishlist } = useWishlist();
  const navigate = useNavigate();

  const [animatingItems, setAnimatingItems] = useState([]);
  const [cancelledItems, setCancelledItems] = useState(new Set());
  const timersRef = useRef({}); 

  const handleRemove = (product) => {
    if (!product.cartItemId || !product.name) {
      toast.error(t("cartPage.removeError", { productName: product.name }));
      return;
    }

    toast.promise(removeFromCart(product.cartItemId), {
      pending: t("cartPage.removePending", { productName: product.name }),
      success: t("cartPage.removeSuccess", { productName: product.name }),
      error: t("cartPage.removeError", { productName: product.name }),
    });
  };

  const handleWishlistToggle = (product) => {
    const productKey = `${product.productId}-${product.selectedSize}-${product.selectedColor}`;

    if (animatingItems.includes(productKey)) {
      cancelWishlistMove(productKey);
    } else {
      toast.info(t("cartPage.wishlistPending", { productName: product.name }));
      setAnimatingItems((prev) => [...prev, productKey]);

      const timer = setTimeout(() => {
        if (!cancelledItems.has(productKey)) {
          addToWishlist({
            id: product.productId,
            name: product.name,
            price: product.price,
            selectedSize: product.selectedSize,
            selectedColor: product.selectedColor,
          })
            .then(() => removeFromCart(product.cartItemId))
            .catch(() => toast.error(t("cartPage.wishlistError", { productName: product.name })));
        }
        setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
        delete timersRef.current[productKey];
      }, 2500);

      timersRef.current[productKey] = timer;
    }
  };

  const cancelWishlistMove = (productKey) => {
    if (timersRef.current[productKey]) {
      clearTimeout(timersRef.current[productKey]);
      delete timersRef.current[productKey];
    }
    setAnimatingItems((prev) => prev.filter((key) => key !== productKey));
    setCancelledItems((prev) => new Set([...prev, productKey]));
    toast.info(t("cartPage.wishlistCancel"));
  };

  useEffect(() => {
    return () => {
      Object.values(timersRef.current).forEach(clearTimeout);
      timersRef.current = {};
    };
  }, []);

  const calculateTotal = () =>
    cart.reduce((total, product) => total + product.quantity * product.price, 0);

  if (!cart.length) {
    return (
      <div className="cart-page empty">
        <h2>{t("cartPage.emptyCartMessage")}</h2>
        <GoBackButton text={t("cartPage.returnButton")} />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h2>{t("cartPage.yourCart")}</h2>
      <div className="cart-items">
        <AnimatePresence>
          {cart.map((product) => {
            const productKey = `${product.productId}-${product.selectedSize}-${product.selectedColor}`;
            const isAnimating = animatingItems.includes(productKey) && !cancelledItems.has(productKey);

            return (
              <motion.div
                key={product.cartItemId}
                className={`cart-item ${isAnimating ? "blurred" : ""}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="cart-item-image"
                  onClick={() => navigate(`/product/${product.productId}`)}
                />
                <div className="cart-item-details">
                  <h3>{product.name || t("cartPage.unnamedProduct")}</h3>
                  <p>{t("cartPage.size")}: {product.selectedSize}</p>
                  <p>{t("cartPage.quantity")}: {product.quantity}</p>
                  <p>{t("cartPage.price")}: ${product.price.toFixed(2)}</p>
                </div>
                <div className="cart-item-actions">
                  <motion.img
                    src={isAnimating ? "/wishlist-filled.png" : "/wishlist-outline.png"}
                    alt="Wishlist"
                    className={`wishlist-icon ${isAnimating ? "wishlisted" : ""}`}
                    onClick={() => handleWishlistToggle(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  />
                  <motion.button
                    className="remove-item-button"
                    onClick={() => handleRemove(product)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {t("cartPage.removeItemButton")}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      <h3>
        {t("cartPage.total")}: ${calculateTotal().toFixed(2)}
      </h3>
      <div className="cart-actions">
        <motion.button
          className="continue-shopping-button"
          onClick={() => navigate("/clothing")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("cartPage.continueShopping")}
        </motion.button>
        <motion.button
          className="checkout-button"
          onClick={() => navigate("/checkout")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t("cartPage.checkout")}
        </motion.button>
      </div>
      <GoBackButton />
    </div>
  );
};

export default CartPage;
