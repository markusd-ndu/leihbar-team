"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import GegenstandKarte from "@/components/GegenstandKarte";
import { hinweisFlaeche } from "@/components/stile";
import type { Gegenstand, Kategorie } from "@/data/gegenstaende";
import { dauer, kurve } from "@/lib/bewegung";

type Props = {
  gegenstaende: Gegenstand[];
  /** Für den Satz im leeren Zustand. */
  suche: string | null;
  kategorie: Kategorie | null;
};

/**
 * Die Liste der Startseite. Beim Wechsel der Kategorie blenden die übrigen Karten aus, neue blenden ein
 * und die verbleibenden gleiten an ihren neuen Platz (höchstens 0,3 s). Bewegt wird nur transform und opacity.
 * „Bewegung reduzieren“: Motion würde zwar das Gleiten weglassen, aber das Ein- und Ausblenden behalten –
 * deshalb ist die Dauer dann ganz 0.
 */
export default function GegenstandListe({ gegenstaende, suche, kategorie }: Props) {
  const reduziert = useReducedMotion();
  const gleiten = reduziert ? { duration: 0 } : { duration: dauer.slow, ease: kurve.standard };
  const ausblenden = reduziert ? { duration: 0 } : { duration: dauer.base, ease: kurve.exit };

  return (
    <>
      {/* relative: ausblendende Karten werden aus dem Raster genommen (popLayout), damit die anderen sofort gleiten. */}
      <ul className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false} mode="popLayout">
          {gegenstaende.map((gegenstand, index) => (
            <motion.li
              key={gegenstand.id}
              layout="position"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: gleiten }}
              exit={{ opacity: 0, transition: ausblenden }}
              transition={gleiten}
            >
              <GegenstandKarte gegenstand={gegenstand} vorladen={index === 0} />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {gegenstaende.length === 0 && (
        <p className={`${hinweisFlaeche} p-8 text-center text-muted`}>
          {suche
            ? `Nichts gefunden für „${suche}“.`
            : kategorie
              ? "In dieser Kategorie ist gerade nichts frei."
              : "Gerade ist nichts frei."}{" "}
          <Link
            href={suche || kategorie ? "/" : "/anbieten"}
            scroll={false}
            className="font-medium text-ink underline underline-offset-4"
          >
            {suche || kategorie ? "Alle Gegenstände ansehen" : "Biete den ersten Gegenstand an"}
          </Link>
        </p>
      )}
    </>
  );
}
