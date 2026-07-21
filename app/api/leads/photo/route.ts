import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { leads } from "../../../../db/schema";
import { getChatGPTUser } from "../../../chatgpt-auth";

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user || user.email.toLowerCase() !== "energieteam.sprow@gmail.com") return new Response("Nicht autorisiert", { status: 403 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return new Response("Fehlende ID", { status: 400 });
  const db = await getDb();
  const [lead] = await db.select({ photoKey: leads.photoKey, photoName: leads.photoName }).from(leads).where(eq(leads.id, id)).limit(1);
  if (!lead?.photoKey) return new Response("Kein Foto", { status: 404 });
  const { env } = await import("cloudflare:workers");
  const object = await env.BUCKET.get(lead.photoKey);
  if (!object) return new Response("Foto nicht gefunden", { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Content-Disposition", `inline; filename="${(lead.photoName || "montageort.jpg").replace(/["\\]/g, "")}"`);
  headers.set("Cache-Control", "private, no-store");
  return new Response(object.body, { headers });
}
