import React, { useState, useRef, useEffect } from 'react';
import '../assets/styles/ProductionWarning.css';

const ProductionWarning = () => {
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({ top: 120, left: 20 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Mouse event handlers
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    setPosition({
      top: e.clientY - dragOffset.y,
      left: e.clientX - dragOffset.x,
    });
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e) => {
    e.preventDefault(false);
    setDragging(true);
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  const handleTouchMove = (e) => {
    if (!dragging) return;
    // Prevent scrolling during drag
    e.preventDefault();
    const touch = e.touches[0];
    setPosition({
      top: touch.clientY - dragOffset.y,
      left: touch.clientX - dragOffset.x,
    });
  };

  const handleTouchEnd = () => {
    if (dragging) {
      setDragging(false);
    }
  };

  // Attach event listeners when dragging
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
  }, [dragging, dragOffset]);

  // When dragging on mobile, lock document scroll.
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
      style={{ top: position.top, left: position.left }}
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
      <h4 className="toast-heading">⚠️ Important Notice</h4>
      <p className="toast-message">
      We’re on an exciting journey to bring our vision to life, and you’re invited to be part of it. Our products are currently in the creation phase. Any contributions made at this stage will help us move faster and turn our designs into reality. While these payments won’t guarantee an immediate return, your support fuels our progress and brings us one step closer to launching something truly special.
      </p>
    </div>
  );
};

export default ProductionWarning;
