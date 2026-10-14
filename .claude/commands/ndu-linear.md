---
description: Backlog nach Linear – Verbindung prüfen, Team und Projekt wählen, vorhandene Issues übertragen; danach liegen die Issues in Linear statt in docs/BACKLOG.md
argument-hint: "[Team-Kürzel, optional – z. B. LEI]"
---

Wir stellen den Backlog auf Linear um. Team: $ARGUMENTS (wenn leer: fragen, sobald die Verbindung steht).

**Leg in Linear nichts an und ändere keine Datei, bevor ich in Schritt 3 ausdrücklich zugestimmt habe.** Lesen ist erlaubt.

1. **Verbindung und Ausgangslage prüfen.**
   - Lies über den Linear-MCP, womit du verbunden bist: Workspace, Teams (Name und Kürzel), mein Benutzername. Gibt es keinen Linear-MCP oder bin ich nicht angemeldet, erklär es mir in drei Schritten und hör dann auf: `/plugin install linear@claude-plugins-official` (falls das Plugin fehlt), Claude neu starten, `/mcp` → *plugin:linear:linear* → *Authenticate* und im Browser mit dem Konto anmelden, mit dem ich in Linear eingeladen bin.
   - Fehlt `docs/PRODUKT.md`: Sag, dass zuerst `/ndu-idee` dran ist – das Projekt in Linear heißt wie das Produkt –, und hör auf.
   - Steht in `docs/BACKLOG.md` schon eine Zeile, die mit „Issues: Linear ·“ beginnt, ist die Umstellung erledigt: Sag mir Team und Projekt aus der Zeile, prüf nur, ob Issues aus der Tabelle darunter im Projekt fehlen, und hör auf.
2. **Team und Projekt.** Gibt es ein Team, frag, ob es das richtige ist; gibt es mehrere, frag, welches. Ein Projekt ist Pflicht – im selben Team arbeiten oft mehrere Produkte. Gibt es im Team schon ein Projekt mit dem Produktnamen aus dem Brief, nimm es; sonst schlag vor, eines mit diesem Namen anzulegen. Prüf die Status des Teams: Fehlt „In Review“, sag mir, dass ich ihn in Linear unter *Settings → Teams → [Team] → Issue statuses* bei *Started* anlegen kann – kein Grund aufzuhören.
3. **Zeigen, was passiert.** Lies `docs/BACKLOG.md`.
   - **Gibt es dort Issues:** Zeig mir eine Tabelle: Nummer in der Datei, Titel, Status in Linear (⬜ offen → Todo, 🔧 in Arbeit → In Progress, ✅ fertig → Done). Such für jeden Titel im Projekt nach einem Issue mit gleichem oder fast gleichem Titel und markier es mit „gibt es schon: [Kennung]“ – das wird nicht angelegt.
   - **Gibt es noch keine Issues** (neues Produkt): Es wird nichts übertragen, nur das Projekt angelegt (falls nötig) und die Datei umgestellt. Die Issues legt danach `/ndu-brainstorm` direkt in Linear an.
   - Ideen unter „Später“ im Brief bleiben im Brief. Frag, ob das so stimmt.
4. **Erst nach meinem Okay anlegen.** Falls nötig zuerst das Projekt. Dann pro Issue in der Tabelle: Titel, Beschreibung mit den vier Überschriften **Ziel**, **Nicht im Umfang**, **Akzeptanzkriterien**, **Fertig, wenn** – Wortlaut aus der Datei, Kriterien als Liste –, der Status aus der Tabelle, das Projekt, niemandem zugewiesen. Die Reihenfolge der Datei bleibt erhalten: Das oberste offene Issue bekommt Priorität High, die übrigen offenen Medium. Merk dir jede Kennung. Bricht ein Anlegen ab, versuch es nicht einfach noch einmal: erst nachsehen, ob es das Issue inzwischen gibt.
5. **Dateien umstellen** (gehört zum Okay aus Schritt 3):
   - `docs/BACKLOG.md`: Die Überschrift und alle Zeilen, die mit `>` beginnen, bleiben. Darunter statt der Issues genau diese Zeile: `Issues: Linear · Team [Kürzel] · Projekt [Name]`, dann die Adresse des Projekts in Linear und – wenn etwas übertragen wurde – eine Tabelle alte Nummer → Kennung, in der alten Reihenfolge. Die alten Issue-Texte entfallen; sie stehen jetzt in Linear und im Git-Verlauf.
   - `docs/PRODUKT.md`, Abschnitt 5: hinter jedes MVP-Stichwort, das ein Issue bekommen hat, die Kennung in Klammern.
   - `docs/LINEAR.md`: Fehlt die Datei (ältere Repos), sag mir, dass ich sie mit dem Nachhol-Prompt auf der Kurs-Website hole, und mach mit den anderen Punkten weiter.
   - `CLAUDE.md`: Fehlt die Zeile `@docs/LINEAR.md`, setz sie zu den anderen Zeilen, die mit `@` beginnen. Ältere Fassungen sprechen an zwei Stellen nur von der Datei; passe sie an, wenn du sie findest: „setzt du es im Backlog auf 🔧 in Arbeit“ wird „setzt du es auf in Arbeit (in `docs/BACKLOG.md` 🔧, in Linear In Progress)“, und „Akzeptanzkriterien aus `docs/BACKLOG.md` sind die Definition of Done“ wird „Die Akzeptanzkriterien des Issues – aus `docs/BACKLOG.md` oder aus Linear (siehe `docs/LINEAR.md`) – sind die Definition of Done“. Ändere sonst nichts an `CLAUDE.md`.
   - `docs/ENTSCHEIDUNGEN.md`: eine Zeile mit heutigem Datum: „Issues liegen in Linear, Team [Kürzel], Projekt [Name] — Backlog im Team statt in der Datei“.
6. **Abschluss.** Zeig mir, was angelegt wurde (Projekt, Kennungen mit Titel). Bitte mich, es in Linear kurz anzusehen. Sag: Als Nächstes `/ndu-commit`. Gibt es Issues, startet eines mit „Setze [Kennung] um“; gibt es noch keine, kommt zuerst `/ndu-brainstorm`. Führ `/ndu-commit` nicht selbst aus.

Sprache: Deutsch, einfache Worte, keine Fachbegriffe ohne kurze Erklärung.
