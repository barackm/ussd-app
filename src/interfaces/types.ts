// deno-lint-ignore-file
export enum ActionTypeEnum {
  SEND_ALERT = "SEND_REPORT",
  CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
  UPDATE_ALERT_STATUS = "UPDATE_ALERT_STATUS",
  CHECK_ALERT_EXISTENCE = "CHECK_ALERT_EXISTENCE",
}

export enum ActionParamTragetEnum {
  COMMUNITY_WORKER = "COMMUNITY_WORKER",
  HEALTH_FACILITY = "HEALTH_FACILITY",
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
  options: { [key: string]: string } | (() => { [key: string]: string });
  nextStep?: { [key: string]: string } | ((userInput: string) => string | { [key: string]: string });
  config?: ActionConfig;
  isFinalStep?: boolean;
  expectsInput?: boolean;
  isInitialStep?: boolean;
  optionMappedValues?: { [key: string]: string };
}

export interface DynamicFlow {
  [stepId: string]: Step;
}

export type Language = "en" | "rw";

export interface Session {
  step: string;
  previousStep?: string | null;
  language: Language;
  serviceCode: string;
  phoneNumber: string;
  networkCode: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  incidentType: string;
  details: string;
  age?: string;
  gender?: string;
  duration?: string;
  affectedIndividuals?: string;
  alertId?: number;
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
type Villages = string[];
type CellRecord = Record<string, Villages>;
type SectorRecord = Record<string, CellRecord[]>;
type DistrictRecord = Record<string, SectorRecord[]>;

export type LocationRawData = Record<string, DistrictRecord[]>;

export type NextStepFunction = (input: string) => Record<string, string> | string;
export type NextStepValue = string | NextStepFunction | Record<string, string>;
