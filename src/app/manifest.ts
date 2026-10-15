import type { MetadataRoute } from "next";

/** Name, Farben und Icon, wenn jemand Leihbar auf dem Handy zum Startbildschirm hinzufügt. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Leihbar",
    short_name: "Leihbar",
    description: "Leihen statt kaufen – Dinge am Campus anbieten, finden, anfragen.",
    start_url: "/",
    display: "standalone",
    background_color: "#f3efe4",
    theme_color: "#ffd400",
    icons: [
      { src: "/marke/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/marke/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
