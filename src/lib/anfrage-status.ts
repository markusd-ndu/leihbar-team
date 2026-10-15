// Ohne Server-Code, damit Browser-Komponenten die Status-Texte auch benutzen können.

/** Diese Status darf eine Besitzer*in setzen. */
export const antwortStatus = ["offen", "angenommen", "abgelehnt"] as const;

/** „abgelaufen“ setzt nur der tägliche Zeitplan (LEI-6), nie ein Mensch. */
export const anfrageStatus = [...antwortStatus, "abgelaufen"] as const;
export type AnfrageStatus = (typeof anfrageStatus)[number];
