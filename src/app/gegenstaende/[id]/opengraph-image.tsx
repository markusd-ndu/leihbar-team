import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ladeGegenstand } from "@/lib/items";
import { preisText } from "@/lib/format";

// Vorschaubild für Chats (WhatsApp & Co.): Foto des Gegenstands, darunter Titel und Preis.
// Hat der Gegenstand kein Foto, zeigt das Bild stattdessen das Leihbar-Zeichen.
export const alt = "Vorschau des Gegenstands bei Leihbar";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Ein Bild kann keine CSS-Tokens lesen – die Farben entsprechen den Tokens in globals.css.
const farben = {
  hintergrund: "#fafaf7",
  akzent: "#d6401f",
  akzentSanft: "#fde8e3",
  text: "#16161a",
  karte: "#ffffff",
};

async function ladeFoto(pfad: string | null): Promise<string | null> {
  if (!pfad || !pfad.startsWith("/gegenstaende/") || pfad.includes("..")) return null;
  try {
    const daten = await readFile(join(process.cwd(), "public", pfad));
    const typ = pfad.endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${typ};base64,${daten.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const gegenstand = await ladeGegenstand(id);
  const foto = await ladeFoto(gegenstand?.bild ?? null);
  const titel = gegenstand?.titel ?? "Leihbar";
  const preis = gegenstand ? preisText(gegenstand.preisProTag) : "Leihen statt kaufen";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: farben.hintergrund,
          color: farben.text,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: farben.akzentSanft,
            overflow: "hidden",
          }}
        >
          {foto ? (
            <img src={foto} alt="" width={1200} height={460} style={{ objectFit: "cover", width: 1200, height: 460 }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
              <div style={{ width: 72, height: 72, borderRadius: 36, background: farben.akzent }} />
              <div style={{ fontSize: 120, fontWeight: 700 }}>Leihbar</div>
            </div>
          )}
        </div>
        <div
          style={{
            height: 170,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 40,
            padding: "0 56px",
            background: farben.karte,
          }}
        >
          <div style={{ fontSize: 52, fontWeight: 700, lineHeight: 1.15, maxWidth: 760 }}>{titel}</div>
          <div style={{ fontSize: 44, fontWeight: 700, color: farben.akzent }}>{preis}</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
