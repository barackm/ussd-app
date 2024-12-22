import { supabaseAdmin } from "../lib/supabase.ts";

Deno.cron(
  "Clear Expired Sessions",
  "0 0 * * *", // Run daily at midnight
  {
    backoffSchedule: [1000, 5000, 10000],
  },
  async () => {
    console.log("Running session cleanup...");

    try {
      const { error } = await supabaseAdmin.from("sessions").delete().lt("expires_at", new Date().toISOString());

      if (error) {
        throw new Error(`Failed to clean expired sessions: ${error.message}`);
      }

      console.log("Expired sessions cleaned successfully.");
    } catch (error: any) {
      console.error("Unexpected error during session cleanup:", error.message);
      throw error;
    }
  },
);
