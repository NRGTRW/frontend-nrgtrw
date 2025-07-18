import React, { useState, useRef, useEffect } from 'react';
import './OptimizedImage.css';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YwZjBmMCIvPjwvc3ZnPg==',
  loading = 'lazy',
  onLoad,
  onError,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    // Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      {
        rootMargin: '50px 0px',
        threshold: 0.1
      }
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

  const getOptimizedSrc = (originalSrc) => {
    if (!originalSrc) return placeholder;
    
    // If it's already an S3 URL, return as is
    if (originalSrc.includes('s3.eu-central-1.amazonaws.com')) {
      return originalSrc;
    }
    
    // For local images, you could add optimization parameters here
    return originalSrc;
  };

  const imageSrc = hasError ? placeholder : getOptimizedSrc(src);

  return (
    <div 
      ref={imgRef}
      className={`optimized-image-container ${className}`}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {!isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          className="image-placeholder"
          style={{ width, height }}
        />
      )}
      
      {/* Main image */}
      {isInView && (
        <img
          src={imageSrc}
          alt={alt}
          className={`optimized-image ${isLoaded ? 'loaded' : ''}`}
          loading={loading}
          onLoad={handleLoad}
          onError={handleError}
          style={{ width, height }}
          {...props}
        />
      )}
      
      {/* Loading spinner */}
      {!isLoaded && !hasError && isInView && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="image-error">
          <span>⚠️</span>
          <p>Image failed to load</p>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 