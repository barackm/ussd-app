import {
  type MenuOption,
  type Step,
  type Session,
  ActionTypeEnum,
  type ActionConfig,
  type Language,
  type DynamicFlow,
} from "./types.ts";
import { dynamicFlow } from "./data.ts";
import { translations } from "./translations.ts";

export const generateMenuText = (options: MenuOption) => {
  return Object.entries(options)
    .map(([key, value]) => `${key}. ${value}`)
    .join("\n");
};

export const buildMenu = (step: Step, session: Session) => {
  const language = session.language || "en";
  const translation = translations[language];

  let prompt: string;

  if (typeof step.prompt === "string") {
    prompt = translation[step.prompt];
  } else if (typeof step.prompt === "function") {
    prompt = step.prompt(session);
  } else {
    throw new Error("Invalid prompt type.");
  }

  const keys = Object.getOwnPropertyNames(step.options);

  const optionsText = keys
    .map((key) => `${key}. ${translation[step.options[key]]}`)
    .join("\n");

  return `CON ${prompt}\n${optionsText}`;
};

export const handleStep = async (
  menuData: DynamicFlow,
  session: Session,
  userInput?: string
): Promise<string> => {
  const currentStep = menuData[session.step];

  if (!currentStep) {
    return `END Error: Invalid step configuration.`;
  }

  if (userInput === undefined) {
    return buildMenu(currentStep, session);
  }

  if (userInput in currentStep.options) {
    session.previousStep = session.step;
    session.selectedOptions = session.selectedOptions || {};
    session.selectedOptions[session.step] = userInput;

    session.step = currentStep.nextStep?.[userInput] || session.step;

    if (currentStep.config?.action) {
      await executeAction(currentStep.config, session, userInput);
    }

    if (dynamicFlow[session.step]?.isFinalStep) {
      return `END ${dynamicFlow[session.step].prompt}`;
    }

    const nextStep = dynamicFlow[session.step];
    return buildMenu(nextStep, session);
  }

  return `CON Invalid input. ${currentStep.prompt}\n${generateMenuText(
    currentStep.options
  )}`;
};

export const stepHandlers = {
  processStep: (menuData: DynamicFlow, session: Session, userInput: string) => {
    return handleStep(menuData, session, userInput);
  },
};

export const executeAction = async (
  config: ActionConfig,
  session: Session,
  userInput: string
) => {
  switch (config.action) {
    case ActionTypeEnum.SEND_REPORT:
      console.log(
        `Log Action:`,
        config.params?.message || "No message",
        session
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      break;
    case ActionTypeEnum.CHANGE_LANGUAGE: {
      const language = config.params?.languageMap?.[userInput];
      if (language) {
        session.language = language as Language;
      }
      break;
    }
    default:
      console.log("Unknown action type");
  }
};
