import { ablaufGrenze, istAutorisiert } from "@/lib/anfragen-ablaufen";
import { createAdminClient } from "@/lib/supabase/admin";

// Vercel Cron ruft diese Adresse einmal am Tag auf (siehe vercel.json) und schickt das Geheimnis mit.
export async function GET(request: Request) {
  if (!istAutorisiert(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({ fehler: "Nicht erlaubt." }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("requests")
    .update({ status: "abgelaufen" })
    .eq("status", "offen")
    .lt("created_at", ablaufGrenze(new Date()).toISOString())
    .select("id");

  if (error) {
    console.error("Anfragen konnten nicht ablaufen:", error.message);
    return Response.json({ fehler: "Die Anfragen konnten nicht aktualisiert werden." }, { status: 500 });
  }

  console.log(`Anfragen abgelaufen: ${data.length}`);
  return Response.json({ abgelaufen: data.length });
}
