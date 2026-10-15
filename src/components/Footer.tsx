import Image from "next/image";
import Link from "next/link";

// Feste Links, unabhängig vom Anmeldestatus (anders als die Hauptnavigation im Header).
const links = [
  { href: "/#gegenstaende", name: "Gegenstände" },
  { href: "/anbieten", name: "Anbieten" },
  { href: "/anmelden", name: "Anmelden" },
  { href: "/registrieren", name: "Registrieren" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-border bg-raised">
      {/* Kurzer Signalgelb-Balken als Akzent, passend zum Zettel-Look der Startseite. */}
      <span aria-hidden="true" className="absolute -top-px left-4 h-1.5 w-16 bg-signal sm:left-[max(1rem,calc(50%-32rem+1rem))]" />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 pb-6 pt-10 sm:grid-cols-[1fr_auto] sm:gap-16">
        <div className="flex flex-col items-start gap-3">
          <Link href="/" className="flex min-h-11 items-center">
            {/* Wie im Header: Tinte auf hellem Papier, die weiße Fassung im dunklen Modus. */}
            <Image
              src="/marke/leihbar-logo.png"
              alt="Leihbar"
              width={174}
              height={24}
              sizes="174px"
              className="h-6 w-auto dark:hidden"
            />
            <Image
              src="/marke/leihbar-logo-weiss.png"
              alt="Leihbar"
              width={174}
              height={24}
              sizes="174px"
              className="hidden h-6 w-auto dark:block"
            />
          </Link>
          <p className="max-w-xs text-sm text-muted">
            Leihen statt kaufen – Dinge am Campus anbieten, finden, anfragen.
          </p>
        </div>
        <nav aria-label="Fußbereich">
          <p className="text-sm font-medium uppercase tracking-wide text-muted">Entdecken</p>
          <ul className="mt-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="inline-flex min-h-11 items-center text-base font-medium text-ink underline-offset-4 decoration-signal decoration-2 hover:underline"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-5xl px-4 py-4 text-sm text-muted">
          © 2026 Leihbar · NDU Master Management by Innovation
        </p>
      </div>
    </footer>
  );
}
