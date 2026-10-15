import { createClient } from "@supabase/supabase-js";

/**
 * Client mit dem Secret Key: darf alles und umgeht die Zugriffsregeln.
 * Nur im Backend für Aufgaben ohne angemeldete Person (z. B. der tägliche Zeitplan) benutzen,
 * nie in einer Browser-Komponente.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Supabase ist nicht eingerichtet: NEXT_PUBLIC_SUPABASE_URL und SUPABASE_SECRET_KEY fehlen in .env.local.");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
