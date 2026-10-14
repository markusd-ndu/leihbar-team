# Leihbar Team — NDU Coding 2026

Gemeinsames Repo für den Team-Sprint an Tag 3 von **„Programmieren mit AI“** (MSc Management by Innovation, NDU). Drei Personen, drei Issues, ein Repo.

## Start

1. Einladung zu diesem Repo annehmen (kommt per E-Mail von GitHub).
2. In VS Code das Repo klonen, im Terminal `npm install`.
3. `.env.example` nach `.env.local` kopieren und die Werte von Markus eintragen.
4. `claude` starten und mit Linear verbinden: `/mcp` → *plugin:linear:linear* → *Authenticate*.

Die ganze Anleitung steht auf der Kurs-Website unter [Tag 3 → Übung 10](https://ndu.datamonkeys.ai/tag-3#uebung-10).

## Spielregeln

- Die Issues liegen in **Linear**, Team `LEI` (LEI-5, LEI-6, LEI-7). Fällt Linear aus, stehen sie auch hier unter *Issues*.
- Jede Person arbeitet auf einem **eigenen Branch**, der mit der Kennung beginnt (z. B. `lei-5-beschreibung`). `main` bleibt unberührt.
- Fertig heißt: Pull Request mit Beleg pro Akzeptanzkriterium, Review durch eine andere Person. Zusammengeführt wird am Ende gemeinsam.

## Was ist hier drin?

| Ordner / Datei | Was es ist |
|---|---|
| `src/app/` | Die Seiten der App (eine Mappe = eine URL) |
| `src/components/` | Wiederverwendbare UI-Bausteine |
| `supabase/migrations/` | Aufbau der Datenbank (Tabellen, Regeln) |
| `docs/BACKLOG.md` | Verweis auf Linear und was schon gebaut ist |
| `docs/LINEAR.md` | Regeln für Claude, wenn die Issues in Linear liegen |
| `CLAUDE.md` | Die Spielregeln für Claude in diesem Projekt |
