import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const root = document.getElementById('root');
    if (root) root.scrollTop = 0;
    const scrollable = document.querySelector('.overflow-y-auto');
    if (scrollable) scrollable.scrollTop = 0;
  }, [pathname]);

  return null;
}