import Link from "next/link";
import { kategorien, type Kategorie } from "@/data/gegenstaende";

type Props = {
  aktiv: Kategorie | null; // null = „Alle“
  suche?: string | null; // bleibt beim Wechsel der Kategorie erhalten
};

// Der Filter steckt in der Adresse (/?kategorie=Mode): teilbar, und „Zurück“ im Browser funktioniert.
export default function KategorieFilter({ aktiv, suche = null }: Props) {
  const optionen: { name: string; kategorie: Kategorie | null }[] = [
    { name: "Alle", kategorie: null },
    ...kategorien.map((k) => ({ name: k, kategorie: k })),
  ];

  return (
    <nav aria-label="Nach Kategorie filtern" className="mb-6">
      <ul className="flex flex-wrap gap-2">
        {optionen.map(({ name, kategorie }) => {
          const istAktiv = kategorie === aktiv;
          return (
            <li key={name}>
              <Link
                href={{
                  pathname: "/",
                  query: { ...(kategorie && { kategorie }), ...(suche && { q: suche }) },
                }}
                scroll={false}
                aria-current={istAktiv ? "true" : undefined}
                className={`flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition duration-(--duration-fast) ease-standard active:translate-y-0.5 ${
                  istAktiv
                    ? "border-action bg-action text-on-action"
                    : "border-border bg-raised text-ink hover:bg-bg hover:shadow-[inset_0_0_0_1px_var(--line)]"
                }`}
              >
                {name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
