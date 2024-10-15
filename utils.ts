import {
  type MenuOption,
  type Step,
  type Session,
  ActionTypeEnum,
  type ActionConfig,
} from "./types.ts";
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

  const promptMessage =
    typeof step.prompt === "function" ? step.prompt(session) : step.prompt;

  let menuText = generateMenuText(step.options);

  if (session.step !== 1 && !step.isFinalStep) {
    menuText += `\n0. Go Back`;
  }

  return `CON ${promptMessage}\n${menuText}`;
};

export const handleStep = async (
  session: Session,
  userInput?: number
): Promise<string> => {
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

    if (currentStep.config?.action) {
      await executeAction(currentStep.config, session);
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
  processStep: (session: Session, userInput: number) => {
    return handleStep(session, userInput);
  },
};

export const executeAction = async (config: ActionConfig, session: Session) => {
  switch (config.action) {
    case ActionTypeEnum.SEND_REPORT:
      console.log(
        `Log Action:`,
        config.params?.message || "No message",
        session
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      break;
    default:
      console.log("Unknown action type");
  }
};
