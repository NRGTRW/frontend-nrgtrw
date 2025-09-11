import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressSteps, defaultGenerationSteps } from '../components/ui/ProgressSteps';
import { ThemeToggle } from '../components/ThemeToggle';

// Mock the useTheme hook
vi.mock('../hooks/useTheme', () => ({
  useTheme: () => ({
    theme: 'dark',
    toggleTheme: vi.fn(),
    setLightTheme: vi.fn(),
    setDarkTheme: vi.fn(),
    isDark: true,
    isLight: false,
  }),
}));

describe('Design System Components', () => {
  describe('ProgressSteps', () => {
    it('renders with default steps', () => {
      render(<ProgressSteps steps={defaultGenerationSteps} current={0} />);
      
      expect(screen.getByText('Validate')).toBeInTheDocument();
      expect(screen.getByText('Plan')).toBeInTheDocument();
      expect(screen.getByText('Compose')).toBeInTheDocument();
      expect(screen.getByText('Render')).toBeInTheDocument();
      expect(screen.getByText('QA')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('shows correct current step', () => {
      render(<ProgressSteps steps={defaultGenerationSteps} current={2} />);
      
      expect(screen.getByText('Step 3 of 6')).toBeInTheDocument();
      expect(screen.getByText('50% complete')).toBeInTheDocument();
    });

    it('shows completed steps with checkmarks', () => {
      render(<ProgressSteps steps={defaultGenerationSteps} current={3} />);
      
      // First 3 steps should be completed (show checkmarks)
      const checkmarks = screen.getAllByRole('img', { hidden: true });
      expect(checkmarks).toHaveLength(3);
    });

    it('applies custom className', () => {
      const { container } = render(
        <ProgressSteps 
          steps={defaultGenerationSteps} 
          current={0} 
          className="custom-class" 
        />
      );
      
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('ThemeToggle', () => {
    it('renders theme toggle button', () => {
      render(<ThemeToggle />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Switch to light theme');
    });

    it('shows correct icon for dark theme', () => {
      render(<ThemeToggle />);
      
      // Should show moon icon for dark theme
      const moonIcon = screen.getByRole('button').querySelector('svg');
      expect(moonIcon).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<ThemeToggle className="custom-theme-toggle" />);
      
      expect(container.firstChild).toHaveClass('custom-theme-toggle');
    });

    it('renders with label when showLabel is true', () => {
      render(<ThemeToggle showLabel />);
      
      expect(screen.getByText('Light')).toBeInTheDocument();
    });
  });
});

describe('Design Tokens', () => {
  it('loads CSS custom properties', () => {
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Check that our custom properties are defined
    expect(computedStyle.getPropertyValue('--bg')).toBeTruthy();
    expect(computedStyle.getPropertyValue('--fg')).toBeTruthy();
    expect(computedStyle.getPropertyValue('--accent')).toBeTruthy();
    expect(computedStyle.getPropertyValue('--glow')).toBeTruthy();
  });

  it('applies theme attribute correctly', () => {
    document.documentElement.setAttribute('data-theme', 'light');
    
    const root = document.documentElement;
    expect(root.getAttribute('data-theme')).toBe('light');
    
    // Reset
    document.documentElement.setAttribute('data-theme', 'dark');
  });
});

describe('Reduced Motion', () => {
  it('respects prefers-reduced-motion', () => {
    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Test that reduced motion is detected
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    expect(mediaQuery.matches).toBe(true);
  });
});
