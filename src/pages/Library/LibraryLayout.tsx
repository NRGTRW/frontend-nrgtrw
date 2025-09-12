import React from 'react';
import { Outlet } from 'react-router-dom';
import LibraryNav from './LibraryNav';
import './library.module.css';

interface LibraryLayoutProps {
  children?: React.ReactNode;
}

const LibraryLayout: React.FC<LibraryLayoutProps> = ({ children }) => {
  return (
    <div className="library-layout">
      {/* Spacer to account for the global navbar */}
      <div className="library-navbar-spacer" style={{ height: '80px' }} />
      
      {/* Library-specific navigation */}
      <LibraryNav />
      
      {/* Main content area */}
      <main data-scope="library" className="library-main">
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default LibraryLayout;
