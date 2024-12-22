import cron from "https://esm.sh/cron@2.1.0";
import { supabaseAdmin } from "./src/lib/supabase.ts";

async function deleteExpiredSessions(): Promise<void> {
  console.log(`[${new Date().toISOString()}] Running session cleanup...`);

  try {
    const { error, count } = await supabaseAdmin.from("sessions").delete().lt("expires_at", new Date().toISOString());

    if (error) {
      throw new Error(`Failed to clean expired sessions: ${error.message}`);
    }

    console.log(`[${new Date().toISOString()}] Cleaned ${count ?? 0} expired sessions.`);
  } catch (error: unknown) {
    console.error(
      `[${new Date().toISOString()}] Error during cleanup:`,
      error instanceof Error ? error.message : "Unknown error",
    );
  }
}

const job = new cron.CronJob(
  "0 0 * * *", // Run at midnight (00:00) every day
  deleteExpiredSessions,
  null,
  true,
  "UTC",
);

job.start();

console.log("Session cleanup scheduler started.");
