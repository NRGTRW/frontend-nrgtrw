import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif;
  }

  body {
    background-color: #0a0a0a;
    color: #e6e6e6;
  }

  :root {
    --obsidian: #0a0a0a;
    --moonstone: #00f3ff;
    --shadow: #1a1a1a;
    --mist: #6c5ce7;
    --silver: #e6e6e6;
    --smoke: #4a4a4a;
    
    /* Primary color scheme for buttons and components */
    --primary: #c5a47f;
    --primary-dark: #d4af37;
    --text-light: #2a2a2a;
    --text-dark: #e5e5e5;
    --background-light: #ffffff;
    --background-dark: #121212;
    --card-background-light: #f8f8f8;
    --card-background-dark: #1a1a1a;
    --gradient-from: #fafafa;
    --gradient-to: rgba(250, 250, 250, 0.1);
    --gradient-from-dark: #121212;
    --gradient-to-dark: rgba(18, 18, 18, 0.1);
  }
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

export const CTAButton = ({ variant = "primary", className = "", children, ...props }) => {
  const baseClasses = "inline-flex items-center justify-center px-4 sm:px-6 py-3 sm:py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 min-h-[44px] sm:min-h-[48px] focus:ring-[var(--primary)]/50 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-[#c5a47f] text-white border-[#c5a47f] hover:bg-[#b8946a] hover:border-[#b8946a] hover:text-white hover:shadow-lg hover:backdrop-blur-sm focus:ring-[#c5a47f]/50",
    secondary: "bg-transparent text-[#c5a47f] border-[#c5a47f] hover:bg-white/20 hover:text-[#c5a47f] hover:backdrop-blur-sm hover:shadow-md focus:ring-[#c5a47f]/50"
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export const Card = styled.div`
  background: var(--shadow);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--smoke);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    border-color: var(--moonstone);
  }
`;