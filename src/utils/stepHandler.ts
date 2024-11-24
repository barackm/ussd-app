import { StepEnum } from "../enums/menuKeys.ts";
import { OptionEnum } from "../enums/menuKeys.ts";
import { type Step, type Session, type DynamicFlow } from "../interfaces/types.ts";
import { buildMenu, generateMenuText } from "./menuUtils.ts";
import { executeAction } from "./actionExecutor.ts";

const handleNavigation = (menuData: DynamicFlow, session: Session, userInput: string) => {
  if (userInput === "00") {
    session.step = StepEnum.MainMenu;
    return buildMenu(menuData[StepEnum.MainMenu], session);
  }

  if (userInput === "0") {
    const currentStepIndex = Object.keys(menuData).findIndex((step) => step === session.step);
    const previousStep = Object.keys(menuData)[currentStepIndex - 1];
    session.step = previousStep;
    return buildMenu(menuData[previousStep], session);
  }

  return null;
};

const handleAction = async (currentStep: Step, session: Session, userInput: string) => {
  if (currentStep.config?.action) {
    const res = await executeAction(currentStep.config, session, userInput);
    if (!res.success) {
      return `END ${res.message}`;
    }
  }
  return null;
};

export const handleStep = async (menuData: DynamicFlow, session: Session, userInput?: string): Promise<string> => {
  const currentStep = menuData[session.step] as any;

  if (!currentStep) {
    return `END Error: Invalid step configuration.`;
  }

  if (userInput === undefined) {
    return buildMenu(currentStep, session);
  }

  const navigationResult = handleNavigation(menuData, session, userInput);
  if (navigationResult) return navigationResult;

  const actionResult = await handleAction(currentStep, session, userInput);
  if (actionResult) return actionResult;

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

    session.step =
      typeof currentStep.nextStep === "function"
        ? currentStep.nextStep(session, userInput)
        : currentStep.nextStep?.[userInput] || session.step;

    if (menuData[session.step]?.isFinalStep) {
      return `END ${menuData[session.step].prompt}`;
    }

    return buildMenu(menuData[session.step], session);
  }

  return `CON Invalid input. ${currentStep.prompt}\n${generateMenuText(currentOptions)}`;
};
