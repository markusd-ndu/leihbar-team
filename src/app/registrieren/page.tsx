import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import AnmeldeFormular from "@/components/AnmeldeFormular";
import { ladeNutzer, sicheresZiel } from "@/lib/auth";

export const metadata: Metadata = { title: "Registrieren" };

export default async function Registrieren({ searchParams }: PageProps<"/registrieren">) {
  const weiter = sicheresZiel((await searchParams).weiter);
  if (await ladeNutzer()) redirect(weiter);

  return (
    <main className="mx-auto w-full max-w-md flex-1 px-4 py-6">
      <h1 className="mb-2 text-3xl">Registrieren</h1>
      <p className="mb-6 text-muted">Leg dir ein Konto an, um Gegenstände anzubieten und anzufragen.</p>
      <AnmeldeFormular art="registrieren" weiter={weiter} />
      <p className="mt-6 text-muted">
        Schon ein Konto?{" "}
        <Link
          href={weiter === "/" ? "/anmelden" : `/anmelden?weiter=${encodeURIComponent(weiter)}`}
          className="font-medium text-ink underline underline-offset-4"
        >
          Zur Anmeldung
        </Link>
      </p>
    </main>
  );
}
