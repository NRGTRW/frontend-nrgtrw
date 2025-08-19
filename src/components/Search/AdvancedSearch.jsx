import React, { useState, useEffect, useCallback } from "react";
import { debounce } from "../../utils/performance";
import "./AdvancedSearch.css";

const AdvancedSearch = ({ onSearch, onFilterChange, products = [] }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    size: "",
    color: "",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term, filterOptions) => {
      const results = performSearch(term, filterOptions, products);
      setSearchResults(results);
      onSearch?.(results);
    }, 300),
    [products, onSearch],
  );

  useEffect(() => {
    debouncedSearch(searchTerm, filters);
  }, [searchTerm, filters, debouncedSearch]);

  const performSearch = (term, filterOptions, productList) => {
    let results = [...productList];

    // Text search
    if (term) {
      const searchLower = term.toLowerCase();
      results = results.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower) ||
          product.category?.toLowerCase().includes(searchLower),
      );
    }

    // Category filter
    if (filterOptions.category) {
      results = results.filter(
        (product) => product.category === filterOptions.category,
      );
    }

    // Price range filter
    if (filterOptions.priceRange) {
      const [min, max] = filterOptions.priceRange.split("-").map(Number);
      results = results.filter((product) => {
        const price = product.price || 0;
        return price >= min && (max ? price <= max : true);
      });
    }

    // Size filter
    if (filterOptions.size) {
      results = results.filter((product) =>
        product.sizes?.includes(filterOptions.size),
      );
    }

    // Color filter
    if (filterOptions.color) {
      results = results.filter((product) =>
        product.colors?.some(
          (color) => color.colorName === filterOptions.color,
        ),
      );
    }

    // Sorting
    results.sort((a, b) => {
      let aValue = a[filterOptions.sortBy];
      let bValue = b[filterOptions.sortBy];

      if (filterOptions.sortBy === "price") {
        aValue = aValue || 0;
        bValue = bValue || 0;
      } else {
        aValue = String(aValue || "").toLowerCase();
        bValue = String(bValue || "").toLowerCase();
      }

      if (filterOptions.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return results;
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: "",
      priceRange: "",
      size: "",
      color: "",
      sortBy: "name",
      sortOrder: "asc",
    };
    setFilters(clearedFilters);
    setSearchTerm("");
    onFilterChange?.(clearedFilters);
  };

  const getUniqueCategories = () => {
    return [...new Set(products.map((p) => p.category).filter(Boolean))];
  };

  const getUniqueSizes = () => {
    const allSizes = products.flatMap((p) => p.sizes || []);
    return [...new Set(allSizes)];
  };

  const getUniqueColors = () => {
    const allColors = products.flatMap((p) => p.colors || []);
    return [...new Set(allColors.map((c) => c.colorName))];
  };

  return (
    <div className="advanced-search">
      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-input-container">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-btn">🔍</button>
        </div>

        <button
          className="filter-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Advanced Filters */}
      {isExpanded && (
        <div className="filters-panel">
          <div className="filters-grid">
            {/* Category Filter */}
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="">All Categories</option>
                {getUniqueCategories().map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="filter-group">
              <label>Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) =>
                  handleFilterChange("priceRange", e.target.value)
                }
              >
                <option value="">All Prices</option>
                <option value="0-50">Under $50</option>
                <option value="50-100">$50 - $100</option>
                <option value="100-200">$100 - $200</option>
                <option value="200-">$200+</option>
              </select>
            </div>

            {/* Size Filter */}
            <div className="filter-group">
              <label>Size</label>
              <select
                value={filters.size}
                onChange={(e) => handleFilterChange("size", e.target.value)}
              >
                <option value="">All Sizes</option>
                {getUniqueSizes().map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Color Filter */}
            <div className="filter-group">
              <label>Color</label>
              <select
                value={filters.color}
                onChange={(e) => handleFilterChange("color", e.target.value)}
              >
                <option value="">All Colors</option>
                {getUniqueColors().map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
                <option value="createdAt">Date Added</option>
              </select>
            </div>

            {/* Sort Order */}
            <div className="filter-group">
              <label>Order</label>
              <select
                value={filters.sortOrder}
                onChange={(e) =>
                  handleFilterChange("sortOrder", e.target.value)
                }
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="filter-actions">
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        </div>
      )}

      {/* Search Results Summary */}
      {searchResults.length > 0 && (
        <div className="search-summary">
          <p>
            Found {searchResults.length} product
            {searchResults.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;
