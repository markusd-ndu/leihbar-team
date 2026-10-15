import { Search } from "lucide-react";
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
        className="min-h-11 min-w-0 flex-1 rounded-xl border border-border bg-card px-4 text-base text-foreground placeholder:text-muted"
      />
      <button
        type="submit"
        className="flex min-h-11 shrink-0 items-center gap-2 rounded-xl bg-accent px-4 font-medium text-on-accent transition hover:opacity-90"
      >
        <Search aria-hidden="true" className="size-5" />
        Suchen
      </button>
    </form>
  );
}
