---
description: Prüft das Projekt (Lint, Build, Secrets, Akzeptanzkriterien) und berichtet verständlich
allowed-tools: Bash(npm run lint), Bash(npm run build), Bash(git status:*), Bash(git diff:*), Bash(grep:*), Read, Glob, Grep, mcp__plugin_linear_linear__list_issues, mcp__plugin_linear_linear__get_issue
---

Führe eine Qualitätsprüfung durch und berichte auf Deutsch, in dieser Reihenfolge:

1. **Läuft es?** `npm run lint` und `npm run build` ausführen. Fehler in einfachen Worten erklären und beheben (nach Rückfrage, wenn mehr als eine Datei betroffen ist).
2. **Secrets?** Suche im Projekt (ohne `node_modules`, `.next`, `.env*`) nach Mustern wie `sk-`, `eyJ`, `supabase.co` mit Key, `password`, `secret`, `apikey`. Melde jeden Fund mit Datei und Zeile. `.env.local` darf nicht in `git status` als zu committende Datei auftauchen.
3. **Akzeptanzkriterien:** Lies `docs/BACKLOG.md`. Steht dort eine Zeile, die mit „Issues: Linear ·“ beginnt, hol über den Linear-MCP die Issues im Projekt aus dieser Zeile mit Status In Progress, In Review oder Done (nur lesen; nicht verbunden: sag es und überspring diesen Punkt). Für jedes Issue mit Status „in Arbeit“ oder „fertig“ (in Linear: In Progress, In Review, Done): gehe die Kriterien einzeln durch und bewerte sie anhand des Codes als ✅ erfüllt / ❓ unklar (muss im Browser geprüft werden) / ❌ nicht erfüllt.
4. **Offene Punkte:** maximal 5 konkrete Verbesserungen, priorisiert, je ein Satz.

Formatiere den Bericht kurz mit Überschriften. Keine Code-Blöcke, außer die Person fragt danach.
