"use client";

import { useOptimistic, useState, useTransition, type FormEvent } from "react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import { Check, CircleAlert } from "lucide-react";
import { motion, useAnimationControls } from "motion/react";
import { anfrageUmschalten } from "@/app/gegenstaende/[id]/actions";
import AnfragenZaehler from "@/components/AnfragenZaehler";
import { fehlerSatz, knopf } from "@/components/stile";
import { optimistischerStand, type AnfrageAktion, type AnfrageStand } from "@/lib/anfrage-optimistisch";
import { dauer, kurve } from "@/lib/bewegung";

type Props = {
  gegenstandId: string;
  anzahl: number;
  angefragt: boolean;
  angemeldet: boolean;
};

const breit = "w-full";

const verbindungsFehler = "Die Anfrage konnte nicht gespeichert werden. Bitte prüf deine Verbindung und versuch es gleich noch einmal.";

export default function AnfrageButton({ gegenstandId, anzahl, angefragt, angemeldet }: Props) {
  const [laeuft, starte] = useTransition();
  // Zeigt sofort den neuen Stand; sobald die Antwort da ist (oder das Speichern scheitert), gilt wieder der echte.
  const [stand, setzeVorlaeufig] = useOptimistic<AnfrageStand, AnfrageAktion>({ angefragt, anzahl }, optimistischerStand);
  const [fehler, setFehler] = useState<string>();
  const [klick, setKlick] = useState(0);
  const schuetteln = useAnimationControls();

  function absenden(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (laeuft) return;
    const aktion: AnfrageAktion = stand.angefragt ? "zurueckziehen" : "anfragen";
    setFehler(undefined);
    setKlick((k) => k + 1);
    starte(async () => {
      setzeVorlaeufig(aktion);
      const daten = new FormData();
      daten.set("aktion", aktion);
      let meldung: string | undefined;
      try {
        meldung = (await anfrageUmschalten(gegenstandId, {}, daten)).fehler;
      } catch (e) {
        // Läuft die Sitzung ab, leitet die Action zur Anmeldung weiter (das ist ein Fehler, den Next selbst
        // behandelt): Dann keine Fehlermeldung zeigen, die Weiterleitung übernimmt Next.
        try {
          unstable_rethrow(e);
        } catch {
          return;
        }
        meldung = verbindungsFehler;
      }
      if (meldung) {
        setFehler(meldung);
        // Einmal kurz schütteln; Motion schaltet das bei „Bewegung reduzieren“ ab.
        void schuetteln.start({ x: [0, -6, 6, -4, 4, 0], transition: { duration: dauer.slow, ease: kurve.standard } });
      }
    });
  }

  return (
    <div className="flex flex-col">
      {/* Zeile mit Linie über die ganze Karte: -mx-5 gleicht das p-5 der Karte in page.tsx aus.
          aria-atomic: Der Screenreader sagt „Anfragen“ und die Zahl zusammen an. */}
      <p
        aria-live="polite"
        aria-atomic="true"
        className="-mx-5 mb-4 flex items-baseline justify-between border-t border-border px-5 pt-3"
      >
        <span className="text-sm text-muted">Anfragen</span>
        <AnfragenZaehler
          gegenstandId={gegenstandId}
          anzahl={anzahl}
          aenderung={stand.anzahl - anzahl}
          klick={klick}
          className="font-display text-2xl text-ink tabular-nums"
        />
      </p>

      {angemeldet ? (
        <motion.form onSubmit={absenden} animate={schuetteln}>
          <button
            type="submit"
            aria-pressed={stand.angefragt}
            className={`${knopf(stand.angefragt ? "zweit" : "haupt", { flach: true, hoch: true })} ${breit}`}
          >
            {stand.angefragt ? (
              <>
                Angefragt <Check size={18} aria-hidden />
              </>
            ) : (
              "Ausleihen anfragen"
            )}
          </button>
        </motion.form>
      ) : (
        <Link
          href={`/anmelden?weiter=/gegenstaende/${encodeURIComponent(gegenstandId)}`}
          className={`${knopf("haupt", { flach: true, hoch: true })} ${breit}`}
        >
          Ausleihen anfragen
        </Link>
      )}

      {stand.angefragt && <p className="mt-3 text-sm text-muted">Tipp erneut, um zurückzuziehen.</p>}

      {fehler && (
        <p role="alert" className={`${fehlerSatz} mt-3`}>
          <CircleAlert size={18} aria-hidden className="mt-1 shrink-0" />
          {fehler}
        </p>
      )}
    </div>
  );
}
