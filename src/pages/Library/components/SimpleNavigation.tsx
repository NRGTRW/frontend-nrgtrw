import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SimpleNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-[hsl(var(--card))] border-b border-[hsl(var(--border))]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">LP</span>
            </div>
            <span className="text-xl font-bold text-[hsl(var(--fg))]">Landing Page Generator</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/generator"
              className={`text-sm font-medium transition-colors ${
                isActive('/generator') ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]'
              }`}
            >
              AI Generator
            </Link>
            <Link
              to="/gallery"
              className={`text-sm font-medium transition-colors ${
                isActive('/gallery') ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]'
              }`}
            >
              Component Gallery
            </Link>
            {/* <Link
              to="/preview"
              className={`text-sm font-medium transition-colors ${
                isActive('/preview') ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]'
              }`}
            >
              Advanced Editor
            </Link> */}
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing') ? 'text-[hsl(var(--accent))]' : 'text-[hsl(var(--muted))] hover:text-[hsl(var(--fg))]'
              }`}
            >
              Pricing
            </Link>
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-4">
            <Link
              to="/generator"
              className="btn-primary"
            >
              Create Landing Page
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
