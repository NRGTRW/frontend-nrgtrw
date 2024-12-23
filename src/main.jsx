import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import ClothingPage from "./pages/ClothingPage";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <App>
              <HomePage />
            </App>
          }
        />
        <Route
          path="/sales"
          element={
            <App>
              <ClothingPage />
            </App>
          }
        />
        <Route
          path="*"
          element={
            <App>
              <NotFound />
            </App>
          }
        />
        <Route path="/404" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
