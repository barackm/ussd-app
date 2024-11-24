import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import type { Database } from "../types/types.ts";
import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";

await load({ export: true });

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY");

if (!supabaseUrl || !supabaseKey || !supabaseServiceKey) {
  throw new Error("Missing environment variables. Please check SUPABASE_URL and SUPABASE_ANON_KEY in .env file");
}

type TypedSupabaseClient = SupabaseClient<Database>;

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase as TypedSupabaseClient;
