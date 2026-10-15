"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { kategorien } from "@/data/gegenstaende";
import { angebotenAdresse } from "@/lib/angeboten";
import { ladeNutzer } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type FormularZustand = {
  /** Eine Meldung pro Feld, als ganzer Satz. */
  fehler: Partial<Record<"titel" | "kategorie" | "beschreibung" | "ort" | "besitzer" | "preis" | "allgemein", string>>;
  /** Was eingetragen wurde, damit das Formular nach einem Fehler nicht leer ist. */
  werte: Record<string, string>;
};

const text = (formData: FormData, name: string) => {
  const wert = formData.get(name);
  return typeof wert === "string" ? wert.trim() : "";
};

export async function gegenstandAnbieten(
  _vorher: FormularZustand,
  formData: FormData,
): Promise<FormularZustand> {
  const werte = {
    titel: text(formData, "titel"),
    kategorie: text(formData, "kategorie"),
    beschreibung: text(formData, "beschreibung"),
    ort: text(formData, "ort"),
    besitzer: text(formData, "besitzer"),
    preis: text(formData, "preis"),
  };
  const fehler: FormularZustand["fehler"] = {};

  if (werte.titel === "") fehler.titel = "Bitte gib einen Titel ein.";
  else if (werte.titel.length > 120) fehler.titel = "Der Titel darf höchstens 120 Zeichen lang sein.";

  if (!kategorien.some((k) => k === werte.kategorie)) fehler.kategorie = "Bitte wähle eine Kategorie aus.";

  if (werte.beschreibung === "") fehler.beschreibung = "Bitte beschreibe den Gegenstand kurz.";
  else if (werte.beschreibung.length > 2000)
    fehler.beschreibung = "Die Beschreibung darf höchstens 2000 Zeichen lang sein.";

  if (werte.ort === "") fehler.ort = "Bitte gib an, wo man den Gegenstand abholen kann.";
  else if (werte.ort.length > 120) fehler.ort = "Der Ort darf höchstens 120 Zeichen lang sein.";

  if (werte.besitzer === "") fehler.besitzer = "Bitte gib deinen Namen ein.";
  else if (werte.besitzer.length > 80) fehler.besitzer = "Der Name darf höchstens 80 Zeichen lang sein.";

  // „2,50“ und „2.50“ sind beide okay; „0“ heißt gratis.
  const preisText = werte.preis.replace(",", ".");
  const preis = preisText === "" ? NaN : Number(preisText);
  if (!Number.isFinite(preis)) fehler.preis = "Bitte gib den Preis pro Tag als Zahl ein, zum Beispiel 5 oder 0 für gratis.";
  else if (preis < 0) fehler.preis = "Der Preis darf nicht negativ sein.";
  else if (preis > 10000) fehler.preis = "Der Preis darf höchstens 10.000 € pro Tag betragen.";

  if (Object.keys(fehler).length > 0) return { fehler, werte };

  // Nur Angemeldete dürfen anbieten (das erzwingt auch die Regel in der Datenbank).
  const nutzer = await ladeNutzer();
  if (!nutzer) redirect("/anmelden?weiter=/anbieten");

  const supabase = await createClient();
  const { data: neu, error } = await supabase
    .from("items")
    .insert({
      owner_id: nutzer.id,
      titel: werte.titel,
      kategorie: werte.kategorie,
      beschreibung: werte.beschreibung,
      ort: werte.ort,
      besitzer: werte.besitzer,
      preis_pro_tag: Math.round(preis * 100) / 100,
    })
    .select("id")
    .single<{ id: string }>();
  if (error || !neu) {
    return {
      fehler: { allgemein: "Das Speichern hat leider nicht geklappt. Bitte versuch es gleich noch einmal." },
      werte,
    };
  }

  revalidatePath("/");
  // Die Startseite zeigt mit der ID die Erfolgsmeldung und hebt die neue Karte hervor.
  redirect(angebotenAdresse(neu.id));
}
