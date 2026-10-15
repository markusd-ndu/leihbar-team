"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ChevronDown, Menu, Plus, X } from "lucide-react";
import { abmelden } from "@/app/anmelden/actions";
import AnfragenHinweis, { useOffeneAnfragen } from "@/components/AnfragenHinweis";
import { kontoKnopf, navKnopf, navLink, pille, plakette } from "@/components/stile";
import { dauer, kurve } from "@/lib/bewegung";

type Props = {
  nutzer: { id: string; email: string } | null;
  hinweis: { gegenstandIds: string[]; anzahl: number } | null;
};

type Strichziel = "gegenstaende" | "konto";

// Die persönlichen Seiten stehen im Konto-Zettel (ab 768 px) bzw. im Menü (am Handy).
const kontoLinks = [
  { href: "/meine-gegenstaende", name: "Meine Gegenstände" },
  { href: "/meine-anfragen", name: "Meine Anfragen" },
  { href: "/anfragen-an-mich", name: "Anfragen an mich" },
];

const uebergang = { duration: dauer.base, ease: kurve.standard };

/** Ab 768 px sind Konto-Zettel und Handy-Menü dasselbe Panel; hier steht, ab wann. */
const breitAbfrage = "(min-width: 768px)";
const beiBreite = (melde: () => void) => {
  const m = window.matchMedia(breitAbfrage);
  m.addEventListener("change", melde);
  return () => m.removeEventListener("change", melde);
};

/**
 * Hauptnavigation in drei Rollen: Entdecken („Gegenstände“), Handeln („Anbieten“), Ich (Glocke und Konto).
 * Ein Panel für beides: am Handy über die ganze Breite unter dem Header, ab 768 px als Zettel rechts.
 * Der Strich gleitet zum Link unter dem Zeiger bzw. zur aktuellen Seite. Bewegt wird nur transform und opacity.
 */
