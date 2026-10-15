import { Check, Clock, X, type LucideIcon } from "lucide-react";
import { plakette } from "@/components/stile";
import type { AnfrageStatus } from "@/lib/anfrage-status";

// Eckige Plakette: Das Zeichen trägt die Farbe, der Text bleibt Tinte bzw. Grau (kleiner Text nie in Akzentfarbe).
// Offene und abgelaufene Anfragen sind gestrichelt („noch nicht entschieden“ bzw. „vorbei“), entschiedene durchgezogen.
const stile: Record<AnfrageStatus, { icon: LucideIcon; zeichen: string; klasse: string }> = {
  offen: { icon: Clock, zeichen: "text-warning", klasse: "border-dashed bg-raised text-ink" },
  angenommen: { icon: Check, zeichen: "text-success", klasse: "bg-raised text-ink" },
  abgelehnt: { icon: X, zeichen: "text-danger", klasse: "bg-raised text-ink" },
  // Läuft von selbst ab: neutral, ohne Farbaussage.
  abgelaufen: { icon: Clock, zeichen: "text-muted", klasse: "border-dashed bg-bg text-muted" },
};

/** Status einer Anfrage: immer Zeichen, Wort und Linienart zusammen, nie die Farbe allein. */
export default function StatusChip({ status }: { status: AnfrageStatus }) {
  const { icon: Icon, zeichen, klasse } = stile[status];
  return (
    <span className={`${plakette} ${klasse}`}>
      <Icon size={16} aria-hidden className={zeichen} />
      <span className="sr-only">Status: </span>
      {status}
    </span>
  );
}
