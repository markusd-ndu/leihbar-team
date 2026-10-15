import type { Metadata } from "next";
import { Archivo, Archivo_Black } from "next/font/google";
import "./globals.css";
import BewegungsEinstellung from "@/components/BewegungsEinstellung";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Archivo für Text, Archivo Black für Überschriften – beim Bauen geladen und von uns selbst ausgeliefert.
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo-black", display: "swap" });

// Vollständige Adresse der App – Vorschaubilder im Chat brauchen sie. Auf Vercel kommt sie
// aus den Umgebungsvariablen (Vorschau-Adresse des Pull Requests bzw. Produktions-Adresse).
function ladeBasisAdresse(): URL {
  const host =
    process.env.VERCEL_ENV === "production"
      ? process.env.VERCEL_PROJECT_PRODUCTION_URL
      : process.env.VERCEL_URL;
  return new URL(host ? `https://${host}` : `http://localhost:${process.env.PORT ?? 3000}`);
}

export const metadata: Metadata = {
  metadataBase: ladeBasisAdresse(),
  title: { default: "Leihbar", template: "%s – Leihbar" },
  description: "Leihen statt kaufen – Dinge am Campus anbieten, finden, anfragen.",
  openGraph: { siteName: "Leihbar", locale: "de_DE", type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${archivo.variable} ${archivoBlack.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <BewegungsEinstellung>
          <Header />
          {children}
          <Footer />
        </BewegungsEinstellung>
      </body>
    </html>
  );
}
