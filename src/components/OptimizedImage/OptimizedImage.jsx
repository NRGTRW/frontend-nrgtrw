import React, { useState, useRef, useEffect } from "react";
import "./OptimizedImage.css";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  placeholder = null,
  onLoad = null,
  onError = null,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.1,
      },
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div className={`optimized-image-error ${className}`} {...props}>
        <div className="error-placeholder">
          <span>⚠️</span>
          <p>Image failed to load</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`optimized-image-container ${className}`}
      ref={imgRef}
      {...props}
    >
      {/* Placeholder/Blur */}
      {placeholder && !isLoaded && (
        <div
          className="image-placeholder"
          style={{ backgroundImage: `url(${placeholder})` }}
        />
      )}

      {/* Main Image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`optimized-image ${isLoaded ? "loaded" : ""}`}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
      )}

      {/* Loading Spinner */}
      {!isLoaded && !placeholder && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
