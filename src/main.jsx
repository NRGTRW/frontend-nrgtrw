import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProfileProvider } from "./context/ProfileContext";
import SWRProvider from "./context/SWRContext";
import ScrollRestorationProvider from "./context/ScrollRestorationContext"; 

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollRestorationProvider> 
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
      </ScrollRestorationProvider>
    </BrowserRouter>
  </React.StrictMode>
);
