/** Nach so vielen Tagen ohne Antwort läuft eine Anfrage ab. */
export const ablaufTage = 7;

/** Anfragen, die vor diesem Zeitpunkt gestellt wurden, gelten als unbeantwortet abgelaufen. */
export function ablaufGrenze(jetzt: Date): Date {
  return new Date(jetzt.getTime() - ablaufTage * 24 * 60 * 60 * 1000);
}

/** Prüft den Kopf „Authorization: Bearer <Geheimnis>“, mit dem Vercel Cron den Zeitplan aufruft. */
export function istAutorisiert(authorization: string | null, geheimnis: string | undefined): boolean {
  // Ohne eingestelltes Geheimnis ist der Zugang immer zu – sonst käme man mit „Bearer undefined“ hinein.
  if (!geheimnis) return false;
  return authorization === `Bearer ${geheimnis}`;
}
