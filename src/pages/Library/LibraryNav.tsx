import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LIBRARY_ROUTES } from '../../routes/links';

const LibraryNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      key: 'home',
      label: 'Home',
      path: LIBRARY_ROUTES.home,
      icon: '🏠',
    },
    {
      key: 'gallery',
      label: 'Gallery',
      path: LIBRARY_ROUTES.gallery,
      icon: '🎨',
    },
    {
      key: 'generator',
      label: 'Generator',
      path: LIBRARY_ROUTES.generator,
      icon: '🤖',
    },
    {
      key: 'preview',
      label: 'Preview',
      path: LIBRARY_ROUTES.preview,
      icon: '👁️',
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav 
      data-scope="library" 
      className="library-nav"
      role="navigation"
      aria-label="Library navigation"
    >
      <div className="library-nav-container">
        <div className="library-nav-brand">
          <h2 className="library-nav-title">NRG Components Library</h2>
        </div>
        
        <div className="library-nav-links">
          {navItems.map((item) => (
            <Link
              key={item.key}
              to={item.path}
              className={`library-nav-link ${isActive(item.path) ? 'active' : ''}`}
              aria-label={`Navigate to ${item.label}`}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span className="library-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="library-nav-text">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default LibraryNav;
