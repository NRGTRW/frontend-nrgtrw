import React from 'react';
import { Link } from 'react-router-dom';

interface LibButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  href?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  'aria-label'?: string;
  type?: 'button' | 'submit' | 'reset';
}

const LibButton: React.FC<LibButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  href,
  to,
  onClick,
  className = '',
  'aria-label': ariaLabel,
  type = 'button',
}) => {
  const baseClasses = 'library-button';
  const variantClasses = `library-button-${variant}`;
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }[size];
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`.trim();

  const commonProps = {
    className: classes,
    disabled,
    'aria-label': ariaLabel,
    'aria-disabled': disabled,
  };

  // Handle different button types
  if (href) {
    return (
      <a
        {...commonProps}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        role="button"
      >
        {children}
      </a>
    );
  }

  if (to) {
    return (
      <Link
        {...commonProps}
        to={to}
        role="button"
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      {...commonProps}
      type={type}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default LibButton;


