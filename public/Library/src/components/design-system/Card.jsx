import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ 
  variant = "default",
  className = "", 
  children,
  padding = "md",
  ...props 
}) => {
  const baseClasses = "rounded-lg border transition-all duration-300";
  
  const variantClasses = {
    default: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)] border-[var(--primary)]/10 dark:border-[var(--primary-dark)]/10 hover:shadow-lg",
    elevated: "bg-[var(--card-background-light)] dark:bg-[var(--card-background-dark)] border-[var(--primary)]/20 dark:border-[var(--primary-dark)]/20 shadow-lg hover:shadow-xl",
    outlined: "bg-transparent border-[var(--primary)]/30 dark:border-[var(--primary-dark)]/30 hover:border-[var(--primary)]/50 dark:hover:border-[var(--primary-dark)]/50"
  };

  const paddingClasses = {
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  variant: PropTypes.oneOf(['default', 'elevated', 'outlined']),
  padding: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default Card;







