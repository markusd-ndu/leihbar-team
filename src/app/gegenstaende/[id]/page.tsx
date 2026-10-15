import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ImageOff, MapPin, User } from "lucide-react";
import AnfrageButton from "@/components/AnfrageButton";
import ErhalteneAnfragen from "@/components/ErhalteneAnfragen";
import TeilenButton from "@/components/TeilenButton";
import { hatAngefragt, ladeAnzahlAnfragen, ladeErhalteneAnfragen } from "@/lib/anfragen";
import { ladeNutzer } from "@/lib/auth";
import { ladeGegenstand } from "@/lib/items";
import { preisText } from "@/lib/format";

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
  const nutzer = await ladeNutzer();
  const istBesitzerin = nutzer !== null && gegenstand.besitzerId === nutzer.id;
  const [anzahl, angefragt, erhalten] = await Promise.all([
    ladeAnzahlAnfragen(id),
    hatAngefragt(id, nutzer),
    istBesitzerin ? ladeErhalteneAnfragen(id) : null,
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">
      <Link
        href="/#gegenstaende"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink hover:underline hover:underline-offset-4"
      >
        <ArrowLeft size={18} aria-hidden />
        Zurück zur Liste
      </Link>

      {/* Am Handy stehen Titel, Preis und Button über dem Bild – so ist der Button ohne Scrollen sichtbar. */}
      <article className="flex flex-col">
        <div className="relative order-2 mb-6 aspect-[4/3] overflow-hidden border border-border bg-highlight sm:order-1">
          {gegenstand.bild ? (
            <Image
              src={gegenstand.bild}
              alt={gegenstand.titel}
              fill
              sizes="(min-width: 768px) 720px, 100vw"
              className="object-cover"
              preload
            />
          ) : (
            <div role="img" aria-label={`Kein Bild für ${gegenstand.titel}`} className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted">
              <ImageOff size={48} aria-hidden />
              Kein Bild
            </div>
          )}
        </div>

        <div className="order-1 sm:order-2">
          <div className="mb-1 flex items-center justify-between gap-3">
            <p className="text-sm text-muted">{gegenstand.kategorie}</p>
            <TeilenButton titel={gegenstand.titel} />
          </div>
          <h1 className="mb-2 text-3xl">{gegenstand.titel}</h1>
          <p className="mb-4 text-xl font-semibold leading-snug">{preisText(gegenstand.preisProTag)}</p>

          <AnfrageButton gegenstandId={id} anzahl={anzahl} angefragt={angefragt} angemeldet={nutzer !== null} />
        </div>

        <div className="order-3">
          {erhalten && <ErhalteneAnfragen gegenstandId={id} anfragen={erhalten} />}

          {!gegenstand.verfuegbar && (
            <p className="mb-4 flex items-center gap-2 bg-warning-bg px-4 py-3 text-sm font-medium text-warning">
              <Clock size={18} aria-hidden />
              Dieser Gegenstand ist gerade verliehen.
            </p>
          )}

          <p className="mb-6 leading-relaxed">{gegenstand.beschreibung}</p>

          <dl className="space-y-2 border border-border bg-raised p-4">
            <div className="flex items-start gap-2">
              <dt className="flex items-center gap-2 text-muted">
                <MapPin size={18} aria-hidden />
                Ort:
              </dt>
              <dd>{gegenstand.ort}</dd>
            </div>
            <div className="flex items-start gap-2">
              <dt className="flex items-center gap-2 text-muted">
                <User size={18} aria-hidden />
                Verleiht:
              </dt>
              <dd>{gegenstand.besitzer}</dd>
            </div>
          </dl>
        </div>
      </article>
    </main>
  );
}
