import { cache } from "react";
import type { Gegenstand, Kategorie } from "@/data/gegenstaende";
import type { Nutzer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

// Ein Gegenstand, wie er in der Tabelle `items` steht.
export type Zeile = {
  id: string;
  titel: string;
  kategorie: Kategorie;
  beschreibung: string;
  besitzer: string;
  ort: string;
  preis_pro_tag: number;
  verfuegbar: boolean;
  bild_url: string | null;
  owner_id: string | null;
};

export const spalten = "id, titel, kategorie, beschreibung, besitzer, ort, preis_pro_tag, verfuegbar, bild_url, owner_id";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function zuGegenstand(z: Zeile): Gegenstand {
  return {
    id: z.id,
    titel: z.titel,
    kategorie: z.kategorie,
    beschreibung: z.beschreibung,
    besitzer: z.besitzer,
    ort: z.ort,
    preisProTag: Number(z.preis_pro_tag),
    verfuegbar: z.verfuegbar,
    bild: z.bild_url,
    besitzerId: z.owner_id,
  };
}

/** Alle gerade ausleihbaren Gegenstände, neueste zuerst; optional nur eine Kategorie und/oder Suchwort im Titel. */
export async function ladeVerfuegbare(kategorie: Kategorie | null, suche: string | null = null): Promise<Gegenstand[]> {
  const supabase = await createClient();
  let abfrage = supabase.from("items").select(spalten).eq("verfuegbar", true);
  if (kategorie) abfrage = abfrage.eq("kategorie", kategorie);
  // %, _ und \ sind in der Mustersuche Sonderzeichen – hier sollen sie ganz normal gesucht werden.
  if (suche) abfrage = abfrage.ilike("titel", `%${suche.replace(/[\\%_]/g, "\\$&")}%`);
  const { data, error } = await abfrage.order("created_at", { ascending: false }).overrideTypes<Zeile[]>();
  if (error) throw new Error(`Gegenstände konnten nicht geladen werden: ${error.message}`);
  return data.map(zuGegenstand);
}

/** Ein Gegenstand per ID – `null`, wenn es ihn nicht gibt (auch bei einer ungültigen Adresse). */
export const ladeGegenstand = cache(async (id: string): Promise<Gegenstand | null> => {
  if (!uuid.test(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("items")
    .select(spalten)
    .eq("id", id)
    .maybeSingle<Zeile>();
  if (error) throw new Error(`Gegenstand konnte nicht geladen werden: ${error.message}`);
  return data ? zuGegenstand(data) : null;
});

/** Ein eigener Gegenstand mit der Zahl seiner offenen Anfragen – für „Meine Gegenstände“. */
export type EigenerGegenstand = Gegenstand & { offeneAnfragen: number };

/** Alle Gegenstände dieser Person (auch verliehene), neueste zuerst, mit der Zahl offener Anfragen. */
export async function ladeMeineGegenstaende(nutzer: Nutzer): Promise<EigenerGegenstand[]> {
  const supabase = await createClient();
  const [gegenstaende, anfragen] = await Promise.all([
    supabase
      .from("items")
      .select(spalten)
      .eq("owner_id", nutzer.id)
      .order("created_at", { ascending: false })
      .overrideTypes<Zeile[]>(),
    // Nur offene Anfragen; fremde Anfragen gibt die Datenbank ohnehin nur der Besitzer*in heraus.
    supabase
      .from("requests")
      .select("item_id, items!inner(owner_id)")
      .eq("status", "offen")
      .eq("items.owner_id", nutzer.id)
      .overrideTypes<{ item_id: string }[]>(),
  ]);
  if (gegenstaende.error) throw new Error(`Gegenstände konnten nicht geladen werden: ${gegenstaende.error.message}`);
  if (anfragen.error) throw new Error(`Anfragen konnten nicht geladen werden: ${anfragen.error.message}`);

  const offen = new Map<string, number>();
  for (const { item_id } of anfragen.data) offen.set(item_id, (offen.get(item_id) ?? 0) + 1);
  return gegenstaende.data.map((z) => ({ ...zuGegenstand(z), offeneAnfragen: offen.get(z.id) ?? 0 }));
}
