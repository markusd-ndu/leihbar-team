---
description: Strenge Prüfung mit frischem Blick – ein Subagent prüft Secrets, Zugriffsregeln (RLS), Eingaben und was Fremde sehen; du entscheidest, was behoben wird
argument-hint: "[Bereich, optional – z. B. „nur die Tabelle anfragen“]"
---

Lass das Projekt von jemandem prüfen, der den Code nicht geschrieben hat. Bereich: $ARGUMENTS (wenn leer: das ganze Projekt).

1. **Auftrag schreiben.** Für den Prüfer, ohne dieses Gespräch verständlich: das Produkt in einem Satz (aus `docs/PRODUKT.md`), die Issues mit Status „fertig“ oder „in Arbeit“ aus `docs/BACKLOG.md` – steht dort eine Zeile, die mit „Issues: Linear ·“ beginnt, die mit Status In Progress, In Review oder Done im Projekt aus dieser Zeile, die du selbst über den Linear-MCP liest –, die Regeln zu Keys und Datenbank aus `CLAUDE.md`. Fehlt der Brief oder ist noch kein Issue fertig, prüft er, was im Code schon da ist.
2. **Prüfen lassen.** Starte damit einen Subagenten vom Typ **Plan** mit dem Modell **Sonnet** (Agent-Werkzeug: `subagent_type: Plan`, `model: sonnet`). Er darf nur lesen und suchen und nichts verändern:
   - keine Datei, kein Commit, kein `git stash`, `git restore`, `git checkout`, keine Installation;
   - beim Supabase-MCP nur lesen: `list_tables`, `get_advisors` und `execute_sql` ausschließlich mit `select` (z. B. auf `pg_policies`) – nie `apply_migration`, nie SQL, das schreibt. Ist der MCP nicht verbunden: nur den Code;
   - aus `.env*`-Dateien nur Variablennamen und Key-Art nennen (z. B. „`sb_secret_…`“), nie Werte.
   Er prüft in dieser Reihenfolge und hört nach 5 Funden auf:
   - **Secrets** (den einfachen Muster-Scan macht `/ndu-check`): ein Key im Git-Verlauf; ein `sb_secret_`- oder service_role-Key, der über `NEXT_PUBLIC_` im Browser landet. Ein anon-Key mit `NEXT_PUBLIC_` ist kein Leck (er ist öffentlich und durch RLS geschützt) – höchstens „Kann warten: auf den Publishable Key umstellen“.
   - **Zugriffsregeln:** jede Tabelle mit RLS eingeschaltet und je Operation eine Regel; Schreib-Regeln, die allen alles erlauben; Spalten wie E-Mail, die Fremde lesen können.
   - **Eingaben:** Was ein Formular schickt, prüft auch der Server (leer, zu lang, fremde IDs).
   - **Fremde:** ohne Login, ohne Daten, bei einem Fehler – weiße Seite oder ein verständlicher Satz?
   Nicht melden: Stil, Aufräumen, Kleinigkeiten ohne Folgen für Nutzer*innen oder Daten.
3. **Berichten.** Pro Fund eine Zeile, ohne Fachjargon: was eine fremde Person damit tun könnte, wo (Datei oder Tabelle), und **Muss** (vor dem nächsten Push) oder **Kann warten**. Ist ein Fund unsicher, schreib „Frag Markus“ statt zu raten. Keine Code-Blöcke, keine Key-Werte. Nichts gefunden: ein Satz. In jedem Fall eine Zeile „Nicht geprüft:“, nur zu den vier Bereichen oben, keine Dateiliste – was nach 5 Funden nicht mehr drankam, was es noch nicht gibt (Datenbank, Formular, Login) und die Environment Variables bei Vercel (die sieht der Prüfer nicht).
4. **Erst nach meinem Okay beheben** – nur die Punkte, die ich freigebe; bei Zugriffsregeln vorher in 2–3 Sätzen, was du in der Datenbank änderst. Danach `npm run lint`, `npm run build`, `npm run dev` ohne Fehler und zu jedem Punkt ein Beleg. Bei Zugriffsregeln der Test als fremde Person – als anon und angemeldet als jemand anderes (Rolle authenticated, `request.jwt.claims` mit der `sub` einer zweiten Person) – und als Besitzer*in, dass das Eigene noch geht; jeder Versuch in einer Transaktion, die du zurückrollst. Dann sag: im Browser prüfen, `/ndu-check`, `/ndu-commit`. Führ sie nicht selbst aus. Gibt es nichts zu beheben, sag gleich: weiter mit `/ndu-check` und `/ndu-commit`.

Nutze nie das Modell Fable oder `best` – das kostet im Pro-Plan extra.
