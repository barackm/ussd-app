import type { TranslationKey } from "./translations.ts";

// deno-lint-ignore-file
export enum ActionTypeEnum {
  SEND_REPORT = "SEND_REPORT",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
}

export interface MenuOption {
  [key: number]: string;
}

export interface ActionConfig {
  action?: ActionTypeEnum;
  // deno-lint-ignore no-explicit-any
  params?: Record<string, any>;
}

export interface Step {
  prompt: TranslationKey | ((session: Session) => string);
  options: { [key: string]: TranslationKey };
  nextStep?: { [key: string]: string };
  config?: ActionConfig;
  isFinalStep?: boolean;
}

export interface DynamicFlow {
  [stepId: string]: Step;
}

export type Language = "en" | "fr" | "rw" | "sw";

export interface Session {
  step: string;
  previousStep?: string | null;
  selectedOptions?: { [stepId: string]: string };
  language: Language;
  serviceCode: string;
  phoneNumber: string;
  networkCode: string;
}

export interface Options {
  reportDisease: string;
  reportDisaster: string;
  reportCrime: string;
}

export interface Translation {
  welcome: string;
  selectIncident: string;
  options: Options;
  confirmMessage: (
    incident: string,
    province: string,
    district: string,
    sector: string
  ) => string;
  confirm: string;
  cancel: string;
  goBack: string;
  thankYou: string;
  canceled: string;
}
