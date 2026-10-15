import { CircleCheck, Clock, X, type LucideIcon } from "lucide-react";
import type { AnfrageStatus } from "@/lib/anfrage-status";

const stile: Record<AnfrageStatus, { icon: LucideIcon; klasse: string }> = {
  offen: { icon: Clock, klasse: "bg-warning-bg text-warning" },
  angenommen: { icon: CircleCheck, klasse: "bg-success-bg text-success" },
  abgelehnt: { icon: X, klasse: "bg-danger-bg text-danger" },
  // Läuft von selbst ab: neutral, ohne Farbaussage.
  abgelaufen: { icon: Clock, klasse: "border border-border bg-bg text-muted" },
};

/** Status einer Anfrage: immer Zeichen, Wort und Farbe zusammen, nie die Farbe allein. */
export default function StatusChip({ status }: { status: AnfrageStatus }) {
  const { icon: Icon, klasse } = stile[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${klasse}`}>
      <Icon size={16} aria-hidden />
      <span className="sr-only">Status: </span>
      {status}
    </span>
  );
}
