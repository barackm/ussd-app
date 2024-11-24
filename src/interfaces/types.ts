// deno-lint-ignore-file
export enum ActionTypeEnum {
  SEND_REPORT = "SEND_REPORT",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
}

export interface MenuOption {
  [key: string]: string;
}

export interface ActionConfig {
  action?: ActionTypeEnum;
  params?: Record<string, any>;
}

export interface Step {
  prompt: any | ((session: Session) => string);
  options: { [key: string]: string } | ((session: Session) => { [key: string]: string });
  nextStep?: { [key: string]: string } | ((session: Session, userInput: string) => string);
  config?: ActionConfig;
  isFinalStep?: boolean;
  expectsInput?: boolean;
  isInitialStep?: boolean;
}

export interface DynamicFlow {
  [stepId: string]: Step;
}

export type Language = "en" | "rw";

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
  confirmMessage: (incident: string, province: string, district: string, sector: string) => string;
  confirm: string;
  cancel: string;
  goBack: string;
  thankYou: string;
  canceled: string;
}

export interface Province {
  name: string;
  districts: District[];
}

export interface District {
  name: string;
  sectors: Sector[];
}

export interface Sector {
  name: string;
  cells: Cell[];
}

export interface Cell {
  name: string;
  villages: string[];
}

export interface LocationMap {
  [province: string]: {
    districts: {
      [district: string]: {
        sectors: {
          [sector: string]: {
            cells: {
              [cell: string]: {
                villages: string[];
              };
            };
          };
        };
      };
    };
  };
}

export type LocationRawData = {
  [province: string]: Array<{
    [district: string]: Array<{
      [sector: string]: Array<{
        [cell: string]: Array<string>;
      }>;
    }>;
  }>;
};
