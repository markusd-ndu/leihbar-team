"use client";

import { useActionState, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { kategorien } from "@/data/gegenstaende";
import { toene, type Ton } from "@/lib/beschreibung-vorschlag";
import { gegenstandAnbieten, type FormularZustand } from "@/app/anbieten/actions";

const start: FormularZustand = { fehler: {}, werte: {} };

const feldKlasse =
  "min-h-11 w-full rounded-xl border border-border bg-card px-3 py-2 text-base aria-[invalid=true]:border-danger";

type FeldProps = {
  name: string;
  label: string;
  fehler?: string;
  hinweis?: string;
  children: (ids: { id: string; beschreibtDurch: string | undefined; ungueltig: boolean }) => React.ReactNode;
};

function Feld({ name, label, fehler, hinweis, children }: FeldProps) {
  const id = `feld-${name}`;
  const beschreibtDurch = [hinweis ? `${id}-hinweis` : null, fehler ? `${id}-fehler` : null]
    .filter(Boolean)
    .join(" ") || undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      {hinweis && (
        <p id={`${id}-hinweis`} className="text-sm text-muted">
          {hinweis}
        </p>
      )}
      {children({ id, beschreibtDurch, ungueltig: Boolean(fehler) })}
      {fehler && (
        <p id={`${id}-fehler`} className="text-sm font-medium text-danger">
          {fehler}
        </p>
      )}
    </div>
  );
}

