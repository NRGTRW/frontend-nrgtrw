import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import './MobileMenu.css';

const MobileMenu = ({ isOpen, onClose }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const navigate = useNavigate();
  const { user, logOut } = useAuth();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
    setActiveSubmenu(null);
  };

  const toggleSubmenu = (menuName) => {
    setActiveSubmenu(activeSubmenu === menuName ? null : menuName);
  };

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      icon: '🏠'
    },
    {
      name: 'Fitness',
      path: '/fitness',
      icon: '💪'
    },
    {
      name: 'Tech',
      path: '/tech',
      icon: '💻'
    },
    {
      name: 'Clothing',
      path: '/clothing',
      icon: '👕'
    },
    {
      name: 'Vision',
      path: '/vision',
      icon: '👁️'
    }
  ];

  const userMenuItems = user ? [
    {
      name: 'Profile',
      path: '/profile',
      icon: '👤'
    },
    {
      name: 'Orders',
      path: '/orders',
      icon: '📦'
    },
    {
      name: 'Wishlist',
      path: '/wishlist',
      icon: '❤️'
    },
    {
      name: 'Cart',
      path: '/cart',
      icon: '🛒'
    }
  ] : [];

  const adminMenuItems = user?.role === 'ADMIN' || user?.role === 'ROOT_ADMIN' ? [
    {
      name: 'Admin Dashboard',
      path: '/admin',
      icon: '⚙️'
    },
    {
      name: 'Create Product',
      path: '/admin/create-product',
      icon: '➕'
    }
  ] : [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="mobile-menu-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            {/* Header */}
            <div className="mobile-menu-header">
              <h2>Menu</h2>
              <button className="close-btn" onClick={onClose}>
                ✕
              </button>
            </div>

            {/* User Info */}
            {user && (
              <div className="mobile-user-info">
                <img 
                  src={user.profilePicture || '/default-profile.webp'} 
                  alt={user.name}
                  className="user-avatar"
                />
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
            )}

            {/* Main Menu */}
            <nav className="mobile-nav">
              <div className="menu-section">
                <h3>Navigation</h3>
                {menuItems.map((item) => (
                  <motion.button
                    key={item.name}
                    className="menu-item"
                    onClick={() => handleNavigation(item.path)}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* User Menu */}
              {userMenuItems.length > 0 && (
                <div className="menu-section">
                  <h3>Account</h3>
                  {userMenuItems.map((item) => (
                    <motion.button
                      key={item.name}
                      className="menu-item"
                      onClick={() => handleNavigation(item.path)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-text">{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Admin Menu */}
              {adminMenuItems.length > 0 && (
                <div className="menu-section">
                  <h3>Admin</h3>
                  {adminMenuItems.map((item) => (
                    <motion.button
                      key={item.name}
                      className="menu-item"
                      onClick={() => handleNavigation(item.path)}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="menu-icon">{item.icon}</span>
                      <span className="menu-text">{item.name}</span>
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Auth Actions */}
              <div className="menu-section">
                {user ? (
                  <motion.button
                    className="menu-item logout-btn"
                    onClick={() => {
                      logOut();
                      onClose();
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="menu-icon">🚪</span>
                    <span className="menu-text">Logout</span>
                  </motion.button>
                ) : (
                  <>
                    <motion.button
                      className="menu-item"
                      onClick={() => handleNavigation('/login')}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="menu-icon">🔑</span>
                      <span className="menu-text">Login</span>
                    </motion.button>
                    <motion.button
                      className="menu-item"
                      onClick={() => handleNavigation('/signup')}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="menu-icon">📝</span>
                      <span className="menu-text">Sign Up</span>
                    </motion.button>
                  </>
                )}
              </div>
            </nav>

            {/* Footer */}
            <div className="mobile-menu-footer">
              <p>&copy; 2024 NRG. All rights reserved.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu; 