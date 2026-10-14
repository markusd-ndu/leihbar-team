import Link from "next/link";
import { kategorien, type Kategorie } from "@/data/gegenstaende";

type Props = {
  aktiv: Kategorie | null; // null = „Alle“
};

// Der Filter steckt in der Adresse (/?kategorie=Mode): teilbar, und „Zurück“ im Browser funktioniert.
export default function KategorieFilter({ aktiv }: Props) {
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
                href={kategorie ? { pathname: "/", query: { kategorie } } : "/"}
                scroll={false}
                aria-current={istAktiv ? "true" : undefined}
                className={`flex min-h-11 items-center rounded-full border px-4 text-sm font-medium transition ${
                  istAktiv
                    ? "border-accent bg-accent text-on-accent"
                    : "border-border bg-card text-foreground hover:border-foreground"
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
