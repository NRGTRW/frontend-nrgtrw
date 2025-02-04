import React, { useEffect, useState } from "react";
import { fetchAllProducts, deleteProduct } from "../services/productService";
import DeleteModal from "./DeleteModal";
import "../assets/styles/ProductList.css";

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
    <div className="product-list">
      <h2>Manage Products</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <button onClick={() => setSelectedProduct(product)}>❌ Delete</button>
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
