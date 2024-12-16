import { supabaseAdmin } from "../lib/supabase.ts";
import type { Database } from "../types/types.ts";
import { normalizeString } from "../utils/string.ts";

export type Agent = Database["public"]["Tables"]["community_agents"]["Row"];

const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
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

export const fetchAgentsByLocation = async ({
  village,
  cell,
  sector,
}: {
  village: string;
  cell: string;
  sector: string;
}): Promise<Agent[]> => {
  const { data = [], error } = await supabaseAdmin.from("community_agents").select("*");

  if (error) throw error;

  return (
    data?.filter((agent: Agent) => {
      try {
        const locationData = JSON.parse(agent.location?.toString() || "{}");

        return (
          normalizeString(locationData.village) === normalizeString(village) &&
          normalizeString(locationData.cell) === normalizeString(cell) &&
          normalizeString(locationData.sector) === normalizeString(sector)
        );
      } catch (error) {
        console.error(`Invalid location data for agent ${agent.id}:`, error);
        return false;
      }
    }) || []
  );
};
