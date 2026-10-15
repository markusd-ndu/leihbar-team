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
          {/* Am Handy ist kein Platz für die ganze Schrift: dort nur die Bildmarke (SVG, deshalb ohne Optimierung). */}
          <Image
            src="/marke/leihbar-bildmarke.svg"
            alt="Leihbar"
            width={32}
            height={32}
            unoptimized
            className="sm:hidden dark:hidden"
          />
          <Image
            src="/marke/leihbar-bildmarke-weiss.svg"
            alt="Leihbar"
            width={32}
            height={32}
            unoptimized
            className="hidden dark:block dark:sm:hidden"
          />
          {/* Das Logo in Tinte für helles Papier, die weiße Fassung für den dunklen Modus. */}
          <Image
            src="/marke/leihbar-logo.png"
            alt="Leihbar"
            width={174}
            height={24}
            sizes="174px"
            preload
            className="hidden h-6 w-auto sm:block dark:sm:hidden"
          />
          <Image
            src="/marke/leihbar-logo-weiss.png"
            alt="Leihbar"
            width={174}
            height={24}
            sizes="174px"
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
