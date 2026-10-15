import { Hand, Recycle, Search } from "lucide-react";
import Link from "next/link";
import FeatureCard from "@/components/FeatureCard";
import GegenstandKarte from "@/components/GegenstandKarte";
import KategorieFilter from "@/components/KategorieFilter";
import { kategorien } from "@/data/gegenstaende";
import { ladeVerfuegbare } from "@/lib/items";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { kategorie } = await searchParams;
  // Unbekannte oder fehlende Kategorie in der Adresse → „Alle“.
  const aktiveKategorie = kategorien.find((k) => k === kategorie) ?? null;

  const sichtbar = await ladeVerfuegbare(aktiveKategorie);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:block">
      <section className="mb-14">
        <p className="mb-3 inline-block rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-foreground">
          NDU · Wintersemester 2026
        </p>
        <h1 className="mb-4 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
          Leihen statt kaufen.
        </h1>
        <p className="mb-8 max-w-xl text-lg text-muted">
          Abendkleid für den Ball, Akkuschrauber fürs WG-Regal, Zelt fürs
          Festival – am Campus hat es schon jemand. Anbieten, finden, anfragen.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="#gegenstaende"
            className="rounded-xl bg-accent px-5 py-3 font-medium text-on-accent shadow-sm transition hover:opacity-90"
          >
            Gegenstände ansehen
          </a>
          <Link
            href="/anbieten"
            className="rounded-xl border border-border px-5 py-3 font-medium transition hover:border-foreground"
          >
            Gegenstand anbieten
          </Link>
          <Link
            href="/meine-anfragen"
            className="rounded-xl border border-border px-5 py-3 font-medium transition hover:border-foreground"
          >
            Meine Anfragen
          </Link>
        </div>
      </section>

      <section aria-label="Was Leihbar kann" className="order-last mb-14 grid gap-4 sm:order-none sm:grid-cols-3">
        <FeatureCard
          icon={Search}
          titel="Alles an einem Ort"
          text="Was andere am Campus verleihen – von Mode über Möbel bis Technik, ohne Herumfragen in Chats."
        />
        <FeatureCard
          icon={Hand}
          titel="Mit einem Klick anfragen"
          text="Besitzer*innen sehen sofort, wer etwas ausleihen möchte. Kein Hin und Her mehr."
        />
        <FeatureCard
          icon={Recycle}
          titel="Leihen statt kaufen"
          text="Für einmal kaufen lohnt sich selten. Leihen spart Geld und Platz in der WG."
        />
      </section>

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel" className="scroll-mt-4">
        <h2 id="gegenstaende-titel" className="mb-4 text-2xl font-semibold">
          Gerade ausleihbar
        </h2>
        <KategorieFilter aktiv={aktiveKategorie} />
        {sichtbar.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sichtbar.map((gegenstand, index) => (
              <li key={gegenstand.id}>
                <GegenstandKarte gegenstand={gegenstand} vorladen={index === 0} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted">
            {aktiveKategorie ? "In dieser Kategorie ist gerade nichts frei." : "Gerade ist nichts frei."}{" "}
            <Link
              href={aktiveKategorie ? "/" : "/anbieten"}
              scroll={false}
              className="font-medium text-foreground underline"
            >
              {aktiveKategorie ? "Alle Gegenstände ansehen" : "Biete den ersten Gegenstand an"}
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
