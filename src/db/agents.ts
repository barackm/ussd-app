import { supabaseAdmin } from "../lib/supabase.ts";
import type { Database } from "../types/types.ts";

// let's manage agents
export type Agent = Database["public"]["Tables"]["community_agents"]["Row"];

const formatPhoneNumber = (phone: string): string => {
  // Remove all spaces and non-digit characters
  const cleaned = phone.replace(/\D/g, "");
  // Get last 9 digits
  return cleaned.slice(-9);
};

export const getAgentByPhoneNumber = async (phoneNumber: string): Promise<Agent | null> => {
  const { data, error } = await supabaseAdmin.from("community_agents").select("*");

  if (error) throw error;

  const formattedInput = formatPhoneNumber(phoneNumber);
  const foundAgent = data?.find((agent: Agent) => {
    const formattedAgentPhone = formatPhoneNumber(agent.phone);
    return formattedAgentPhone === formattedInput;
  });

  return foundAgent || null;
};
