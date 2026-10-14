import Link from "next/link";
import { abmelden } from "@/app/anmelden/actions";
import AnfragenHinweis from "@/components/AnfragenHinweis";
import { ladeHinweisAufAnfragen } from "@/lib/anfragen";
import { ladeNutzer, type Nutzer } from "@/lib/auth";

export default async function Header() {
  const nutzer = await ladeNutzer();
  const hinweis = nutzer ? await ladeHinweisOhneAbsturz(nutzer) : null;

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2 font-semibold">
          <span className="inline-block h-3 w-3 rounded-full bg-accent" />
          Leihbar
        </Link>
        <nav aria-label="Hauptnavigation" className="flex min-w-0 items-center gap-4 text-sm text-muted">
          {/* Am Handy ist kein Platz: Das Logo führt ebenfalls zur Liste. */}
          <Link href="/#gegenstaende" className="hidden min-h-11 items-center hover:text-foreground sm:flex">
            Gegenstände
          </Link>
          <Link href="/anbieten" className="flex min-h-11 items-center hover:text-foreground">
            Anbieten
          </Link>
          {nutzer ? (
            <>
              <Link href="/meine-gegenstaende" className="flex min-h-11 shrink-0 items-center hover:text-foreground">
                Meine<span className="hidden sm:inline">&nbsp;Gegenstände</span>
              </Link>
              {hinweis && (
                <AnfragenHinweis nutzerId={nutzer.id} gegenstandIds={hinweis.gegenstandIds} anzahl={hinweis.anzahl} />
              )}
              {/* Lange Adressen werden mit „…“ gekürzt, damit der Header einzeilig bleibt. */}
              <span className="min-w-0 truncate" title={nutzer.email}>
                <span className="sr-only">Angemeldet als </span>
                {nutzer.email}
              </span>
              <form action={abmelden} className="shrink-0">
                <button type="submit" className="flex min-h-11 items-center hover:text-foreground">
                  Abmelden
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/anmelden"
              className="flex min-h-11 shrink-0 items-center rounded-full border border-border px-3 font-medium text-foreground hover:bg-background"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

/** Klappt das Zählen nicht, fehlt nur der Hinweis – der Header soll keine Seite zum Absturz bringen. */
async function ladeHinweisOhneAbsturz(nutzer: Nutzer) {
  try {
    return await ladeHinweisAufAnfragen(nutzer);
  } catch (fehler) {
    console.error(fehler);
    return null;
  }
}
