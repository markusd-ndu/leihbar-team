import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, ImageOff, MapPin, User } from "lucide-react";
import type { Gegenstand } from "@/data/gegenstaende";
import { plakette } from "@/components/stile";
import { preisText } from "@/lib/format";

type Props = {
  gegenstand: Gegenstand;
  /** Nur für das erste sichtbare Bild: lädt es sofort statt erst beim Scrollen. */
  vorladen?: boolean;
  /** Auf Seiten ohne Zwischenüberschrift folgt die Karte direkt auf das `<h1>`. */
  ueberschrift?: "h2" | "h3";
  /** Zusätzliche Zeile unten in der Karte, z. B. der Status einer Anfrage. */
  zusatz?: ReactNode;
};

export default function GegenstandKarte({ gegenstand, vorladen = false, ueberschrift: Titel = "h3", zusatz }: Props) {
  const verliehen = !gegenstand.verfuegbar;
  return (
    // relative + after:inset-0 am Link: die ganze Karte ist anklickbar, vorgelesen wird nur der Titel.
    // Ruhig: 4 px gelber Schatten. Darüber: 8 px. Gedrückt: die Karte rutscht in ihren Schatten. Verliehen: flach.
    <article
      className={`relative flex h-full flex-col overflow-hidden border border-border bg-raised transition duration-(--duration-fast) ease-standard has-[a:focus-visible]:outline-3 has-[a:focus-visible]:outline-offset-3 has-[a:focus-visible]:outline-focus ${
        verliehen
          ? "shadow-none"
          : "shadow-1 hover:shadow-2 has-[a:active]:translate-x-1 has-[a:active]:translate-y-1 has-[a:active]:shadow-none"
      }`}
    >
      <div className="relative aspect-[4/3] bg-highlight">
        {gegenstand.bild ? (
          <Image
            src={gegenstand.bild}
            alt=""
            fill
            sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
            className={`object-cover ${verliehen ? "opacity-70 grayscale" : ""}`}
            preload={vorladen}
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted">
            <ImageOff size={40} aria-hidden />
            Kein Bild
          </div>
        )}
        {verliehen && (
          <span className={`${plakette} absolute left-3 top-3 border-dashed bg-raised text-ink`}>
            <Clock size={16} aria-hidden />
            Gerade verliehen
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-sm text-muted">{gegenstand.kategorie}</p>
        <Titel className="text-base font-semibold leading-snug">
          <Link
            href={`/gegenstaende/${gegenstand.id}`}
            className="outline-none after:absolute after:inset-0 after:content-['']"
          >
            {gegenstand.titel}
          </Link>
        </Titel>
        <p className="font-medium">{preisText(gegenstand.preisProTag)}</p>
        <dl className="mt-auto space-y-1 pt-2 text-sm text-muted">
          <div className="flex items-start gap-2">
            <dt>
              <MapPin size={16} className="mt-1 shrink-0" />
              <span className="sr-only">Ort:</span>
            </dt>
            <dd>{gegenstand.ort}</dd>
          </div>
          <div className="flex items-start gap-2">
            <dt>
              <User size={16} className="mt-1 shrink-0" />
              <span className="sr-only">Verleiht:</span>
            </dt>
            <dd>{gegenstand.besitzer}</dd>
          </div>
        </dl>
        {zusatz}
      </div>
    </article>
  );
}
