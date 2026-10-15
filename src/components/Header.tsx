import HeaderKante from "@/components/HeaderKante";
import Hauptnavigation from "@/components/Hauptnavigation";
import Logo from "@/components/Logo";
import { ladeHinweisAufAnfragen } from "@/lib/anfragen";
import { ladeNutzer, type Nutzer } from "@/lib/auth";

export default async function Header() {
  const nutzer = await ladeNutzer();
  const hinweis = nutzer ? await ladeHinweisOhneAbsturz(nutzer) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-raised">
      {/* Ab 768 px ist dieser Kasten der Bezugspunkt für den Konto-Zettel (rechtsbündig); am Handy ist es der ganze Header. */}
      <div className="mx-auto flex max-w-5xl items-center gap-2 px-4 py-2 md:relative">
        <Logo />
        <Hauptnavigation nutzer={nutzer ? { id: nutzer.id, email: nutzer.email } : null} hinweis={hinweis} />
      </div>
      <HeaderKante />
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
