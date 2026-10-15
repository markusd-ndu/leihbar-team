import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
