import { OptionEnum } from "../enums/menuKeys.ts";
import { type MenuOption, type Step, type Session } from "../interfaces/types.ts";
import { translations } from "../translations/translations.ts";

export const generateMenuText = (options: MenuOption) => {
  return Object.entries(options)
    .map(([key, value]) => (key === OptionEnum.FreeText ? `${value}` : `${key}. ${value}`))
    .join("\n");
};

export const buildMenu = (step: Step, session: Session) => {
  const language = session.language || "en";
  const translation = translations[language];

  const prompt =
    typeof step?.prompt === "string"
      ? translation[step.prompt as keyof typeof translation] || step.prompt
      : typeof step?.prompt === "function"
      ? step.prompt(session)
      : (() => {
          throw new Error("Invalid prompt type.");
        })();

  const options = typeof step.options === "function" ? step.options(session) : step.options;
  const optionsText = Object.keys(options)
    .map((key) =>
      key === OptionEnum.FreeText
        ? `${translation[options[key] as keyof typeof translation] || options[key]}`
        : `${key}. ${translation[options[key] as keyof typeof translation] || options[key]}`,
    )
    .join("\n");

  const additionalOptions =
    !step.isInitialStep && !step.expectsInput && !step.isFinalStep ? "00. Main Menu\n0. Back" : "";

  return `CON ${prompt}\n${optionsText}\n${additionalOptions}`;
};
