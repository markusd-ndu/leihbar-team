"use client";

import { useActionState } from "react";
import { anmelden, registrieren, type AnmeldeZustand } from "@/app/anmelden/actions";

const start: AnmeldeZustand = { fehler: {}, email: "" };

const feldKlasse =
  "min-h-11 w-full rounded-xl border border-border bg-card px-3 py-2 text-base aria-[invalid=true]:border-danger";

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
      <p role="status" className="rounded-xl border border-border bg-card px-4 py-3">
        {hinweis}
      </p>
    );
  }

  return (
    // noValidate: die Prüfung läuft auf dem Server, damit alle Meldungen ganze deutsche Sätze sind.
    <form action={formAction} noValidate key={email} className="flex flex-col gap-5">
      <input type="hidden" name="weiter" value={weiter} />

      {fehler.allgemein && (
        <p role="alert" className="rounded-xl border border-danger px-4 py-3 text-sm font-medium text-danger">
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
          aria-invalid={Boolean(fehler.email)}
          aria-describedby={fehler.email ? "feld-email-fehler" : undefined}
          className={feldKlasse}
        />
        {fehler.email && (
          <p id="feld-email-fehler" className="text-sm font-medium text-danger">
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
          aria-invalid={Boolean(fehler.passwort)}
          aria-describedby={
            [art === "registrieren" ? "feld-passwort-hinweis" : null, fehler.passwort ? "feld-passwort-fehler" : null]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={feldKlasse}
        />
        {fehler.passwort && (
          <p id="feld-passwort-fehler" className="text-sm font-medium text-danger">
            {fehler.passwort}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={laeuft}
        className="min-h-11 rounded-xl bg-accent px-5 font-medium text-on-accent shadow-sm transition hover:opacity-90 disabled:opacity-60"
      >
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
