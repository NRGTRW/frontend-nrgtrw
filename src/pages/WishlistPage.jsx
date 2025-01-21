import React, { useEffect } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../assets/styles/wishlistPage.css";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loadWishlist } = useWishlist();
  const { authToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authToken) {
      navigate("/signup"); // Redirect to signup if not logged in
    } else {
      loadWishlist();
    }
  }, [authToken, navigate, loadWishlist]);

  const handleRemove = (itemId) => {
    removeFromWishlist(itemId);
  };

  return (
    <div className="unique-wishlist-page-container">
      <h2 className="unique-wishlist-header">Your Wishlist</h2>
      <div className="unique-wishlist-grid">
        <AnimatePresence>
          {wishlist.map((item) => (
            <motion.div
              key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
              className="unique-wishlist-item"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="unique-image-container">
                <img
                  src={item.selectedColor}
                  alt={item.name}
                  className="unique-product-image"
                />
              </div>
              <div className="unique-product-info">
                <h3>{item.name}</h3>
                <p>Price: ${item.price.toFixed(2)}</p>
                <p>Size: {item.selectedSize}</p>
              </div>
              <div className="unique-wishlist-actions">
                <button
                  className="unique-wishlist-action-button unique-remove-button"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WishlistPage;

// import React, { useEffect } from "react";
// import { useWishlist } from "../context/WishlistContext";
// import { useCart } from "../context/CartContext";
// import { motion, AnimatePresence } from "framer-motion";
// import "../assets/styles/wishlistPage.css";

// const WishlistPage = () => {
//   const { wishlist, removeFromWishlist, loadWishlist } = useWishlist();
//   const { addToCart } = useCart();

//   useEffect(() => {
//     loadWishlist(); // Ensure this is properly passed from the context
//   }, []);

//   const handleAddToCart = (item) => {
//     addToCart(item);
//     removeFromWishlist(item.id);
//   };

//   return (
//     <div className="unique-wishlist-page-container">
//       <h2 className="unique-wishlist-header">Your Wishlist</h2>
//       <div className="unique-wishlist-grid">
//         <AnimatePresence>
//           {wishlist.map((item) => (
//             <motion.div
//               key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
//               className="unique-wishlist-item"
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: 50 }}
//               transition={{ duration: 0.5 }}
//             >
//               <div className="unique-image-container">
//                 <img
//                   src={item.selectedColor}
//                   alt={item.name}
//                   className="unique-product-image"
//                 />
//               </div>
//               <div className="unique-product-info">
//                 <h3>{item.name}</h3>
//                 <p>Price: ${item.price.toFixed(2)}</p>
//                 <p>Size: {item.selectedSize}</p>
//                 <p>Quantity: {item.quantity}</p>
//               </div>
//               <div className="unique-wishlist-actions">
//                 <button
//                   className="unique-wishlist-action-button"
//                   onClick={() => handleAddToCart(item)}
//                 >
//                   Add to Cart
//                 </button>
//                 <button
//                   className="unique-wishlist-action-button unique-remove-button"
//                   onClick={() => removeFromWishlist(item.id)}
//                 >
//                   Remove
//                 </button>
//               </div>
//             </motion.div>
//           ))}
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default WishlistPage;
