import { AlertInsert, alerts } from "../db/alerts.ts";
import { getAgentByPhoneNumber, fetchAgentsByLocation } from "../db/agents.ts";
import { type ActionConfig, type Language, ActionParamTragetEnum, ActionTypeEnum } from "../interfaces/types.ts";
import { CommunityAgentStatus } from "../types/agents.ts";
import { sessionStore } from "../sessionStore.ts";
import { AlertStatus } from "../types/alerts.ts";
import { incidentReport } from "../data/data.ts";
import { getHealthFacilityByPhone } from "../db/health-facilities.ts";
import { normalizeString } from "./string.ts";

interface AlertValidationResult {
  success: boolean;
  message?: string;
  alert?: any;
}

async function validateAlertAccess(alertId: number, agentPhone: string): Promise<AlertValidationResult> {
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

  return { success: true, message: "END Alert status updated successfully" };
}

async function validateAlertAccessForHealthFacility(
  alertId: number,
  agentPhone: string,
): Promise<AlertValidationResult> {
  const alert = await alerts.getByIdentifier(alertId);
  if (!alert) {
    return {
      success: false,
      message: `Alert with ID ${alertId} was not found`,
    };
  }

  const healthFacility = await getHealthFacilityByPhone(agentPhone);
  const healthFacilityLocation = JSON.parse(healthFacility?.location?.toString() || "{}");

  const locationMatches =
    normalizeString(alert.district) === normalizeString(healthFacilityLocation.district) &&
    normalizeString(alert.sector) === normalizeString(healthFacilityLocation.sector);

  if (!healthFacility || !locationMatches) {
    return {
      success: false,
      message: "You are not authorized to access this alert",
    };
  }

  return {
    success: true,
    message: "END Alert access granted successfully",
    alert,
  };
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
      try {
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

        const alert = await alerts.create(_alertData);
        const agents = await fetchAgentsByLocation({
          cell: alert.cell!,
          sector: alert.sector!,
          village: alert.village!,
        });

        // for (const agent of agents) {
        const agent = { first_name: "Barack", phone: "0780083122" };
        const message = `
🚨 AlertHub
New alert:
- ID: ${alert.identifier}
- Sector: ${alert.sector}
- Cell/Village: ${alert.cell}, ${alert.village}
- Details: [Codes will be here]

Please follow up and update the status.`;
        // sendSMS(agent.phone, message);
        // }
        return Promise.resolve({ success: true });
      } catch {
        return Promise.resolve({ success: false, message: "Failed to send alert" });
      }
    }

    case ActionTypeEnum.CHANGE_LANGUAGE: {
      const language = config.params?.languageMap?.[userInput];
      if (language) {
        session.language = language as Language;
      }
      return Promise.resolve({ success: true });
    }

    case ActionTypeEnum.UPDATE_ALERT_STATUS: {
      const params = config.params || {};
      const target = params.target;
      const isHealthFacility = target === ActionParamTragetEnum.HEALTH_FACILITY;

      const validation = isHealthFacility
        ? await validateAlertAccessForHealthFacility(session.alertId!, session.phoneNumber)
        : await validateAlertAccess(session.alertId!, session.phoneNumber);

      if (validation.success) {
        const stepId = session.step;
        const stepData = incidentReport[stepId];
        const optionMappedValues = stepData.optionMappedValues || {};
        const currentStatus = optionMappedValues[userInput] as AlertStatus;

        try {
          await alerts.update(session.alertId!, currentStatus);
        } catch {
          return Promise.resolve({
            success: false,
            message: "Failed to update alert status",
          });
        }
      }
      return Promise.resolve(validation);
    }

    case ActionTypeEnum.CHECK_ALERT_EXISTENCE: {
      const params = config.params || {};
      const target = params.target;
      const isHealthFacility = target === ActionParamTragetEnum.HEALTH_FACILITY;

      const validation = isHealthFacility
        ? await validateAlertAccessForHealthFacility(parseInt(userInput), session.phoneNumber)
        : await validateAlertAccess(parseInt(userInput), session.phoneNumber);
      if (validation.success) {
        sessionStore.update({ alertId: parseInt(userInput) });
      }
      return Promise.resolve(validation);
    }

    default: {
      return Promise.resolve({ success: false, message: "Unknown action" });
    }
  }
};
