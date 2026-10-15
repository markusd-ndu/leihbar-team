"use client";

import { useActionState } from "react";
import { CircleAlert, LoaderCircle } from "lucide-react";
import { anmelden, registrieren, type AnmeldeZustand } from "@/app/anmelden/actions";
import { feld, fehlerKasten, fehlerSatz, hinweisFlaeche, knopf } from "@/components/stile";

const start: AnmeldeZustand = { fehler: {}, email: "" };

type Props = {
  art: "anmelden" | "registrieren";
  /** Wohin es nach dem Erfolg geht (nur Pfade innerhalb der App). */
  weiter: string;
};

export default function AnmeldeFormular({ art, weiter }: Props) {
  const [zustand, formAction, laeuft] = useActionState(art === "anmelden" ? anmelden : registrieren, start);
  const { fehler, email, hinweis } = zustand;

  if (hinweis) {
    return (
      <p role="status" className={hinweisFlaeche}>
        {hinweis}
      </p>
    );
  }

  return (
    // noValidate: die Prüfung läuft auf dem Server, damit alle Meldungen ganze deutsche Sätze sind.
    <form action={formAction} noValidate key={email} className="flex flex-col gap-5">
      <input type="hidden" name="weiter" value={weiter} />

      {fehler.allgemein && (
        <p role="alert" className={fehlerKasten}>
          <CircleAlert size={18} aria-hidden className="mt-1 shrink-0" />
          {fehler.allgemein}
        </p>
      )}

      <div className="flex flex-col gap-1">
        <label htmlFor="feld-email" className="font-medium">
          E-Mail
        </label>
        <input
          id="feld-email"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={email}
          readOnly={laeuft}
          aria-busy={laeuft}
          aria-invalid={Boolean(fehler.email)}
          aria-describedby={fehler.email ? "feld-email-fehler" : undefined}
          className={feld}
        />
        {fehler.email && (
          <p id="feld-email-fehler" className={fehlerSatz}>
            <CircleAlert size={18} aria-hidden className="mt-1 shrink-0" />
            {fehler.email}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="feld-passwort" className="font-medium">
          Passwort
        </label>
        {art === "registrieren" && (
          <p id="feld-passwort-hinweis" className="text-sm text-muted">
            Mindestens 8 Zeichen.
          </p>
        )}
        <input
          id="feld-passwort"
          name="passwort"
          type="password"
          autoComplete={art === "anmelden" ? "current-password" : "new-password"}
          readOnly={laeuft}
          aria-busy={laeuft}
          aria-invalid={Boolean(fehler.passwort)}
          aria-describedby={
            [art === "registrieren" ? "feld-passwort-hinweis" : null, fehler.passwort ? "feld-passwort-fehler" : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={feld}
        />
        {fehler.passwort && (
          <p id="feld-passwort-fehler" className={fehlerSatz}>
            <CircleAlert size={18} aria-hidden className="mt-1 shrink-0" />
            {fehler.passwort}
          </p>
        )}
      </div>

      {/* aria-busy statt disabled: der Knopf bleibt schwarz und zeigt den drehenden Kreis; ein zweiter Klick tut nichts. */}
      <button
        type="submit"
        aria-busy={laeuft}
        onClick={(e) => laeuft && e.preventDefault()}
        className={knopf("haupt")}
      >
        {laeuft && <LoaderCircle size={18} aria-hidden className="animate-spin" />}
        {art === "anmelden"
          ? laeuft
            ? "Wird angemeldet …"
            : "Anmelden"
          : laeuft
            ? "Konto wird angelegt …"
            : "Konto anlegen"}
      </button>
    </form>
  );
}
