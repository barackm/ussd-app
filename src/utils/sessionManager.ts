import { supabaseAdmin } from "../lib/supabase.ts";

export async function getSession(sessionId: string): Promise<any> {
  const { data, error } = await supabaseAdmin
    .from("sessions")
    .select("data, expires_at")
    .eq("session_id", sessionId)
    .single();

  if (error) {
    console.error("Error fetching session:", error.message);
    return null;
  }

  const now = new Date();
  if (data?.expires_at && new Date(data.expires_at) <= now) {
    console.warn(`Session ${sessionId} has expired.`);
    await deleteSession(sessionId);
    return null;
  }

  return data?.data || null;
}

export async function saveSession(sessionId: string, session: any): Promise<void> {
  const { error } = await supabaseAdmin.from("sessions").upsert(
    {
      session_id: sessionId,
      data: session,
      updated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    },
    { onConflict: "session_id" },
  );

  if (error) {
    throw new Error("Error saving session: " + error.message);
  }
}

export async function deleteSession(sessionId: string): Promise<void> {
  const { error } = await supabaseAdmin.from("sessions").delete().eq("session_id", sessionId);

  if (error) {
    throw new Error("Error deleting session: " + error.message);
  }
}
