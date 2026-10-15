import { Search } from "lucide-react";
import { feld, knopf } from "@/components/stile";
import type { Kategorie } from "@/data/gegenstaende";

type Props = {
  suche: string | null;
  kategorie: Kategorie | null;
};

// Ein normales Formular ohne JavaScript: „Suchen“ lädt die Startseite mit /?q=… neu.
// Die gewählte Kategorie reist als verstecktes Feld mit, damit beide Filter zusammen gelten.
export default function SuchFeld({ suche, kategorie }: Props) {
  return (
    <form action="/" method="get" role="search" className="mb-4 flex gap-2">
      {kategorie && <input type="hidden" name="kategorie" value={kategorie} />}
      <label htmlFor="suche" className="sr-only">
        Nach Titel suchen
      </label>
      <input
        id="suche"
        type="search"
        name="q"
        defaultValue={suche ?? ""}
        maxLength={100}
        placeholder="Titel suchen, z. B. Zelt"
        className={`${feld} min-w-0 flex-1 px-4`}
      />
      <button
        type="submit"
        className={`${knopf("haupt")} shrink-0`}
      >
        <Search aria-hidden="true" size={18} />
        Suchen
      </button>
    </form>
  );
}