export default function AnbietenFormular() {
  const [zustand, formAction, laeuft] = useActionState(gegenstandAnbieten, start);
  const { fehler, werte } = zustand;
  // LEI-5: Den Titel braucht der Vorschlag-Button (deaktiviert, solange er leer ist); Kategorie, Ort und
  // Beschreibung liest bzw. setzt er direkt im Formular.
  const [titel, setTitel] = useState(werte.titel ?? "");
  const [ton, setTon] = useState<Ton>("freundlich");
  const [vorschlagLaeuft, setVorschlagLaeuft] = useState(false);
  const [vorschlagMeldung, setVorschlagMeldung] = useState("");
  const formular = useRef<HTMLFormElement>(null);

  async function beschreibungVorschlagen() {
    const f = formular.current;
    if (!f) return;
    const feld = (name: string) => (f.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | null)?.value ?? "";
    setVorschlagLaeuft(true);
    setVorschlagMeldung("");
    try {
      const antwort = await fetch("/api/beschreibung", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titel, kategorie: feld("kategorie"), ort: feld("ort"), ton }),
      });
      const daten = (await antwort.json().catch(() => ({}))) as { vorschlag?: string; fehler?: string };
      const beschreibung = f.elements.namedItem("beschreibung") as HTMLTextAreaElement | null;
      if (antwort.ok && daten.vorschlag && beschreibung) {
        beschreibung.value = daten.vorschlag;
        beschreibung.focus();
        setVorschlagMeldung("Vorschlag eingefügt – du kannst ihn noch ändern.");
      } else {
        setVorschlagMeldung(daten.fehler ?? "Der Vorschlag hat nicht geklappt. Probier es gleich noch einmal.");
      }
    } catch {
      setVorschlagMeldung("Keine Verbindung. Probier es gleich noch einmal.");
    } finally {
      setVorschlagLaeuft(false);
    }
  }

  return (
    // noValidate: die Prüfung läuft auf dem Server, damit alle Meldungen ganze deutsche Sätze sind.
    // key: nach einem Fehlversuch bleibt das Eingegebene stehen.
    <form
      ref={formular}
      action={formAction}
      noValidate
      key={JSON.stringify(werte)}
      className="flex flex-col gap-5"
    >
      {fehler.allgemein && (
        <p role="alert" className="rounded-xl border border-danger px-4 py-3 text-sm font-medium text-danger">
          {fehler.allgemein}
        </p>
      )}

      <Feld name="titel" label="Titel" fehler={fehler.titel}>
        {({ id, beschreibtDurch, ungueltig }) => (
          <input
            id={id}
            name="titel"
            type="text"
            value={titel}
            onChange={(e) => setTitel(e.target.value)}
            maxLength={200}
            aria-invalid={ungueltig}
            aria-describedby={beschreibtDurch}
            className={feldKlasse}
          />
        )}
      </Feld>

      <Feld name="kategorie" label="Kategorie" fehler={fehler.kategorie}>
        {({ id, beschreibtDurch, ungueltig }) => (
          <select
            id={id}
            name="kategorie"
            defaultValue={werte.kategorie ?? ""}
            aria-invalid={ungueltig}
            aria-describedby={beschreibtDurch}
            className={feldKlasse}
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {kategorien.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        )}
      </Feld>

      <Feld name="beschreibung" label="Beschreibung" fehler={fehler.beschreibung}>
        {({ id, beschreibtDurch, ungueltig }) => (
          <textarea
            id={id}
            name="beschreibung"
            rows={4}
            defaultValue={werte.beschreibung}
            aria-invalid={ungueltig}
            aria-describedby={beschreibtDurch}
            className={feldKlasse}
          />
        )}
      </Feld>
      <div className="-mt-3 flex flex-col items-start gap-2">
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Ton des Vorschlags</legend>
          <span aria-hidden="true" className="text-sm text-muted">Ton:</span>
          {toene.map((t) => (
            <label
              key={t}
              className="inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-border bg-card px-3 text-sm capitalize has-[:checked]:border-foreground has-[:checked]:font-medium has-[:focus-visible]:outline has-[:focus-visible]:outline-2"
            >
              <input
                type="radio"
                name="ton"
                value={t}
                checked={ton === t}
                onChange={() => setTon(t)}
                className="sr-only"
              />
              {t}
            </label>
          ))}
        </fieldset>
        <button
          type="button"
          onClick={beschreibungVorschlagen}
          disabled={!titel.trim() || vorschlagLaeuft}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium transition hover:border-foreground disabled:opacity-60"
        >
          <Sparkles size={18} />
          {vorschlagLaeuft ? "Vorschlag wird geschrieben …" : "Beschreibung vorschlagen"}
        </button>
        <p aria-live="polite" className="text-sm text-muted">
          {vorschlagMeldung || (titel.trim() ? "" : "Gib zuerst einen Titel ein, dann schlägt dir die KI eine Beschreibung vor.")}
        </p>
      </div>

      <Feld name="ort" label="Ort" fehler={fehler.ort}>
        {({ id, beschreibtDurch, ungueltig }) => (
          <input
            id={id}
            name="ort"
            type="text"
            defaultValue={werte.ort}
            aria-invalid={ungueltig}
            aria-describedby={beschreibtDurch}
            className={feldKlasse}
          />
        )}
      </Feld>

      <Feld name="preis" label="Preis pro Tag in Euro" hinweis="Schreib 0, wenn du ihn gratis verleihst." fehler={fehler.preis}>
        {({ id, beschreibtDurch, ungueltig }) => (
          <input
            id={id}
            name="preis"
            type="text"
            inputMode="decimal"
            defaultValue={werte.preis}
            aria-invalid={ungueltig}
            aria-describedby={beschreibtDurch}
            className={feldKlasse}
          />
        )}
      </Feld>

      <Feld name="besitzer" label="Dein Name" hinweis="So steht es bei „Verleiht:“." fehler={fehler.besitzer}>
        {({ id, beschreibtDurch, ungueltig }) => (
          <input
            id={id}
            name="besitzer"
            type="text"
            defaultValue={werte.besitzer}
            aria-invalid={ungueltig}
            aria-describedby={beschreibtDurch}
            className={feldKlasse}
          />
        )}
      </Feld>

      <button
        type="submit"
        disabled={laeuft}
        className="min-h-11 rounded-xl bg-accent px-5 font-medium text-on-accent shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
        {laeuft ? "Wird gespeichert …" : "Gegenstand anbieten"}
      </button>
    </form>
  );
}
