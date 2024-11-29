import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/category.css";

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/categories/${slug}`)
      .then((response) => setCategory(response.data))
      .catch((error) => console.error(error));
  }, [slug]);

  if (!category) return <div>Loading...</div>;

  return (
    <div className="category-page">
      <h1>{category.name}</h1>
      <div className="products-grid">
        {category.products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h2>{product.name}</h2>
            <p>${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
