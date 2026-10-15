"use client";

import { useEffect, useState } from "react";

/**
 * Gelbe Kante unter dem Header, sobald die Seite gescrollt ist. Nur opacity ändert sich.
 * Ein 8 px hoher Marker ganz oben auf der Seite verrät per IntersectionObserver, ob man noch oben ist
 * (kein Scroll-Ereignis nötig).
 */
export default function HeaderKante() {
  const [gescrollt, setGescrollt] = useState(false);

  useEffect(() => {
    const marker = document.createElement("div");
    marker.setAttribute("aria-hidden", "true");
    marker.style.cssText = "position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none";
    document.documentElement.appendChild(marker);
    const beobachter = new IntersectionObserver(([eintrag]) => setGescrollt(!eintrag.isIntersecting));
    beobachter.observe(marker);
    return () => {
      beobachter.disconnect();
      marker.remove();
    };
  }, []);

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-full h-1 bg-signal transition-opacity duration-(--duration-base) ease-standard ${
        gescrollt ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
