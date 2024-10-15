// deno-lint-ignore-file
export enum ActionTypeEnum {
  SEND_REPORT = "SEND_REPORT",
}

export interface MenuOption {
  [key: number]: string;
}

export interface ActionConfig {
  action?: ActionTypeEnum;
  params?: Record<string, any>;
}

export interface Step {
  prompt: string | ((session: Session) => string);
  options: { [key: number]: string };
  nextStep?: { [key: number]: number };
  config?: ActionConfig;
  isFinalStep?: boolean;
}

export interface DynamicFlow {
  [stepId: number]: Step;
}

export interface Session {
  step: number;
  previousStep?: number | null;
  selectedOptions?: { [stepId: number]: number };
}
