import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AnmeldeFormular from "@/components/AnmeldeFormular";
import { ladeNutzer, sicheresZiel } from "@/lib/auth";

export const metadata: Metadata = { title: "Anmelden" };

export default async function Anmelden({ searchParams }: PageProps<"/anmelden">) {
  const weiter = sicheresZiel((await searchParams).weiter);
  if (await ladeNutzer()) redirect(weiter);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
      <h1 className="mb-2 text-3xl">Anmelden</h1>
      <p className="mb-6 text-muted">Melde dich mit deiner E-Mail-Adresse und deinem Passwort an.</p>
      <AnmeldeFormular art="anmelden" weiter={weiter} />
      <p className="mt-6 text-muted">
        Noch kein Konto?{" "}
        <Link
          href={weiter === "/" ? "/registrieren" : `/registrieren?weiter=${encodeURIComponent(weiter)}`}
          className="font-medium text-ink underline underline-offset-4"
        >
          Jetzt registrieren
        </Link>
      </p>
    </main>
  );
}
