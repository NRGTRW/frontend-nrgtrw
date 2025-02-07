import React, { createContext, useContext, useEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollContext = createContext();

export const ScrollRestorationProvider = ({ children }) => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const scrollPositions = useRef({});

  // Disable browser's default scroll restoration
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Save scroll position on scroll
  useEffect(() => {
    const saveScrollPosition = () => {
      scrollPositions.current[location.pathname] = window.scrollY;
      sessionStorage.setItem(
        `scrollPosition-${location.pathname}`,
        window.scrollY
      );
    };

    window.addEventListener("scroll", saveScrollPosition);
    return () => window.removeEventListener("scroll", saveScrollPosition);
  }, [location.pathname]);

  // Restore scroll position when pathname changes, but only for POP navigations
  useEffect(() => {
    if (navigationType === "POP") {
      const savedPosition = sessionStorage.getItem(
        `scrollPosition-${location.pathname}`
      );
      if (savedPosition !== null) {
        // Wait for the next two animation frames to ensure DOM is ready
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            window.scrollTo(0, parseInt(savedPosition, 10));
          });
        });
      }
    }
  }, [location.pathname, navigationType]);

  return (
    <ScrollContext.Provider value={scrollPositions}>
      {children}
    </ScrollContext.Provider>
  );
};

export default ScrollRestorationProvider;
export const useScrollRestoration = () => useContext(ScrollContext);
