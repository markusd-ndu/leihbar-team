import Link from "next/link";
import ErfolgsMeldung from "@/components/ErfolgsMeldung";
import FeatureKarten from "@/components/FeatureKarten";
import GegenstandListe from "@/components/GegenstandListe";
import KategorieFilter from "@/components/KategorieFilter";
import SuchFeld from "@/components/SuchFeld";
import { knopf } from "@/components/stile";
import { kategorien } from "@/data/gegenstaende";
import { neuerEigenerGegenstand } from "@/lib/angeboten";
import { ladeNutzer } from "@/lib/auth";
import { ladeVerfuegbare } from "@/lib/items";

export default async function Home({ searchParams }: PageProps<"/">) {
  const { kategorie, q, angeboten } = await searchParams;
  // Unbekannte oder fehlende Kategorie in der Adresse → „Alle“.
  const aktiveKategorie = kategorien.find((k) => k === kategorie) ?? null;
  // Leeres Suchwort (oder nur Leerzeichen) in der Adresse → keine Suche.
  const suche = (typeof q === "string" ? q.trim().slice(0, 100) : "") || null;

  const sichtbar = await ladeVerfuegbare(aktiveKategorie, suche);
  // Nur ein eigener Gegenstand aus der Liste bekommt Meldung und Hervorhebung –
  // sonst könnte ein selbst gebauter Link ein falsches „Geschafft“ zeigen.
  const nutzer = await ladeNutzer();
  const neu = neuerEigenerGegenstand(angeboten, sichtbar, nutzer?.id ?? null);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-12 sm:block">
      <section className="mb-14">
        <p className="mb-3 inline-block rounded-full bg-highlight px-3 py-1 text-sm font-medium text-ink">
          NDU · Wintersemester 2026
        </p>
        <h1 className="mb-4 max-w-2xl text-4xl">
          Leihen statt kaufen.
        </h1>
        <p className="mb-8 max-w-xl text-lg leading-normal text-muted">
          Abendkleid für den Ball, Akkuschrauber fürs WG-Regal, Zelt fürs
          Festival – am Campus hat es schon jemand. Anbieten, finden, anfragen.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#gegenstaende" className={knopf("haupt")}>
            Gegenstände ansehen
          </a>
          <Link href="/anbieten" className={knopf("rahmen")}>
            Gegenstand anbieten
          </Link>
        </div>
      </section>

      <FeatureKarten />

      <section id="gegenstaende" aria-labelledby="gegenstaende-titel" className="scroll-mt-4">
        <h2 id="gegenstaende-titel" className="mb-4 font-display text-2xl font-normal">
          Gerade ausleihbar
        </h2>
        <SuchFeld suche={suche} kategorie={aktiveKategorie} />
        <KategorieFilter aktiv={aktiveKategorie} suche={suche} />
        <GegenstandListe gegenstaende={sichtbar} suche={suche} kategorie={aktiveKategorie} hervorheben={neu} />
      </section>
      {neu && <ErfolgsMeldung key={neu} text="Geschafft: Dein Gegenstand ist in der Liste." />}
    </main>
  );
}
