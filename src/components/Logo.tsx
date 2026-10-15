"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { dauer, kurve } from "@/lib/bewegung";

// Das Logo als Inline-SVG (Vorlage: public/marke/leihbar-logo.svg), damit sich das gelbe Quadrat bewegen kann.
// Farben über das Token „marke“: Tinte auf Papier, reinweiß im dunklen Modus.
const SCHRIFT =
  "M7.4 0.0V-68.8H32.1V-18.90H76.7V0.0ZM86.00 0.0V-68.8H159.5V-51.7H110.80V-42.80H152.8V-26.6H110.80V-17.1H160.3V0.0ZM172.00 0.0V-68.8H196.70V0.0ZM211.50 0.0V-68.8H236.20V-44.40H272.90V-68.8H297.6V0.0H272.90V-25.5H236.20V0.0ZM312.4 0.0V-68.8H371.8Q377.5 -68.8 382.1 -66.6Q386.8 -64.5 389.5 -60.7Q392.3 -56.90 392.3 -51.90Q392.3 -46.90 390.6 -43.7Q388.9 -40.5 386.04 -38.65Q383.2 -36.80 379.8 -35.9V-35.5Q383.7 -34.7 386.9 -32.7Q390.1 -30.8 392.0 -27.3Q393.9 -23.8 393.9 -18.3Q393.9 -12.8 391.04 -8.70Q388.2 -4.60 383.29 -2.30Q378.4 0.0 372.4 0.0ZM337.1 -16.0H362.5Q365.2 -16.0 366.9 -17.6Q368.6 -19.20 368.6 -22.40Q368.6 -23.90 367.8 -25.15Q367.1 -26.40 365.70 -27.1Q364.3 -27.8 362.5 -27.8H337.1ZM337.1 -42.0H360.9Q362.8 -42.0 364.1 -42.7Q365.5 -43.5 366.2 -44.90Q367.0 -46.30 367.0 -48.40Q367.0 -50.6 365.2 -52.15Q363.4 -53.7 360.9 -53.7H337.1ZM398.8 0.0 432.1 -68.8H459.3L492.6 0.0H466.1L462.0 -9.1H428.3L424.3 0.0ZM435.8 -26.20H454.5L449.7 -37.80Q449.4 -38.6 448.9 -39.9Q448.4 -41.30 447.79 -43.0Q447.2 -44.7 446.6 -46.40Q446.1 -48.1 445.6 -49.5H444.9Q444.3 -47.80 443.5 -45.60Q442.7 -43.40 441.9 -41.30Q441.2 -39.2 440.6 -37.80ZM500.79 0.0V-68.8H560.4Q568.1 -68.8 573.2 -65.6Q578.4 -62.40 581.0 -57.2Q583.6 -52.0 583.6 -46.0Q583.6 -39.1 580.5 -33.7Q577.5 -28.40 571.6 -25.20L585.2 0.0H557.3L546.9 -21.5H525.5V0.0ZM525.5 -38.6H551.69Q554.5 -38.6 556.4 -40.3Q558.3 -42.1 558.3 -45.2Q558.3 -47.30 557.4 -48.7Q556.5 -50.2 555.0 -50.9Q553.6 -51.7 551.69 -51.7H525.5Z";

/** Bildmarke: schwarzes Quadrat mit Punkt, daneben das gelbe. Beim Zeiger rückt das gelbe 4 Einheiten heran. */
function Bildmarke({ zusammen }: { zusammen: boolean }) {
  return (
    <>
      <path
        className="fill-marke"
        fillRule="evenodd"
        d="M6 6H40V40H6Z M23.5 18A5.5 5.5 0 1 0 12.5 18A5.5 5.5 0 1 0 23.5 18Z"
      />
      <motion.rect
        x="24"
        y="24"
        width="34"
        height="34"
        strokeWidth="4"
        className="fill-signal stroke-marke"
        animate={{ x: zusammen ? -4 : 0, y: zusammen ? -4 : 0 }}
        transition={{ duration: dauer.fast, ease: kurve.standard }}
      />
    </>
  );
}

export default function Logo() {
  const [zusammen, setZusammen] = useState(false);
  return (
    <Link
      href="/"
      aria-label="Leihbar"
      // Nur Maus und Stift, nie Touch; mit der Tastatur beim sichtbaren Fokus.
      onPointerEnter={(e) => setZusammen(e.pointerType !== "touch")}
      onPointerLeave={() => setZusammen(false)}
      onFocus={(e) => setZusammen(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setZusammen(false)}
      className="flex min-h-11 min-w-11 shrink-0 items-center justify-center sm:justify-start"
    >
      {/* Am Handy ist kein Platz für die ganze Schrift: dort nur die Bildmarke. */}
      <svg viewBox="0 0 54 54" width="32" height="32" aria-hidden="true" className="sm:hidden">
        <g transform="translate(-6 -6)">
          <Bildmarke zusammen={zusammen} />
        </g>
      </svg>
      <svg viewBox="0 0 719.17 99.47" width="174" height="24" aria-hidden="true" className="hidden h-6 w-auto sm:block">
        <g transform="scale(1.842) translate(-6 -6)">
          <Bildmarke zusammen={zusammen} />
        </g>
        <path transform="translate(131.47 84.04)" className="fill-marke" d={SCHRIFT} />
      </svg>
    </Link>
  );
}
