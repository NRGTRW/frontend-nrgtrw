import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProfileProvider } from "./context/ProfileContext";
import  SWRProvider  from "./context/SWRContext"; // ✅ Import SWR Global Provider


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ProfileProvider> {/* ProfileProvider must wrap AuthProvider */}
        <AuthProvider> {/* Auth context for managing authentication */}
          <CartProvider> {/* Cart context for managing the cart */}
            <WishlistProvider> {/* Wishlist context for managing the wishlist */}
              <SWRProvider> {/* SWR Global Provider for managing SWR */}
                <App />
              </SWRProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ProfileProvider>
    </BrowserRouter>
  </React.StrictMode>
);
