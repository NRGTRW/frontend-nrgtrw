// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import App from "./App";
// import LoginPage from "./pages/LoginPage";
// import CategoryPage from "./pages/CategoryPage";
// import ProductPage from "./pages/ProductPage";
// import ProfilePage from "./pages/ProfilePage";
// import NotFound from "./pages/NotFound";
// import { AppProvider } from "./context/AppContext";

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <AppProvider>
//       <BrowserRouter>
//         <Routes>
//           <Route path="/" element={<App />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/categories/:slug" element={<CategoryPage />} />
//           <Route path="/product/:id" element={<ProductPage />} />
//           <Route path="/profile" element={<ProfilePage />} />
//           <Route path="*" element={<NotFound />} />
//         </Routes>
//       </BrowserRouter>
//     </AppProvider>
//   </React.StrictMode>
// );
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
