import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AnbietenFormular from "@/components/AnbietenFormular";

export const metadata: Metadata = { title: "Gegenstand anbieten" };

export default function Anbieten() {
  return (
    <main className="mx-auto w-full max-w-xl flex-1 px-4 py-6">
      <Link
        href="/#gegenstaende"
        className="mb-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-ink hover:underline hover:underline-offset-4"
      >
        <ArrowLeft size={18} aria-hidden />
        Zurück zur Liste
      </Link>
      <h1 className="mb-2 text-3xl">Gegenstand anbieten</h1>
      <p className="mb-6 text-muted">
        Sag uns, was du verleihen möchtest. Nach dem Speichern erscheint es in der Liste.
      </p>
      <AnbietenFormular />
    </main>
  );
}
