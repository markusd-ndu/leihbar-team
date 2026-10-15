import Image from "next/image";
import Link from "next/link";
import Hauptnavigation from "@/components/Hauptnavigation";
import { ladeHinweisAufAnfragen } from "@/lib/anfragen";
import { ladeNutzer, type Nutzer } from "@/lib/auth";

export default async function Header() {
  const nutzer = await ladeNutzer();
  const hinweis = nutzer ? await ladeHinweisOhneAbsturz(nutzer) : null;

  return (
    <header className="relative border-b border-border bg-raised">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-2">
        <Link href="/" className="flex min-h-11 min-w-11 shrink-0 items-center justify-center sm:justify-start">
          {/* Am Handy ist kein Platz für die Wortmarke: dort das quadratische Icon. */}
          <Image src="/marke/icon-192.png" alt="Leihbar" width={32} height={32} sizes="32px" preload className="sm:hidden" />
          {/* Die dunkle Wortmarke für helles Papier, die helle für den dunklen Modus. */}
          <Image
            src="/marke/leihbar-wortmarke.png"
            alt="Leihbar"
            width={148}
            height={24}
            sizes="148px"
            className="hidden h-6 w-auto sm:block dark:sm:hidden"
          />
          <Image
            src="/marke/leihbar-wortmarke-nacht.png"
            alt="Leihbar"
            width={148}
            height={24}
            sizes="148px"
            className="hidden h-6 w-auto dark:sm:block"
          />
        </Link>
        <Hauptnavigation nutzer={nutzer ? { id: nutzer.id, email: nutzer.email } : null} hinweis={hinweis} />
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
