import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { leads } from "../../../db/schema";
import { getChatGPTUser } from "../../chatgpt-auth";

const ADMIN_EMAILS = new Set(["energieteam.sprow@gmail.com"]);

async function requireAdmin() {
  const user = await getChatGPTUser();
  if (!user || !ADMIN_EMAILS.has(user.email.toLowerCase())) return null;
  return user;
}

export async function GET() {
  if (!(await requireAdmin())) return Response.json({ error: "Nicht autorisiert" }, { status: 403 });
  const db = await getDb();
  const rows = await db.select().from(leads).orderBy(desc(leads.createdAt)).limit(250);
  return Response.json({ leads: rows });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const value = (key: string) => String(form.get(key) ?? "").trim();
    const required = ["name", "email", "postcode", "home", "place", "direction", "shade", "bill", "storage", "timing"];
    if (required.some((key) => !value(key))) return Response.json({ error: "Bitte alle Pflichtfelder ausfüllen." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(value("email"))) return Response.json({ error: "Bitte eine gültige E-Mail-Adresse eingeben." }, { status: 400 });

    const id = crypto.randomUUID();
    const photo = form.get("photo");
    let photoKey: string | null = null;
    let photoName: string | null = null;
    if (photo instanceof File && photo.size > 0) {
      if (!photo.type.startsWith("image/")) return Response.json({ error: "Es sind nur Bilddateien erlaubt." }, { status: 400 });
      if (photo.size > 8 * 1024 * 1024) return Response.json({ error: "Das Foto darf maximal 8 MB groß sein." }, { status: 400 });
      const extension = photo.name.split(".").pop()?.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "jpg";
      photoKey = `lead-photos/${id}.${extension}`;
      photoName = photo.name.slice(0, 180);
      const { env } = await import("cloudflare:workers");
      await env.BUCKET.put(photoKey, await photo.arrayBuffer(), { httpMetadata: { contentType: photo.type } });
    }

    const score = Math.max(0, Math.min(100, Number(value("score")) || 0));
    const db = await getDb();
    await db.insert(leads).values({ id, name: value("name"), email: value("email"), phone: value("phone"), postcode: value("postcode"), home: value("home"), place: value("place"), direction: value("direction"), shade: value("shade"), bill: value("bill"), storage: value("storage"), service: value("service") || "Komplettservice", timing: value("timing"), score, photoKey, photoName });
    return Response.json({ id, message: "Anfrage erfolgreich gespeichert." }, { status: 201 });
  } catch (error) {
    console.error("lead-create", error);
    return Response.json({ error: "Die Anfrage konnte gerade nicht gespeichert werden." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) return Response.json({ error: "Nicht autorisiert" }, { status: 403 });
  const payload = (await request.json()) as { id?: string; status?: string };
  const allowed = new Set(["Neu", "Kontaktiert", "Angebot", "Abgeschlossen", "Archiviert"]);
  if (!payload.id || !payload.status || !allowed.has(payload.status)) return Response.json({ error: "Ungültige Änderung" }, { status: 400 });
  const db = await getDb();
  await db.update(leads).set({ status: payload.status, updatedAt: new Date().toISOString() }).where(eq(leads.id, payload.id));
  return Response.json({ ok: true });
}
