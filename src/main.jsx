import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { CartProvider } from "./context/CartContext"; // Import CartProvider
import { AuthProvider } from "./context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CartProvider> {/* Wrapping the app with CartProvider */}
      <BrowserRouter>
      <AuthProvider> {/* Wrapping the app with AuthProvider */}
        <App />
      </AuthProvider>
      </BrowserRouter>
    </CartProvider>
  </React.StrictMode>
);
