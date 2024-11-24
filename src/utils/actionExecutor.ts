import { AlertInsert, alerts } from "../db/alerts.ts";
import { type ActionConfig, type Language, ActionTypeEnum } from "../interfaces/types.ts";
import { sessionStore } from "../sessionStore.ts";

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
      const alert = await alerts.getByIdentifier(userInput);
      if (!alert) {
        return Promise.resolve({ success: false, message: `Alert with ID ${userInput} was not found` });
      }

      return Promise.resolve({ success: true });
    }

    case ActionTypeEnum.CHECK_ALERT_EXISTENCE: {
      const alert = await alerts.getByIdentifier(userInput);
      if (alert) {
        return Promise.resolve({ success: true });
      }
      return Promise.resolve({ success: false, message: `Alert with ID ${userInput} was not found` });
    }

    default: {
      return Promise.resolve({ success: false, message: "Unknown action" });
    }
  }
};
