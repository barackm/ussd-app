import { type ActionConfig, type Session, type Language, ActionTypeEnum } from "../interfaces/types.ts";

export const executeAction = async (
  config: ActionConfig,
  session: Session,
  userInput: string,
): Promise<{
  success: boolean;
  message?: string;
}> => {
  switch (config.action) {
    case ActionTypeEnum.SEND_REPORT:
      console.log("Sending report...");
      return Promise.resolve({ success: true });

    case ActionTypeEnum.CHANGE_LANGUAGE: {
      const language = config.params?.languageMap?.[userInput];
      if (language) {
        session.language = language as Language;
      }
      return Promise.resolve({ success: true });
    }

    case ActionTypeEnum.UPDATE_ALERT_STATUS:
      console.log("Updating alert status...");
      return Promise.resolve({ success: true });

    case ActionTypeEnum.CHECK_ALERT_EXISTENCE:
      console.log("Checking alert existence...");
      return Promise.resolve({ success: false, message: `Alert with ID ${userInput} was not found` });

    default:
      return Promise.resolve({ success: false, message: "Unknown action" });
  }
};
