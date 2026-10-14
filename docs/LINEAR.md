# Issues in Linear

> Diese Regeln gelten nur, wenn in `docs/BACKLOG.md` eine Zeile steht, die mit „Issues: Linear ·“ beginnt. Ohne diese Zeile liegen die Issues in der Datei, und diese Datei spielt keine Rolle.
> Eingerichtet wird das mit `/ndu-linear`. Ältere Repos holen diese Datei mit dem Nachhol-Prompt auf der Kurs-Website.

Die Zeile hat immer die Form `Issues: Linear · Team [Kürzel] · Projekt [Name]`. Gemeint sind nur die Issues **im Projekt aus dieser Zeile** – andere Projekte im selben Team oder Workspace gehören anderen Menschen. Dann gilt:

- Ein Issue holst du per Kennung (z. B. LEI-5) über den Linear-MCP – nie aus dem Gedächtnis. Ist der MCP nicht verbunden, sag es und erklär: `/mcp` → *plugin:linear:linear* → *Authenticate*.
- Zu Beginn: Status In Progress, der angemeldeten Person zugewiesen. Arbeitest du auf einem Branch, beginnt sein Name mit der Kennung in Kleinbuchstaben (z. B. `lei-5-beschreibung`).
- Am Ende: die Belege je Kriterium zusätzlich als Kommentar ins Issue. Sagt die Person „fertig“: Done. Arbeitet ihr mit Pull Requests (im Team): Wenn du den Pull Request erstellst, kommt sein Link in den Kommentar und das Issue auf In Review (gibt es den Status nicht, bleibt es auf In Progress); Done erst nach dem Zusammenführen – mit GitHub-Verbindung setzt Linear das selbst.
- Anlegen, Canceled setzen oder Issues umsortieren nur nach gezeigter Liste und Okay – das gilt auch in Auto Mode. Vor dem Anlegen im Projekt nach gleichem Titel suchen. Neue Issues kommen immer ins Projekt aus der Zeile. Format der Beschreibung: **Ziel**, **Nicht im Umfang**, **Akzeptanzkriterien** (Gegeben … wenn … dann …), **Fertig, wenn**.
- Nie löschen – stattdessen Canceled mit einem Kommentar, warum. Nie Issues ändern, die jemand anderem zugewiesen sind.
- `docs/PRODUKT.md` und `docs/ENTSCHEIDUNGEN.md` bleiben im Repo; Ideen für Später stehen im Brief, nicht in Linear.
