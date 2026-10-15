"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { abmelden } from "@/app/anmelden/actions";
import AnfragenHinweis from "@/components/AnfragenHinweis";
import { knopf, navLink } from "@/components/stile";
import { dauer, kurve } from "@/lib/bewegung";

type Props = {
  nutzer: { id: string; email: string } | null;
  hinweis: { gegenstandIds: string[]; anzahl: number } | null;
};

type Ziel = {
  href: string;
  name: string;
  /** Auf dieser Seite gilt der Link als „aktuell“, wenn sie vom Link-Ziel abweicht (z. B. der Anker auf der Startseite). */
  aktivBei?: string;
  nurAngemeldet?: boolean;
};

// „Meine Anfragen“ (was ich angefragt habe) steht neben „Meine Gegenstände“; die Glocke steht für „Anfragen an mich“.
const ziele: Ziel[] = [
  { href: "/#gegenstaende", name: "Gegenstände", aktivBei: "/" },
  { href: "/anbieten", name: "Anbieten" },
  { href: "/meine-gegenstaende", name: "Meine Gegenstände", nurAngemeldet: true },
  { href: "/meine-anfragen", name: "Meine Anfragen", nurAngemeldet: true },
];

const uebergang = { duration: dauer.base, ease: kurve.standard };

/**
 * Hauptnavigation. Ab 768 px: Links mit einem Strich, der zum Zeiger (oder zur aktuellen Seite) gleitet.
 * Darunter: Menü-Knopf, der eine Liste aufklappt. Bewegt wird nur transform und opacity.
 */
export default function Hauptnavigation({ nutzer, hinweis }: Props) {
  const pfad = usePathname();
  const sichtbar = ziele.filter((z) => nutzer || !z.nurAngemeldet);
  const istAktuell = (z: Ziel) => pfad === (z.aktivBei ?? z.href);
  const aktuellerHref = sichtbar.find(istAktuell)?.href ?? null;

  // Der Strich sitzt unter dem Link mit dem Zeiger, sonst unter der aktuellen Seite.
  const [ueber, setUeber] = useState<string | null>(null);
  const markiert = ueber ?? aktuellerHref;

  // Das Menü gilt nur für die Seite, auf der es geöffnet wurde: Wer einen Link antippt, sieht es zugeklappt.
  const [offenBei, setOffenBei] = useState<string | null>(null);
  const menueOffen = offenBei === pfad;
  const knopfRef = useRef<HTMLButtonElement>(null);
  const menueRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menueOffen) return;
    function beiTaste(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOffenBei(null);
      knopfRef.current?.focus();
    }
    function beiKlick(e: PointerEvent) {
      const ziel = e.target as Node;
      if (menueRef.current?.contains(ziel) || knopfRef.current?.contains(ziel)) return;
      setOffenBei(null);
    }
    document.addEventListener("keydown", beiTaste);
    document.addEventListener("pointerdown", beiKlick);
    return () => {
      document.removeEventListener("keydown", beiTaste);
      document.removeEventListener("pointerdown", beiKlick);
    };
  }, [menueOffen]);

  return (
    <nav aria-label="Hauptnavigation" className="flex min-w-0 items-center gap-1">
      <LayoutGroup id="hauptnavigation">
        <ul className="hidden items-center md:flex" onMouseLeave={() => setUeber(null)}>
          {sichtbar.map((z) => (
            <li key={z.href}>
              <Link
                href={z.href}
                aria-current={istAktuell(z) ? "page" : undefined}
                onMouseEnter={() => setUeber(z.href)}
                onFocus={() => setUeber(z.href)}
                onBlur={() => setUeber(null)}
                className={`${navLink} relative`}
              >
                {z.name}
                {markiert === z.href && (
                  <motion.span
                    layoutId="nav-strich"
                    aria-hidden
                    className="absolute inset-x-2 bottom-1 h-0.5 bg-ink"
                    transition={uebergang}
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </LayoutGroup>

      {hinweis && nutzer && (
        <AnfragenHinweis nutzerId={nutzer.id} gegenstandIds={hinweis.gegenstandIds} anzahl={hinweis.anzahl} />
      )}

      {nutzer ? (
        <>
          {/* Erst auf breiten Bildschirmen ist Platz für die Adresse; sonst steht sie im Menü. */}
          <span className="hidden min-w-0 max-w-48 truncate px-2 text-sm text-muted lg:block" title={nutzer.email}>
            <span className="sr-only">Angemeldet als </span>
            {nutzer.email}
          </span>
          <form action={abmelden} className="hidden shrink-0 md:block">
            <button type="submit" className={navLink}>
              Abmelden
            </button>
          </form>
        </>
      ) : (
        <Link href="/anmelden" className={`${knopf("pille")} shrink-0`}>
          Anmelden
        </Link>
      )}

      <button
        ref={knopfRef}
        type="button"
        aria-label={menueOffen ? "Menü schließen" : "Menü öffnen"}
        aria-expanded={menueOffen}
        aria-controls="mobilmenue"
        onClick={() => setOffenBei(menueOffen ? null : pfad)}
        className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-ink md:hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={menueOffen ? "zu" : "auf"}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: dauer.fast, ease: kurve.standard }}
            className="flex"
          >
            {menueOffen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
          </motion.span>
        </AnimatePresence>
      </button>

      {/* Das Menü hängt am Header (relative), nicht an dieser Navigation. */}
      <AnimatePresence>
        {menueOffen && (
          <motion.div
            ref={menueRef}
            id="mobilmenue"
            key="menue"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: dauer.fast, ease: kurve.exit } }}
            transition={uebergang}
            className="absolute inset-x-0 top-full z-30 border-b border-border bg-raised shadow-1 md:hidden"
          >
            <ul className="mx-auto max-w-5xl px-4 py-2">
              {nutzer && (
                <li className="break-words px-2 py-2 text-sm text-muted">
                  <span className="sr-only">Angemeldet als </span>
                  {nutzer.email}
                </li>
              )}
              {sichtbar.map((z, i) => (
                <motion.li
                  key={z.href}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dauer.base, ease: kurve.standard, delay: 0.03 * i }}
                  className="border-t border-border"
                >
                  <Link
                    href={z.href}
                    aria-current={istAktuell(z) ? "page" : undefined}
                    className="flex min-h-11 items-center px-2 text-base text-ink aria-[current=page]:font-semibold aria-[current=page]:underline aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-6"
                  >
                    {z.name}
                  </Link>
                </motion.li>
              ))}
              {nutzer && (
                <motion.li
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: dauer.base, ease: kurve.standard, delay: 0.03 * sichtbar.length }}
                  className="border-t border-border"
                >
                  <form action={abmelden}>
                    <button type="submit" className="flex min-h-11 w-full items-center px-2 text-base text-muted hover:text-ink">
                      Abmelden
                    </button>
                  </form>
                </motion.li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
