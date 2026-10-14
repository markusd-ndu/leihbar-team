"use client";

import { useActionState } from "react";
import { kategorien } from "@/data/gegenstaende";
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

  return (
    // noValidate: die Prüfung läuft auf dem Server, damit alle Meldungen ganze deutsche Sätze sind.
    // key: nach einem Fehlversuch bleibt das Eingegebene stehen.
    <form
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
            defaultValue={werte.titel}
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
