import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ladeNutzer } from "@/lib/auth";
import { preisText } from "@/lib/format";
import { ladeMeineGegenstaende } from "@/lib/items";

export const metadata: Metadata = { title: "Meine Gegenstände" };

// Bewusst schlicht: Die Seite funktioniert, gestaltet wird sie in LEI-7 mit Claude Design.
export default async function MeineGegenstaende() {
  // Der Proxy leitet schon um; diese Prüfung ist die zweite Absicherung.
  const nutzer = await ladeNutzer();
  if (!nutzer) redirect("/anmelden?weiter=/meine-gegenstaende");

  const gegenstaende = await ladeMeineGegenstaende(nutzer);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold">Meine Gegenstände</h1>
      {gegenstaende.length > 0 ? (
        <ul className="divide-y divide-border border-y border-border">
          {gegenstaende.map((g) => (
            <li key={g.id} className="flex min-h-11 flex-wrap items-center justify-between gap-x-4 py-2">
              <Link href={`/gegenstaende/${g.id}`} className="underline">
                {g.titel}
              </Link>
              <span className="text-sm text-muted">
                {preisText(g.preisProTag)} · {g.offeneAnfragen === 1 ? "1 offene Anfrage" : `${g.offeneAnfragen} offene Anfragen`}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">
          Du bietest noch nichts an.{" "}
          <Link href="/anbieten" className="underline">
            Etwas anbieten
          </Link>
        </p>
      )}
    </main>
  );
}
