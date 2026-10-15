import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import GegenstandKarte from "@/components/GegenstandKarte";
import StatusChip from "@/components/StatusChip";
import { hinweisFlaeche } from "@/components/stile";
import { ladeMeineAnfragen } from "@/lib/anfragen";
import { ladeNutzer } from "@/lib/auth";

export const metadata: Metadata = { title: "Meine Anfragen" };

export default async function MeineAnfragen() {
  // Der Proxy leitet schon um; diese Prüfung ist die zweite Absicherung.
  const nutzer = await ladeNutzer();
  if (!nutzer) redirect("/anmelden?weiter=/meine-anfragen");

  const angefragt = await ladeMeineAnfragen(nutzer);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <h1 className="mb-2 text-3xl">Meine Anfragen</h1>
      {angefragt.length > 0 ? (
        <>
          <p className="mb-6 text-muted">Die neueste Anfrage steht oben.</p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {angefragt.map(({ gegenstand, status }, index) => (
              <li key={gegenstand.id}>
                <GegenstandKarte
                  gegenstand={gegenstand}
                  vorladen={index === 0}
                  ueberschrift="h2"
                  zusatz={
                    <p>
                      <StatusChip status={status} />
                    </p>
                  }
                />
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p className={`${hinweisFlaeche} mt-4 p-8 text-center text-muted`}>
          Du hast noch nichts angefragt.{" "}
          <Link href="/#gegenstaende" className="font-medium text-ink underline underline-offset-4">
            Stöbere in der Liste
          </Link>
        </p>
      )}
    </main>
  );
}