export default function Hauptnavigation({ nutzer, hinweis }: Props) {
  const pfad = usePathname();
  const { zahl, sprung } = useOffeneAnfragen(nutzer?.id ?? null, hinweis);
  const breit = useSyncExternalStore(
    beiBreite,
    () => window.matchMedia(breitAbfrage).matches,
    () => false,
  );

  // Der Strich sitzt unter „Gegenstände“ bzw. „Konto“ – unter dem Zeiger, sonst unter der aktuellen Seite.
  const aktuell: Strichziel | null =
    pfad === "/" ? "gegenstaende" : nutzer && kontoLinks.some((l) => l.href === pfad) ? "konto" : null;
  const [ueber, setUeber] = useState<Strichziel | null>(null);
  const markiert = ueber ?? aktuell;

  // Das Panel gilt nur für die Seite, auf der es geöffnet wurde: Wer einen Link antippt, sieht es zugeklappt.
  const [offenBei, setOffenBei] = useState<string | null>(null);
  const offen = offenBei === pfad;
  const kontoRef = useRef<HTMLButtonElement>(null);
  const menueRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const istDrin = (ziel: Node | null) =>
    !!ziel && [panelRef.current, kontoRef.current, menueRef.current].some((e) => e?.contains(ziel));

  useEffect(() => {
    if (!offen) return;
    function beiTaste(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      setOffenBei(null);
      // Fokus zurück auf den Knopf, der gerade zu sehen ist („Konto“ oder Menü).
      [kontoRef.current, menueRef.current].find((k) => k && k.offsetParent !== null)?.focus();
    }
    function beiKlick(e: PointerEvent) {
      if (!istDrin(e.target as Node)) setOffenBei(null);
    }
    document.addEventListener("keydown", beiTaste);
    document.addEventListener("pointerdown", beiKlick);
    return () => {
      document.removeEventListener("keydown", beiTaste);
      document.removeEventListener("pointerdown", beiKlick);
    };
  }, [offen]);

  const umschalten = () => setOffenBei(offen ? null : pfad);
  const strich = (
    <motion.span
      layoutId="nav-strich"
      aria-hidden
      className="absolute inset-x-2 bottom-1 h-0.5 bg-ink"
      transition={uebergang}
    />
  );
  const panelLink =
    "flex min-h-11 items-center gap-2 border-l-[3px] border-transparent px-2 text-base text-ink hover:bg-bg aria-[current=page]:border-ink aria-[current=page]:font-semibold";
  const eintrag = (i: number) => ({
    initial: { opacity: 0, y: -4 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: dauer.base, ease: kurve.standard, delay: 0.03 * i },
  });

  return (
    <nav aria-label="Hauptnavigation" className="flex min-w-0 flex-1 items-center gap-2">
      <LayoutGroup id="hauptnavigation">
        {/* Entdecken: ab 768 px direkt neben dem Logo; am Handy steht „Gegenstände“ im Menü. */}
        <Link
          href="/#gegenstaende"
          aria-current={pfad === "/" ? "page" : undefined}
          onMouseEnter={() => setUeber("gegenstaende")}
          onMouseLeave={() => setUeber(null)}
          onFocus={() => setUeber("gegenstaende")}
          onBlur={() => setUeber(null)}
          className={`${navLink} relative hidden md:flex`}
        >
          Gegenstände
          {markiert === "gegenstaende" && strich}
        </Link>

        <div className="ml-auto flex min-w-0 items-center gap-1 sm:gap-2">
          {/* Handeln: die eine Hauptaktion. Abgemeldet leitet die Seite selbst zur Anmeldung weiter. */}
          <Link href="/anbieten" aria-current={pfad === "/anbieten" ? "page" : undefined} className={navKnopf}>
            <Plus size={18} aria-hidden />
            Anbieten
          </Link>

          {/* Ich: Glocke, Konto bzw. Anmelden. */}
          {nutzer && <AnfragenHinweis zahl={zahl} sprung={sprung} />}

          {nutzer ? (
            <button
              ref={kontoRef}
              type="button"
              aria-expanded={offen}
              aria-controls={offen ? "konto-panel" : undefined}
              onClick={umschalten}
              onMouseEnter={() => setUeber("konto")}
              onMouseLeave={() => setUeber(null)}
              className={kontoKnopf}
            >
              Konto
              <motion.span
                aria-hidden
                animate={{ rotate: offen ? 180 : 0 }}
                transition={{ duration: dauer.fast, ease: kurve.standard }}
                className="flex"
              >
                <ChevronDown size={16} />
              </motion.span>
              {markiert === "konto" && strich}
            </button>
          ) : (
            <Link href="/anmelden" className={`${pille} shrink-0`}>
              Anmelden
            </Link>
          )}

          <button
            ref={menueRef}
            type="button"
            aria-label={offen ? "Menü schließen" : "Menü öffnen"}
            aria-expanded={offen}
            aria-controls={offen ? "konto-panel" : undefined}
            onClick={umschalten}
            className="flex min-h-11 min-w-11 shrink-0 items-center justify-center text-ink md:hidden"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={offen ? "zu" : "auf"}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: dauer.fast, ease: kurve.standard }}
                className="flex"
              >
                {offen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </LayoutGroup>

      {/* Das Panel hängt am Header (Handy) bzw. am Kasten im Header (ab 768 px), nicht an dieser Navigation. */}
      <AnimatePresence>
        {offen && (
          <motion.div
            ref={panelRef}
            id="konto-panel"
            key="panel"
            onBlur={(e) => {
              // Verlässt der Fokus per Tab das Panel, schließt es; ein Klick daneben wird oben abgefangen.
              if (e.relatedTarget && !istDrin(e.relatedTarget as Node)) setOffenBei(null);
            }}
            initial={{ opacity: 0, y: -8, rotate: breit ? -1.5 : 0 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: -8, transition: { duration: dauer.fast, ease: kurve.exit } }}
            transition={uebergang}
            style={{ transformOrigin: "top center" }}
            className={`absolute inset-x-0 top-full z-30 border-b border-border bg-raised shadow-1 md:inset-x-auto md:right-4 md:mt-3 md:w-72 md:border md:shadow-2 ${
              nutzer ? "" : "md:hidden"
            }`}
          >
            {/* Die Nadel des Zettels (nur ab 768 px). */}
            <span aria-hidden className="absolute -top-1.5 right-8 hidden size-3 border border-border bg-signal md:block" />
            <ul className="mx-auto max-w-5xl px-4 py-2 md:max-w-none md:p-2">
              <motion.li {...eintrag(0)} className="md:hidden">
                <Link
                  href="/#gegenstaende"
                  aria-current={pfad === "/" ? "page" : undefined}
                  className={panelLink}
                >
                  Gegenstände
                </Link>
              </motion.li>
              {nutzer && (
                <>
                  <motion.li {...eintrag(1)} className="break-words border-t border-border px-2 py-2 text-sm text-muted md:border-t-0">
                    Angemeldet als <span className="font-medium text-ink">{nutzer.email}</span>
                  </motion.li>
                  {kontoLinks.map((l, i) => (
                    <motion.li key={l.href} {...eintrag(i + 2)} className="border-t border-border">
                      <Link href={l.href} aria-current={pfad === l.href ? "page" : undefined} className={panelLink}>
                        {l.name}
                        {l.href === "/anfragen-an-mich" && zahl > 0 && (
                          <span className={`${plakette} ml-auto bg-signal px-2 text-on-signal`}>
                            {zahl}
                            <span className="sr-only"> offen</span>
                          </span>
                        )}
                      </Link>
                    </motion.li>
                  ))}
                  <motion.li {...eintrag(kontoLinks.length + 2)} className="border-t border-border">
                    <form action={abmelden}>
                      <button
                        type="submit"
                        className="flex min-h-11 w-full items-center border-l-[3px] border-transparent px-2 text-base text-muted hover:bg-bg hover:text-ink"
                      >
                        Abmelden
                      </button>
                    </form>
                  </motion.li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
