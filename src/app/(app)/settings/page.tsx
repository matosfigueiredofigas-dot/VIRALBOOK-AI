import { createClient, getCachedUser } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SettingsClient } from "@/components/settings-client"

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  return <SettingsClient userEmail={user.email || "unknown"} />;
}
