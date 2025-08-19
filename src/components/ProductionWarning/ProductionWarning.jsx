import React, { useState, useRef, useEffect } from "react";
import "./ProductionWarning.css";
import { useTranslation } from "react-i18next";

const ProductionWarning = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(true);
  const [position, setPosition] = useState({
    top: 120,
    left: window.innerWidth / 2 - 200,
  });
  const [dragging, setDragging] = useState(false);

  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
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

  const handleMouseUp = () => setDragging(false);

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
    e.preventDefault();
    const touch = e.touches[0];
    setPosition({
      top: touch.clientY - dragOffsetRef.current.y,
      left: touch.clientX - dragOffsetRef.current.x,
    });
  };

  const handleTouchEnd = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [dragging]);

  useEffect(() => {
    if (dragging && window.innerWidth <= 600) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dragging]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="toast-container"
      style={{ top: position.top, left: position.left, position: "fixed" }}
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
      <h1 className="toast-heading">{t("productionWarning.title")}</h1>
      <div className="toast-message">
        <p>{t("productionWarning.currentStatus")}</p>
        <h4>{t("productionWarning.unavailable")}</h4>
        <h3>{t("productionWarning.paymentNotice")}</h3>
      </div>
    </div>
  );
};

export default ProductionWarning;
