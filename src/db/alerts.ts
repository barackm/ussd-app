import { supabaseAdmin } from "../lib/supabase.ts";
import { AlertStatus } from "../types/alerts.ts";
import type { Database } from "../types/types.ts";

export type Alert = Database["public"]["Tables"]["alerts"]["Row"];
export type AlertInsert = Database["public"]["Tables"]["alerts"]["Insert"];
export type AlertUpdate = Database["public"]["Tables"]["alerts"]["Update"];

export const generateIdentifier = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const alerts = {
  async create(alert: AlertInsert) {
    const { data, error } = await supabaseAdmin
      .from("alerts")
      .insert({
        ...alert,
        identifier: generateIdentifier(),
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: number, status: AlertStatus) {
    const { data, error } = await supabaseAdmin
      .from("alerts")
      .update({
        status: status,
      })
      .eq("identifier", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin.from("alerts").select().eq("id", id).single();

    if (error) throw error;
    return data;
  },

  async getByIdentifier(identifier: number) {
    const { data, error } = await supabaseAdmin.from("alerts").select().eq("identifier", identifier);

    if (error) throw error;
    return data?.[0];
  },

  async list(filters?: Partial<Alert>) {
    let query = supabaseAdmin.from("alerts").select();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null) {
          query = query.eq(key as keyof Alert, value);
        }
      });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
};
