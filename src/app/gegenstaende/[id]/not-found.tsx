import Link from "next/link";

export default function GegenstandNichtGefunden() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 text-center">
      <h1 className="mb-3 text-2xl font-bold">Diesen Gegenstand gibt es nicht.</h1>
      <p className="mb-6 text-muted">
        Vielleicht hat sich in der Adresse ein Tippfehler eingeschlichen, oder der Gegenstand wurde
        entfernt.
      </p>
      <Link
        href="/#gegenstaende"
        className="inline-flex min-h-11 items-center rounded-xl bg-accent px-5 font-medium text-on-accent hover:opacity-90"
      >
        Zur Liste
      </Link>
    </main>
  );
}
