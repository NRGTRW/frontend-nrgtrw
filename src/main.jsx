import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";
import SWRProvider from "./context/SWRContext";
import ScrollRestorationProvider from "./context/ScrollRestorationContext";
import TermsAndConditions from "./components/TermsPopup/TermsPopup";
import "./i18n";


// If you have an ApiProvider (for API calls) you can import and include it here as well:
// import { ApiProvider } from "./context/ApiContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <ScrollRestorationProvider>
          <ProfileProvider>
            <AuthProvider>
              <WishlistProvider>
                <CartProvider>
                  <SWRProvider>
                    <TermsAndConditions />
                    <App />
                  </SWRProvider>
                </CartProvider>
              </WishlistProvider>
            </AuthProvider>
          </ProfileProvider>
        </ScrollRestorationProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
