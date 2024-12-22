import { OptionEnum } from "../enums/menuKeys.ts";
import { type MenuOption, type Step, type Session } from "../interfaces/types.ts";
import { translate } from "../translations/translate.ts";

export const generateMenuText = (options: MenuOption) => {
  return Object.entries(options)
    .map(([key, value]) => (key === OptionEnum.FreeText ? `${value}` : `${key}. ${value}`))
    .join("\n");
};

export const buildMenu = (step: Step, session: Session) => {
  const prompt =
    typeof step?.prompt === "string"
      ? translate(step.prompt as string)
      : typeof step?.prompt === "function"
      ? step.prompt(session)
      : (() => {
          throw new Error("Invalid prompt type.");
        })();

  const options = typeof step.options === "function" ? step.options() : step.options;
  const optionsText = Object.keys(options)
    .map((key) =>
      key === OptionEnum.FreeText
        ? `${translate(options[key] as string)}`
        : `${key}) ${translate(options[key] as string)}`,
    )
    .join("\n");

  const additionalOptions =
    !step.isInitialStep && !step.expectsInput && !step.isFinalStep
      ? `${translate("main_menu_option")}\n${translate("back_option")}`
      : "";

  return `CON ${prompt}\n${optionsText}\n${additionalOptions}`;
};
