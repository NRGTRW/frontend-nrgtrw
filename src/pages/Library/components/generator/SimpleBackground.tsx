import React from 'react';

export default function SimpleBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gray-50">
      {/* Very subtle pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
    </div>
  );
}
