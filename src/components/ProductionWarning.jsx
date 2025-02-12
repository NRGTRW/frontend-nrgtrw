import React, { useState, useRef, useEffect } from 'react';
import '../assets/styles/ProductionWarning.css';

const ProductionWarning = () => {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ top: 120, left: window.innerWidth/2 - 200 });
  const [dragging, setDragging] = useState(false);
  
  // Use a ref to hold the offset between the pointer and the container's top-left.
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // --- Mouse Event Handlers ---
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    // Use the current position state to calculate the offset.
    dragOffsetRef.current = {
      x: e.clientX - position.left,
      y: e.clientY - position.top,
    };
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      top: e.clientY - dragOffsetRef.current.y,
      left: e.clientX - dragOffsetRef.current.x,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // --- Touch Event Handlers ---
  const handleTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);
    const touch = e.touches[0];
    dragOffsetRef.current = {
      x: touch.clientX - position.left,
      y: touch.clientY - position.top,
    };
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    e.preventDefault(); // Prevent scrolling while dragging
    const touch = e.touches[0];
    setPosition({
      top: touch.clientY - dragOffsetRef.current.y,
      left: touch.clientX - dragOffsetRef.current.x,
    });
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  // Attach event listeners while dragging.
  useEffect(() => {
    if (dragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dragging]);

  // Optionally lock document scrolling on mobile when dragging.
  useEffect(() => {
    if (dragging && window.innerWidth <= 600) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [dragging]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="toast-container"
      style={{ top: position.top, left: position.left, position: 'fixed' }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      <button
        className="toast-close"
        onClick={(e) => {
          e.stopPropagation();
          setVisible(false);
        }}
      >
        &times;
      </button>
      <h1 className="toast-heading">⚠️ Important Notice ⚠️</h1>
      <div className="toast-message">
        <top-separation>
        <p>The products are currently:</p>
        <h4>unavailable</h4>
        <p></p>
        </top-separation>
        <h3>
          Any payments made will be considered as donations or shall be returned!
        </h3>
      </div>
    </div>
  );
};

export default ProductionWarning;
