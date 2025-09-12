import { useState, useEffect } from 'react';

/**
 * Hook to detect if the user prefers reduced motion
 * Respects the `prefers-reduced-motion` CSS media query
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check if the media query is supported
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);

    // Create event listener
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    // Add event listener
    mediaQuery.addEventListener('change', handleChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to conditionally apply animations based on user preference
 * @param animation - The animation to apply if motion is not reduced
 * @param fallback - The fallback animation/class if motion is reduced
 * @returns The appropriate animation class
 */
export function useConditionalAnimation(
  animation: string,
  fallback: string = ''
): string {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return prefersReducedMotion ? fallback : animation;
}

/**
 * Hook to get animation duration based on user preference
 * @param normalDuration - Normal animation duration
 * @param reducedDuration - Duration when motion is reduced (default: 0)
 * @returns The appropriate duration
 */
export function useAnimationDuration(
  normalDuration: number,
  reducedDuration: number = 0
): number {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return prefersReducedMotion ? reducedDuration : normalDuration;
}

/**
 * Hook to conditionally enable/disable animations
 * @param enabled - Whether animations should be enabled by default
 * @returns Whether animations should be enabled
 */
export function useAnimationEnabled(enabled: boolean = true): boolean {
  const prefersReducedMotion = usePrefersReducedMotion();
  
  return enabled && !prefersReducedMotion;
}
