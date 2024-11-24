import { StepEnum } from "../enums/menuKeys.ts";
import { OptionEnum } from "../enums/menuKeys.ts";
import {
  type MenuOption,
  type Step,
  type Session,
  ActionTypeEnum,
  type ActionConfig,
  type Language,
  type DynamicFlow,
} from "../interfaces/types.ts";
import { translations } from "../translations/translations.ts";

export const generateMenuText = (options: MenuOption) => {
  return Object.entries(options)
    .map(([key, value]) => `${key}. ${value}`)
    .join("\n");
};

export const buildMenu = (step: Step, session: Session) => {
  const language = session.language || "en";
  const translation = translations[language];

  let prompt: string;

  if (typeof step?.prompt === "string") {
    prompt = translation[step.prompt as keyof typeof translation] || step.prompt;
  } else if (typeof step?.prompt === "function") {
    prompt = step.prompt(session);
  } else {
    throw new Error("Invalid prompt type.");
  }

  const options = typeof step.options === "function" ? step.options(session) : step.options;
  const keys = Object.keys(options);

  const optionsText = keys
    .map((key) => `${key}. ${translation[options[key] as keyof typeof translation] || options[key]}`)
    .join("\n");

  let additionalOptions = "";
  if (!step.isInitialStep && !step.expectsInput && !step.isFinalStep) {
    additionalOptions = "00. Main Menu\n0. Back";
  }
  return `CON ${prompt}\n${optionsText}\n${additionalOptions}`;
};

export const handleStep = async (menuData: DynamicFlow, session: Session, userInput?: string): Promise<string> => {
  const currentStep = menuData[session.step] as any;

  if (!currentStep) {
    return `END Error: Invalid step configuration.`;
  }

  if (userInput === undefined) {
    return buildMenu(currentStep, session);
  }

  if (userInput === "00") {
    session.step = StepEnum.MainMenu;
    console.log("User input is 00", session);
    return buildMenu(menuData[StepEnum.MainMenu], session);
  }

  if (userInput === "0") {
    console.log("User input is 0", session);
    const currentStepIndex = Object.keys(menuData).findIndex((step) => step === session.step);
    const previousStep = Object.keys(menuData)[currentStepIndex - 1];
    session.step = previousStep;
    return buildMenu(menuData[previousStep], session);
  }

  if (currentStep.expectsInput) {
    session.previousStep = session.step;
    session.selectedOptions = session.selectedOptions || {};
    session.selectedOptions[session.step] = userInput;
    session.step = currentStep.nextStep?.[OptionEnum.FreeText] || session.step;

    const nextStep = menuData[currentStep.nextStep?.[OptionEnum.FreeText]];
    if (nextStep?.isFinalStep) {
      return `END ${nextStep.prompt}`;
    }

    return buildMenu(nextStep, session);
  }

  const currentOptions = typeof currentStep.options === "function" ? currentStep.options(session) : currentStep.options;

  if (userInput in currentOptions) {
    session.previousStep = session.step;
    session.selectedOptions = session.selectedOptions || {};
    session.selectedOptions[session.step] = userInput;

    if (typeof currentStep.nextStep === "function") {
      session.step = currentStep.nextStep(session, userInput);
    } else {
      session.step = currentStep.nextStep?.[userInput] || session.step;
    }

    if (currentStep.config?.action) {
      await executeAction(currentStep.config, session, userInput);
    }

    if (menuData[session.step]?.isFinalStep) {
      return `END ${menuData[session.step].prompt}`;
    }

    const nextStep = menuData[session.step];
    return buildMenu(nextStep, session);
  }

  return `CON Invalid input. ${currentStep.prompt}\n${generateMenuText(currentOptions)}`;
};

export const stepHandlers = {
  processStep: (menuData: DynamicFlow, session: Session, userInput: string) => {
    return handleStep(menuData, session, userInput);
  },
};

export const executeAction = async (config: ActionConfig, session: Session, userInput: string) => {
  switch (config.action) {
    case ActionTypeEnum.SEND_REPORT:
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
      break;
  }
};
