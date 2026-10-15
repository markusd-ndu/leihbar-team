"use client";

import type { LucideIcon } from "lucide-react";
import { motion, type Variants } from "motion/react";
import { dauer, kurve } from "@/lib/bewegung";

export type Zeichen = "lupe" | "hand" | "kreislauf";

type Props = {
  icon: LucideIcon;
  titel: string;
  text: string;
  /** Kleine Geste des Zeichens beim Darüberfahren. */
  zeichen: Zeichen;
  /** Eine andere Karte wird gerade berührt: diese tritt etwas zurück. */
  gedimmt: boolean;
  /** Diese Karte wird gerade berührt (Maus oder Stift, nie Touch). */
  beruehrt: boolean;
  /** Ohne Bewegung (Systemeinstellung „Bewegung reduzieren“): Die Karte bleibt still. */
  still: boolean;
  onBeruehrung: (beruehrt: boolean) => void;
};

const weich = { duration: dauer.base, ease: kurve.standard };

// „Zettel am Brett“. Die Karte ist ein angepinnter Zettel: Beim Darüberfahren fällt die gelbe Nadel ein und federt
// zurück, der Zettel kippt 1° um die Nadel und hebt sich 4 px, und die gelbe Schatten-Ebene gleitet von 4 auf 8 px.
// Bewegt wird nur transform und opacity; jede Geste läuft einmal ab, nichts wiederholt sich.
const zettel: Variants = {
  ruhe: { y: 0, rotate: 0, opacity: 1, transition: weich },
  gedimmt: { y: 0, rotate: 0, opacity: 0.85, transition: weich },
  hover: { y: -4, rotate: -1, opacity: 1, transition: weich },
};

const schatten: Variants = {
  ruhe: { x: 4, y: 4, transition: weich },
  gedimmt: { x: 4, y: 4, transition: weich },
  hover: { x: 8, y: 8, transition: weich },
};

const nadel: Variants = {
  ruhe: { opacity: 0, y: -16, transition: { duration: dauer.fast, ease: kurve.exit } },
  gedimmt: { opacity: 0, y: -16 },
  // Eine Feder, die nach 0,3 s zur Ruhe kommt.
  hover: { opacity: 1, y: 0, transition: { type: "spring", duration: dauer.slow, bounce: 0.55 } },
};

/** Pro Zeichen eine eigene Geste. */
const gesten: Record<Zeichen, Variants> = {
  // Die Lupe schwingt in einem Bogen nach rechts oben und wird 15 % größer.
  lupe: {
    ruhe: { x: 0, y: 0, rotate: 0, scale: 1, transition: weich },
    gedimmt: { x: 0, y: 0, rotate: 0, scale: 1 },
    hover: {
      x: [0, 6, 4],
      y: [0, -6, -4],
      rotate: [0, 18, 12],
      scale: [1, 1.2, 1.15],
      transition: { duration: dauer.slow, ease: kurve.standard },
    },
  },
  // Die Hand winkt einmal kurz.
  hand: {
    ruhe: { rotate: 0, scale: 1, transition: weich },
    gedimmt: { rotate: 0, scale: 1 },
    hover: { rotate: [0, -14, 12, -5, 0], transition: { duration: 0.4, ease: kurve.standard } },
  },
  // Der Kreislauf läuft genau ein Drittel weiter (120°), einmal.
  kreislauf: {
    ruhe: { rotate: 0, transition: weich },
    gedimmt: { rotate: 0 },
    hover: { rotate: 120, transition: { duration: dauer.slow, ease: kurve.standard } },
  },
};

// Textmarker: Jedes Wort der Überschrift bekommt einen gelben Streifen, der nacheinander einfährt (so sitzt er auch
// bei Zeilenumbrüchen sauber hinter dem Text). Mit 4 Wörtern bleibt die Gesamtdauer unter 0,35 s.
const marker: Variants = {
  ruhe: { scaleX: 0, transition: weich },
  gedimmt: { scaleX: 0 },
  hover: (wort: number) => ({ scaleX: 1, transition: { duration: dauer.base, ease: kurve.standard, delay: wort * 0.03 } }),
};

// Kein `whileTap`: Motion macht dafür jedes Element per `tabIndex` fokussierbar – die Karten sind aber nur Anzeige.
export default function FeatureCard({ icon: Icon, titel, text, zeichen, gedimmt, beruehrt, still, onBeruehrung }: Props) {
  // Ohne Bewegung kein Zustand und keine Handler: Die Karte bleibt, wie sie ist.
  const bewegt = !still;
  return (
    <motion.div
      className="relative h-full"
      style={{ transformOrigin: "50% 0%" }}
      variants={zettel}
      initial="ruhe"
      animate={bewegt && gedimmt ? "gedimmt" : "ruhe"}
      whileHover={bewegt ? "hover" : undefined}
      onHoverStart={bewegt ? () => onBeruehrung(true) : undefined}
      onHoverEnd={bewegt ? () => onBeruehrung(false) : undefined}
    >
      {/* Der gelbe Schatten ist eine eigene Ebene: Sie verschiebt sich (transform), statt den Schattenwert zu ändern. */}
      <motion.span aria-hidden variants={schatten} className="absolute inset-0 bg-signal" style={{ x: 4, y: 4 }} />
      <motion.span
        aria-hidden
        variants={nadel}
        className="pointer-events-none absolute -top-1 left-1/2 z-10 -ml-1.5 size-3 rounded-full bg-signal ring-2 ring-on-signal"
        style={{ opacity: 0 }}
      />
      <div className="relative h-full border border-border bg-raised p-6">
        {/* Lucide-Icons sind ohne aria-label automatisch aria-hidden – rein dekorativ. */}
        <motion.span
          variants={gesten[zeichen]}
          className="mb-3 inline-flex text-ink"
          style={{ transformOrigin: zeichen === "hand" ? "50% 100%" : "50% 50%" }}
        >
          <Icon size={28} strokeWidth={1.75} />
        </motion.span>
        <h2 className="mb-2 font-display text-lg font-normal">
          {/* Die Schrift wird auf dem gelben Streifen dunkel (Kontrast 13 : 1, auch im dunklen Modus). */}
          {titel.split(" ").map((wort, i) => (
            <span key={i}>
              {i > 0 && " "}
              <span
                className={`relative isolate inline-block transition-colors duration-(--duration-base) ease-standard ${
                  beruehrt && bewegt ? "text-on-signal" : ""
                }`}
              >
                <motion.span
                  aria-hidden
                  variants={marker}
                  custom={i}
                  className="absolute -inset-x-1 inset-y-0 -z-10 bg-signal"
                  style={{ originX: 0, scaleX: 0 }}
                />
                {wort}
              </span>
            </span>
          ))}
        </h2>
        <p className="text-base leading-[1.6] text-muted">{text}</p>
      </div>
    </motion.div>
  );
}
