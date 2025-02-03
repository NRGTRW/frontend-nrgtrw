import React from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-xl font-semibold mb-4">Admin Panel</h2>
        <nav>
          <ul>
            <li className="mb-2">
              <Link to="/admin/dashboard" className="hover:text-gray-300">
                🛠 Admin Dashboard
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/products" className="hover:text-gray-300">
                🏷 Manage Products
              </Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/add-product" className="hover:text-gray-300">
                ➕ Add Product
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
