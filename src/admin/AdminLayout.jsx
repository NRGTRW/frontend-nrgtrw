import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/admin.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2 className="admin-brand">Admin Panel</h2>
        <nav>
          <ul className="admin-nav">
            <li>
              <Link to="/admin/dashboard" className="admin-nav-link">
                <i className="admin-icon">📊</i>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="admin-nav-link">
                <i className="admin-icon">🛍️</i>
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/add-product" className="admin-nav-link">
                <i className="admin-icon">✨</i>
                Add Product
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;