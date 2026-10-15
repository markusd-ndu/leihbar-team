import Link from "next/link";
import { knopf } from "@/components/stile";

export default function GegenstandNichtGefunden() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center">
      <h1 className="mb-3 text-2xl">Diesen Gegenstand gibt es nicht.</h1>
      <p className="mb-6 text-muted">
        Vielleicht hat sich in der Adresse ein Tippfehler eingeschlichen, oder der Gegenstand wurde
        entfernt.
      </p>
      <Link href="/#gegenstaende" className={knopf("haupt")}>
        Zur Liste
      </Link>
    </main>
  );
}
