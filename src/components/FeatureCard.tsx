import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  titel: string;
  text: string;
};

export default function FeatureCard({ icon: Icon, titel, text }: Props) {
  return (
    <div className="border border-border bg-raised p-6 shadow-1">
      {/* Lucide-Icons sind ohne aria-label automatisch aria-hidden – rein dekorativ. */}
      <Icon className="mb-3 text-ink" size={28} strokeWidth={1.75} />
      <h2 className="mb-2 font-display text-lg font-normal">{titel}</h2>
      <p className="text-base leading-[1.6] text-muted">{text}</p>
    </div>
  );
}
