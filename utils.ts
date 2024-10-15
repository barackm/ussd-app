import type { MenuOption, Step, Session } from "./types.ts";
import { dynamicFlow } from "./data.ts";

export const generateMenuText = (options: MenuOption) => {
  return Object.entries(options)
    .map(([key, value]) => `${key}. ${value}`)
    .join("\n");
};

export const buildMenu = (step: Step, session: Session) => {
  if (!step || !step.options) {
    return `END Error: Invalid step configuration.`;
  }

  let menuText = generateMenuText(step.options);

  if (session.step !== 1 && !step.isFinalStep) {
    menuText += `\n0. Go Back`;
  }

  return `CON ${step.prompt}\n${menuText}`;
};

export const handleStep = (session: Session, userInput?: number): string => {
  const currentStep = dynamicFlow[session.step];

  if (!currentStep) {
    return `END Error: Invalid step configuration.`;
  }

  if (userInput === undefined) {
    return buildMenu(currentStep, session);
  }

  if (userInput === 0 && session.previousStep) {
    session.step = session.previousStep;
    session.previousStep = null;
    return buildMenu(dynamicFlow[session.step], session);
  }

  if (userInput in currentStep.options) {
    session.previousStep = session.step;
    session.selectedOptions = session.selectedOptions || {};
    session.selectedOptions[session.step] = userInput;

    session.step = currentStep.nextStep?.[userInput] || session.step;

    if (dynamicFlow[session.step]?.isFinalStep) {
      return `END ${dynamicFlow[session.step].prompt}`;
    }

    return buildMenu(dynamicFlow[session.step], session);
  }

  return `CON Invalid input. ${currentStep.prompt}\n${generateMenuText(
    currentStep.options
  )}`;
};

export const stepHandlers = {
  processStep: (session: Session, userInput: number) => {
    return handleStep(session, userInput);
  },
};
