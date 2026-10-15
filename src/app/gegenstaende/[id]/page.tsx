import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Clock, MapPin, User } from "lucide-react";
import AnfrageButton from "@/components/AnfrageButton";
import ErhalteneAnfragen from "@/components/ErhalteneAnfragen";
import { plakette } from "@/components/stile";
import TeilenButton from "@/components/TeilenButton";
import { hatAngefragt, ladeAnzahlAnfragen, ladeErhalteneAnfragen } from "@/lib/anfragen";
import { ladeNutzer } from "@/lib/auth";
import { ladeGegenstand } from "@/lib/items";
import { preisTeile, preisText } from "@/lib/format";

export async function generateMetadata({
  params,
}: PageProps<"/gegenstaende/[id]">): Promise<Metadata> {
  const { id } = await params;
  const gegenstand = await ladeGegenstand(id);
  if (!gegenstand) return { title: "Nicht gefunden" };

  // Das Vorschaubild kommt aus opengraph-image.tsx in diesem Ordner.
  const beschreibung = `${preisText(gegenstand.preisProTag)} · ${gegenstand.beschreibung}`;
  return {
    title: gegenstand.titel,
    description: beschreibung,
    openGraph: {
      title: `${gegenstand.titel} – Leihbar`,
      description: beschreibung,
      url: `/gegenstaende/${id}`,
      type: "website",
    },
  };
}

export default async function GegenstandSeite({ params }: PageProps<"/gegenstaende/[id]">) {
  const { id } = await params;
  const gegenstand = await ladeGegenstand(id);
  if (!gegenstand) notFound();
  const { betrag, einheit } = preisTeile(gegenstand.preisProTag);
  const nutzer = await ladeNutzer();
  const istBesitzerin = nutzer !== null && gegenstand.besitzerId === nutzer.id;
  const [anzahl, angefragt, erhalten] = await Promise.all([
    ladeAnzahlAnfragen(id),
    hatAngefragt(id, nutzer),
    istBesitzerin ? ladeErhalteneAnfragen(id) : null,
  ]);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
      <Link
        href="/#gegenstaende"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink hover:underline hover:underline-offset-4"
      >
        <ArrowLeft size={18} aria-hidden />
        Zurück zur Liste
      </Link>

      {/* Am Handy stehen Titel, Preis und Button über dem Bild – so ist der Button ohne Scrollen sichtbar.
          Ab 768 px steht die Karte rechts und bleibt beim Scrollen im Bild. */}
      <article className="grid gap-6 md:grid-cols-[minmax(0,1fr)_20rem] md:items-start md:gap-x-8">
        <div className="border border-border bg-raised p-5 shadow-1 md:sticky md:top-4 md:col-start-2 md:row-span-2 md:row-start-1">
          <div className="flex items-center justify-between gap-3">
            {gegenstand.verfuegbar ? (
              <span className={`${plakette} bg-raised text-ink`}>
                <Check size={16} aria-hidden className="text-success" />
                Verfügbar
              </span>
            ) : (
              <span className={`${plakette} border-dashed bg-raised text-muted`}>
                <Clock size={16} aria-hidden />
                Gerade verliehen
              </span>
            )}
            <TeilenButton titel={gegenstand.titel} />
          </div>
          <h1 className="mt-4 text-3xl">{gegenstand.titel}</h1>
          <p className="mb-5 mt-3 flex flex-wrap items-baseline gap-x-2">
            <span className="font-display text-4xl">{betrag}</span>
            {einheit && <span className="text-muted">{einheit}</span>}
          </p>

          <AnfrageButton gegenstandId={id} anzahl={anzahl} angefragt={angefragt} angemeldet={nutzer !== null} />
        </div>

        <div className="relative aspect-[4/3] overflow-hidden border border-border bg-highlight shadow-1 md:col-start-1 md:row-start-1">
          {gegenstand.bild ? (
            <Image
              src={gegenstand.bild}
              alt={gegenstand.titel}
              fill
              sizes="(min-width: 1024px) 640px, (min-width: 768px) 60vw, 100vw"
              className="object-cover"
              preload
            />
          ) : (
            <div role="img" aria-label={`Kein Bild für ${gegenstand.titel}`} className="flex h-full flex-col items-center justify-center gap-3 text-sm text-muted">
              {/* Das Leihbar-Zeichen als Platzhalter: Tinte auf Papier, im dunklen Modus die weiße Fassung. */}
              <Image src="/marke/leihbar-bildmarke.svg" alt="" width={64} height={64} unoptimized className="dark:hidden" />
              <Image src="/marke/leihbar-bildmarke-weiss.svg" alt="" width={64} height={64} unoptimized className="hidden dark:block" />
              Kein Bild
            </div>
          )}
          <span className={`${plakette} absolute left-3 top-3 bg-signal text-on-signal`}>
            <span className="sr-only">Kategorie: </span>
            {gegenstand.kategorie}
          </span>
        </div>

        <div className="space-y-6 md:col-start-1 md:row-start-2">
          {erhalten && <ErhalteneAnfragen gegenstandId={id} anfragen={erhalten} />}

          <p className="max-w-prose leading-relaxed">{gegenstand.beschreibung}</p>

          <dl className="grid gap-4 sm:grid-cols-2">
            <div className="border border-border bg-raised p-4">
              <dt className="flex items-center gap-2 text-sm text-muted">
                <MapPin size={18} aria-hidden />
                Ort:
              </dt>
              <dd className="mt-1 font-medium">{gegenstand.ort}</dd>
            </div>
            <div className="border border-border bg-raised p-4">
              <dt className="flex items-center gap-2 text-sm text-muted">
                <User size={18} aria-hidden />
                Verleiht:
              </dt>
              <dd className="mt-1 font-medium">{gegenstand.besitzer}</dd>
            </div>
          </dl>
        </div>
      </article>
    </main>
  );
}
