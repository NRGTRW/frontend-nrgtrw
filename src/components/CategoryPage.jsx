import React from "react";
import { useParams } from "react-router-dom";

const CategoryPage = () => {
  const { slug } = useParams();

  return (
    <div>
      <h1>{slug.toUpperCase()}</h1>
      <p>Explore our {slug} collection.</p>
    </div>
  );
};

export default CategoryPage;