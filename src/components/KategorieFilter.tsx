"use client";

import Link from "next/link";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { kategorien, type Kategorie } from "@/data/gegenstaende";
import { dauer, kurve } from "@/lib/bewegung";

type Props = {
  aktiv: Kategorie | null; // null = „Alle“
  suche?: string | null; // bleibt beim Wechsel der Kategorie erhalten
};

// Der Filter steckt in der Adresse (/?kategorie=Mode): teilbar, und „Zurück“ im Browser funktioniert.
// Die dunkle Füllung des aktiven Filters ist ein eigener Marker, der zum neuen Filter gleitet (nur transform).
export default function KategorieFilter({ aktiv, suche = null }: Props) {
  const reduziert = useReducedMotion();
  const optionen: { name: string; kategorie: Kategorie | null }[] = [
    { name: "Alle", kategorie: null },
    ...kategorien.map((k) => ({ name: k, kategorie: k })),
  ];

  return (
    <nav aria-label="Nach Kategorie filtern" className="mb-6">
      <LayoutGroup id="kategorie-filter">
        <ul className="flex flex-wrap gap-2">
          {optionen.map(({ name, kategorie }) => {
            const istAktiv = kategorie === aktiv;
            return (
              <li key={name}>
                <Link
                  href={{
                    pathname: "/",
                    query: { ...(kategorie && { kategorie }), ...(suche && { q: suche }) },
                  }}
                  scroll={false}
                  aria-current={istAktiv ? "true" : undefined}
                  className={`relative flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-medium transition duration-(--duration-fast) ease-standard active:translate-y-0.5 ${
                    istAktiv
                      ? "text-on-action"
                      : "bg-raised text-ink hover:bg-bg hover:shadow-[inset_0_0_0_1px_var(--line)]"
                  }`}
                >
                  {istAktiv && (
                    <motion.span
                      layoutId="kategorie-marker"
                      aria-hidden
                      className="absolute -inset-px bg-action"
                      // Die Rundung als Stil, damit Motion sie beim Strecken mitrechnet.
                      style={{ borderRadius: 9999 }}
                      transition={reduziert ? { duration: 0 } : { duration: dauer.slow, ease: kurve.standard }}
                    />
                  )}
                  <span className="relative">{name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </LayoutGroup>
    </nav>
  );
}
