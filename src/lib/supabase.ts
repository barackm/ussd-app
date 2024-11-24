import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1";
import type { Database } from "../types/types.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

type TypedSupabaseClient = SupabaseClient<Database>;

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export default supabase as TypedSupabaseClient;
