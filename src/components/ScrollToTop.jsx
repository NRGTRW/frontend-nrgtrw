import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    try {
      // Routes where scrolling to the top is required
      const scrollToTopRoutes = ["/product", "/materials", "/inspiration"];

      // Ensure the pathname is valid and matches scroll-to-top routes
      if (pathname && scrollToTopRoutes.some((route) => pathname.startsWith(route))) {
        // Delay scrolling to avoid conflicts during transitions
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 100);
      }
    } catch (error) {
      console.error("ScrollToTop error:", error); // Log errors for debugging
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
