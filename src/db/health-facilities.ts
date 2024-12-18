import { supabaseAdmin } from "../lib/supabase.ts";
import type { Database } from "../types/types.ts";

export type HealthFacility = Database["public"]["Tables"]["health_facilities"]["Row"];

export async function getHealthFacilityByPhone(phone: string): Promise<HealthFacility | null> {
  const { data, error } = await supabaseAdmin
    .from<HealthFacility>("health_facilities")
    .select("*")
    .eq("phone", phone)
    .single();

  if (error) {
    console.error("Error getting health facility by phone", error.message);
    return null;
  }

  return data;
}
