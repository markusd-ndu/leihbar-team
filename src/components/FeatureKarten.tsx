"use client";

import { useState } from "react";
import { Hand, Recycle, Search } from "lucide-react";
import { useReducedMotion } from "motion/react";
import FeatureCard, { type Zeichen } from "@/components/FeatureCard";

const karten: { icon: typeof Search; titel: string; text: string; zeichen: Zeichen }[] = [
  {
    icon: Search,
    zeichen: "lupe",
    titel: "Alles an einem Ort",
    text: "Was andere am Campus verleihen – von Mode über Möbel bis Technik, ohne Herumfragen in Chats.",
  },
  {
    icon: Hand,
    zeichen: "hand",
    titel: "Mit einem Klick anfragen",
    text: "Besitzer*innen sehen sofort, wer etwas ausleihen möchte. Kein Hin und Her mehr.",
  },
  {
    icon: Recycle,
    zeichen: "kreislauf",
    titel: "Leihen statt kaufen",
    text: "Für einmal kaufen lohnt sich selten. Leihen spart Geld und Platz in der WG.",
  },
];

/** Die drei Versprechen auf der Startseite. Welche Karte gerade berührt wird, weiß diese Liste: Die anderen treten zurück. */
export default function FeatureKarten() {
  const [beruehrt, setBeruehrt] = useState<number | null>(null);
  const still = useReducedMotion() ?? false;

  return (
    <section aria-label="Was Leihbar kann" className="order-last mb-14 grid gap-4 sm:order-none sm:grid-cols-3">
      {karten.map((k, i) => (
        <FeatureCard
          key={k.titel}
          {...k}
          gedimmt={beruehrt !== null && beruehrt !== i}
          beruehrt={beruehrt === i}
          still={still}
          onBeruehrung={(an) => setBeruehrt((alt) => (an ? i : alt === i ? null : alt))}
        />
      ))}
    </section>
  );
}
