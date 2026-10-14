// LEI-5: Eigene API-Route für den Vorschlag – der Browser sieht nur Titel, Kategorie, Ort und die Antwort, nie den Key.
import { NextResponse } from "next/server";
import { ladeNutzer } from "@/lib/auth";
import { beschreibungVorschlagen } from "@/lib/beschreibung-ki";
import { eingabeAus, ratenLimit } from "@/lib/beschreibung-vorschlag";

const limit = ratenLimit();

const meldung = (fehler: string, status: number) => NextResponse.json({ fehler }, { status });

export async function POST(request: Request) {
  const nutzer = await ladeNutzer();
  if (!nutzer) return meldung("Melde dich an, um dir eine Beschreibung vorschlagen zu lassen.", 401);

  // Jeder Klick zählt – auch einer, der danach scheitert.
  if (!limit.erlaubt(nutzer.id))
    return meldung("Du hast gerade sehr oft geklickt. Warte eine Minute und probier es dann noch einmal.", 429);

  const eingabe = eingabeAus(await request.json().catch(() => null));
  if (!eingabe) return meldung("Gib zuerst einen Titel ein.", 400);

  if (!process.env.ANTHROPIC_API_KEY) return meldung("Die Vorschläge sind gerade nicht eingerichtet.", 503);

  try {
    const vorschlag = await beschreibungVorschlagen(eingabe);
    if (!vorschlag) return meldung("Gerade kam kein passender Vorschlag. Probier es noch einmal oder schreib selbst.", 502);
    return NextResponse.json({ vorschlag });
  } catch (fehler) {
    console.error("Beschreibung vorschlagen fehlgeschlagen", fehler);
    return meldung("Der Vorschlag hat nicht geklappt. Probier es gleich noch einmal oder schreib selbst.", 502);
  }
}
