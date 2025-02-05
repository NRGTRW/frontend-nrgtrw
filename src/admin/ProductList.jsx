import React, { useEffect, useState } from "react";
import { fetchAllProducts, deleteProduct } from "../services/productService";
import DeleteModal from "./DeleteModal";
import "../assets/styles/admin.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      await deleteProduct(selectedProduct.id);
      loadProducts();
      setSelectedProduct(null);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-header">
        <h2 className="admin-title">Manage Products</h2>
      </div>
  
      {loading ? (
        <div className="admin-loading"></div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
                <td>
                  <button 
                    className="admin-btn danger"
                    onClick={() => setSelectedProduct(product)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
  
      {selectedProduct && (
        <DeleteModal
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

export default ProductList;