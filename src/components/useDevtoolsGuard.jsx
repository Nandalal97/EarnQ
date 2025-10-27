import { useEffect } from "react";

export default function useDevtoolsGuard() {
  useEffect(() => {
    const threshold = 150; // width/height diff when DevTools is docked

    const checkDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;

      if (widthThreshold || heightThreshold) {
        document.body.innerHTML =
          `<p style="text-align:center; padding:30px; margin-top:20px; font-size:14px; color:red;">
             Looks like you’re trying to inspect the page. Please use the site normally for the best experience.
          </p>`;
      }
    };

    window.addEventListener("resize", checkDevTools);
    checkDevTools(); // run on mount

    return () => {
      window.removeEventListener("resize", checkDevTools);
    };
  }, []);
}
