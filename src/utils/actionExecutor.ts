import { AlertInsert, alerts } from "../db/alerts.ts";
import { getAgentByPhoneNumber } from "../db/agents.ts";
import { type ActionConfig, type Language, ActionTypeEnum } from "../interfaces/types.ts";
import { CommunityAgentStatus } from "../types/agents.ts";
import { sessionStore } from "../sessionStore.ts";

interface AlertValidationResult {
  success: boolean;
  message?: string;
  alert?: any;
}

async function validateAlertAccess(alertId: string, agentPhone: string): Promise<AlertValidationResult> {
  const alert = await alerts.getByIdentifier(alertId);
  if (!alert) {
    return {
      success: false,
      message: `Alert with ID ${alertId} was not found`,
    };
  }

  const agent = await getAgentByPhoneNumber(agentPhone);
  const agentLocation = JSON.parse(agent?.location?.toString() || "{}");

  const normalizeLocation = (str: string | null | undefined): string => (str || "").toLowerCase().trim();

  const village = normalizeLocation(agentLocation.village);
  const cell = normalizeLocation(agentLocation.cell);
  const locationMatches = normalizeLocation(alert.village) === village && normalizeLocation(alert.cell) === cell;

  if (!agent || agent.status !== CommunityAgentStatus.ACTIVE || !locationMatches) {
    return {
      success: false,
      message: "You are not authorized to update this alert status",
    };
  }

  return { success: true, alert };
}

export const executeAction = async (
  config: ActionConfig,
  userInput: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  const session = sessionStore.get();
  switch (config.action) {
    case ActionTypeEnum.SEND_ALERT: {
      const _alertData = {
        province: session.province,
        district: session.district,
        cell: session.cell,
        village: session.village,
        reporter_phone: session.phoneNumber,
        incident_type: session.incidentType,
        details: {
          age: session.age,
          duration: session.duration,
          affected_count: session.affectedIndividuals,
          gender: session.gender,
        },
        sector: session.sector,
        affected_count: session.affectedIndividuals,
      } as AlertInsert;

      await alerts.create(_alertData);
      return Promise.resolve({ success: true });
    }

    case ActionTypeEnum.CHANGE_LANGUAGE: {
      const language = config.params?.languageMap?.[userInput];
      if (language) {
        session.language = language as Language;
      }
      return Promise.resolve({ success: true });
    }

    case ActionTypeEnum.UPDATE_ALERT_STATUS: {
      const validation = await validateAlertAccess(userInput, session.phoneNumber);
      return Promise.resolve(validation);
    }

    case ActionTypeEnum.CHECK_ALERT_EXISTENCE: {
      const validation = await validateAlertAccess(userInput, session.phoneNumber);
      return Promise.resolve(validation);
    }
    default: {
      return Promise.resolve({ success: false, message: "Unknown action" });
    }
  }
};
