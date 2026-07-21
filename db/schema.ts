import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull().default(""),
  postcode: text("postcode").notNull(),
  home: text("home").notNull(),
  place: text("place").notNull(),
  direction: text("direction").notNull(),
  shade: text("shade").notNull(),
  bill: text("bill").notNull(),
  storage: text("storage").notNull(),
  service: text("service").notNull().default("Komplettservice"),
  timing: text("timing").notNull(),
  score: integer("score").notNull().default(0),
  status: text("status").notNull().default("Neu"),
  photoKey: text("photo_key"),
  photoName: text("photo_name"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
