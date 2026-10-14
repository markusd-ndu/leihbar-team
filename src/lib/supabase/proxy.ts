import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/** Seiten, die nur Angemeldete sehen. Alle anderen werden zur Anmeldung geschickt. */
const geschuetzt = ["/meine-anfragen", "/anbieten", "/anfragen-an-mich", "/meine-gegenstaende"];

// Läuft vor jeder Seite: frischt die Sitzung auf (neue Cookies) und schützt Seiten.
export async function updateSession(request: NextRequest) {
  let antwort = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          antwort = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => antwort.cookies.set(name, value, options));
        },
      },
    },
  );

  // Nicht entfernen: getClaims() prüft das Token und erneuert es bei Bedarf.
  // Ohne diesen Aufruf werden Angemeldete zufällig abgemeldet.
  const { data } = await supabase.auth.getClaims();
  const angemeldet = Boolean(data?.claims);

  const pfad = request.nextUrl.pathname;
  if (!angemeldet && geschuetzt.some((p) => pfad === p || pfad.startsWith(`${p}/`))) {
    const ziel = request.nextUrl.clone();
    ziel.pathname = "/anmelden";
    ziel.search = "";
    ziel.searchParams.set("weiter", pfad);
    const umleitung = NextResponse.redirect(ziel);
    // Erneuerte Cookies nicht verlieren.
    antwort.cookies.getAll().forEach((c) => umleitung.cookies.set(c));
    return umleitung;
  }

  return antwort;
}
