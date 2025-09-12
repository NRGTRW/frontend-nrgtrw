import React from "react";

export default function BackgroundDecor() {
  return (
    <div aria-hidden className="ambient-root -z-10">
      <div className="absolute inset-0 ambient-grid" />
      <div className="absolute inset-0 ambient-beams ambient-animate" />
    </div>
  );
}
