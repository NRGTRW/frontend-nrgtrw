import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProfileProvider } from "./context/ProfileContext";
import SWRProvider from "./context/SWRContext"; // SWR Global Provider

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* ProfileProvider now wraps AuthProvider as required */}
      <ProfileProvider>
        <AuthProvider>
          <WishlistProvider>
            <CartProvider>
              <SWRProvider>
                <App />
              </SWRProvider>
            </CartProvider>
          </WishlistProvider>
        </AuthProvider>
      </ProfileProvider>
    </BrowserRouter>
  </React.StrictMode>
);
