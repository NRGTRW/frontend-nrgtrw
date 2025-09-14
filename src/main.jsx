import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { WishlistProvider } from "./context/WishlistContext";
import { ThemeProvider } from "./context/ThemeContext";
import SWRProvider from "./context/SWRContext";
import ScrollRestorationProvider from "./context/ScrollRestorationContext";
import TermsAndConditions from "./components/TermsPopup/TermsPopup";
import { ChatProvider } from "./context/ChatContext";
import "./i18n";
import "./Globals/global.css";
import "./Globals/cosmicBackground.css";

// If you have an ApiProvider (for API calls) you can import and include it here as well:
// import { ApiProvider } from "./context/ApiContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollRestorationProvider>
            <SWRProvider>
              <AuthProvider>
                <WishlistProvider>
                  <CartProvider>
                    <ChatProvider>
                      <TermsAndConditions />
                      <App />
                    </ChatProvider>
                  </CartProvider>
                </WishlistProvider>
              </AuthProvider>
            </SWRProvider>
          </ScrollRestorationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
