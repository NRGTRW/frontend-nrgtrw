import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  variant = "primary", 
  size = "md",
  className = "", 
  children, 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-300 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] sm:min-h-[48px] focus:ring-[var(--primary)]/50 focus:ring-offset-2";
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 sm:px-6 py-3 text-sm sm:text-base",
    lg: "px-6 sm:px-8 py-4 text-base sm:text-lg"
  };

  const variantClasses = {
    primary: "bg-[#c5a47f] text-white border-[#c5a47f] hover:bg-[#b8946a] hover:border-[#b8946a] hover:shadow-lg hover:backdrop-blur-sm",
    secondary: "bg-transparent text-[#c5a47f] border-[#c5a47f] hover:bg-white/20 hover:backdrop-blur-sm hover:shadow-md",
    ghost: "bg-transparent text-[var(--text-light)] dark:text-[var(--text-dark)] border-transparent hover:bg-[var(--primary)]/10 hover:border-[var(--primary)]/20"
  };
  
  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Button;

