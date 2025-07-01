import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Always scroll to top for /materials and /inspiration
    if (
      pathname === "/materials" ||
      pathname === "/inspiration" ||
      pathname === "/profile"
    ) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // For other pages, scroll to top on non-POP navigations (or if desired, also smooth)
      if (navigationType !== "POP") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop;
