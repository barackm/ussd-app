import { AlertInsert, alerts } from "../db/alerts.ts";
import { getAgentByPhoneNumber, fetchAgentsByLocation } from "../db/agents.ts";
import { type ActionConfig, type Language, ActionParamTragetEnum, ActionTypeEnum } from "../interfaces/types.ts";
import { CommunityAgentStatus } from "../types/agents.ts";
import { sessionStore } from "../sessionStore.ts";
import { AlertStatus } from "../types/alerts.ts";
import { incidentReport, translationKeyToCodeMap } from "../data/data.ts";
import { getHealthFacilityByPhone } from "../db/health-facilities.ts";
import { normalizeString } from "./string.ts";
import { translate } from "../translations/translate.ts";
import { sendSMS } from "../lib/twilio.ts";

const SEND_SMS_NOTIFICATIONS = Deno.env.get("SEND_SMS_NOTIFICATIONS") === "true";

interface AlertValidationResult {
  success: boolean;
  message?: string;
  alert?: any;
}

const getCodeForKey = (key: string): string | null => {
  return translationKeyToCodeMap[key] || null;
};

async function validateAlertAccess(alertId: number, agentPhone: string): Promise<AlertValidationResult> {
  const alert = await alerts.getByIdentifier(alertId);
  if (!alert) {
    return {
      success: false,
      message: translate("alert_not_found"),
    };
  }

  const agent = await getAgentByPhoneNumber(agentPhone);

  const agentLocation = JSON.parse(agent?.location?.toString() || "{}");

  const village = normalizeString(agentLocation.village);
  const cell = normalizeString(agentLocation.cell);
  const locationMatches = normalizeString(alert.village) === village && normalizeString(alert.cell) === cell;

  if (!agent || agent.status !== CommunityAgentStatus.ACTIVE || !locationMatches) {
    return {
      success: false,
      message: translate("unauthorized_alert_update"),
    };
  }

  return { success: true, message: translate("alert_status_updated") };
}

async function validateAlertAccessForHealthFacility(
  alertId: number,
  agentPhone: string,
): Promise<AlertValidationResult> {
  const alert = await alerts.getByIdentifier(alertId);
  if (!alert) {
    return {
      success: false,
      message: translate("alert_not_found"),
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
      message: translate("unauthorized_alert_access"),
    };
  }

  return {
    success: true,
    message: translate("alert_access_granted"),
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
        const incidentCode = getCodeForKey(session.incidentType);
        const affectedCode = getCodeForKey(session.affectedIndividuals!);
        const genderCode = getCodeForKey(session.gender!);
        const ageCode = session.age ? `AG.${session.age}` : null;
        const durationCode = session.duration ? `DF.${session.duration}` : null;

        const _alertData = {
          province: session.province,
          district: session.district,
          cell: session.cell,
          village: session.village,
          reporter_phone: session.phoneNumber,
          incident_type: translate(session.incidentType),
          details: {
            age: ageCode,
            duration: durationCode,
            affected_count: affectedCode,
            gender: genderCode,
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

        if (SEND_SMS_NOTIFICATIONS) {
          for (const agent of agents) {
            // const agent = { first_name: "Barack", phone: "0780083122" };
            const message = translate("alert_sms_message", {
              id: alert.identifier,
              sector: alert.sector,
              cell: alert.cell,
              village: alert.village,
              details: `${incidentCode}, ${affectedCode}, ${genderCode}, ${ageCode}, ${durationCode}`,
            });
            sendSMS(agent.phone, message);
          }
        }

        return Promise.resolve({ success: true });
      } catch {
        return Promise.resolve({ success: false, message: translate("alert_send_failed") });
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
            message: translate("alert_status_update_failed"),
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
      return Promise.resolve({ success: false, message: translate("unknown_action") });
    }
  }
};
