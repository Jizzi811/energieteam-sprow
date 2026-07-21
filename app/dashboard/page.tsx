import { chatGPTSignOutPath, requireChatGPTUser } from "../chatgpt-auth";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireChatGPTUser("/dashboard");
  const allowed = user.email.toLowerCase() === "energieteam.sprow@gmail.com";
  if (!allowed) return <main className="dashboard-denied"><h1>Kein Zugriff</h1><p>Dieses Lead-Dashboard ist ausschließlich für EnergieTeam Sprow freigeschaltet.</p><a href="/">Zur Startseite</a></main>;
  return <DashboardClient displayName={user.displayName} signOutPath={chatGPTSignOutPath("/")} />;
}
