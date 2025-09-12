import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const SimpleModernNavigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/generator', label: 'Generator' },
    { path: '/gallery', label: 'Gallery' },
    // { path: '/preview', label: 'Preview' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="modern-container">
        <div className="flex-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex-center">
              <span className="text-white text-sm font-semibold">LP</span>
            </div>
            <span className="text-body font-semibold text-gray-900">
              Landing Page Generator
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-caption font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};
