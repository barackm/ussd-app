import { StepEnum } from "../enums/menuKeys.ts";
import { OptionEnum } from "../enums/menuKeys.ts";
import { type Step, type DynamicFlow, NextStepValue } from "../interfaces/types.ts";
import { buildMenu, generateMenuText } from "./menuUtils.ts";
import { executeAction } from "./actionExecutor.ts";
import { sessionStore } from "../sessionStore.ts";

function resolveNextStep(nextStep: NextStepValue | undefined, userInput: string): string | undefined {
  if (!nextStep) return undefined;

  if (typeof nextStep === "string") {
    return nextStep;
  }

  if (typeof nextStep === "function") {
    const result = nextStep(userInput);
    return typeof result === "string" ? result : result?.[userInput];
  }

  return nextStep[userInput];
}

const handleNavigation = (menuData: DynamicFlow, userInput: string): string | null => {
  const session = sessionStore.get();

  if (userInput === "00") {
    sessionStore.update({
      step: StepEnum.MainMenu,
    });
    return buildMenu(menuData[StepEnum.MainMenu], sessionStore.get());
  }

  if (userInput === "0") {
    const currentStepIndex = Object.keys(menuData).findIndex((step) => step === session.step);
    const previousStep = Object.keys(menuData)[currentStepIndex - 1];
    sessionStore.update({
      step: previousStep,
    });
    return buildMenu(menuData[previousStep], sessionStore.get());
  }

  return null;
};

const handleAction = async (currentStep: Step, userInput: string): Promise<string | undefined> => {
  const session = sessionStore.get();

  if (currentStep.config?.action) {
    const res = await executeAction(currentStep.config, session, userInput);
    if (!res.success) {
      return `END ${res.message}`;
    }
  }
  return;
};

export const handleStep = async (menuData: DynamicFlow, userInput?: string): Promise<string> => {
  const session = sessionStore.get();
  const currentStep = menuData[session.step] as any;

  if (!currentStep) {
    return `END Error: Invalid step configuration.`;
  }

  if (userInput === undefined) {
    return buildMenu(currentStep, session);
  }

  const navigationResult = handleNavigation(menuData, userInput);
  if (navigationResult) return navigationResult;

  const res = await handleAction(currentStep, userInput);
  if (res) {
    return res;
  }

  if (currentStep.expectsInput) {
    const resolvedNextStep = resolveNextStep(currentStep.nextStep, OptionEnum.FreeText);

    sessionStore.update({
      previousStep: session.step,
      step: resolvedNextStep || session.step,
    });

    const nextStep = menuData[resolvedNextStep as string];

    if (nextStep?.isFinalStep) {
      await sessionStore.save();
      return `END ${nextStep.prompt}`;
    }

    await sessionStore.save();
    return buildMenu(nextStep, sessionStore.get());
  }

  const currentOptions = typeof currentStep.options === "function" ? currentStep.options() : currentStep.options;

  if (userInput in currentOptions) {
    const nextStepValue = resolveNextStep(currentStep.nextStep, userInput);

    sessionStore.update({
      previousStep: session.step,
      step: nextStepValue || session.step,
    });
    if (menuData[session.step]?.isFinalStep) {
      await sessionStore.save();
      return `END ${menuData[session.step].prompt}`;
    }

    await sessionStore.save();
    return buildMenu(menuData[session.step], sessionStore.get());
  }

  return `CON Invalid input. ${currentStep.prompt}\n${generateMenuText(currentOptions)}`;
};
