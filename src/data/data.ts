import { OptionEnum, StepEnum } from "../enums/menuKeys.ts";
import { ActionTypeEnum, DynamicFlow, type Session } from "../interfaces/types.ts";
import {
  getCellsOptions,
  getDistrictsOptions,
  getProvincesOptions,
  getSectorsOptions,
  getVillagesOptions,
} from "../utils/locationUtils.ts";

export const locationFlow: DynamicFlow = {
  [StepEnum.ProvinceSelection]: {
    prompt: "Please select your Province:",
    options: () => {
      const { menuOptions } = getProvincesOptions();
      return menuOptions;
    },
    nextStep: (session: Session, userInput: string) => {
      const { reverseMap } = getProvincesOptions();
      const provinceName = reverseMap[userInput];
      session.selectedOptions = { ...session.selectedOptions, [StepEnum.ProvinceSelection]: provinceName };
      return StepEnum.DistrictSelection;
    },
  },
  [StepEnum.DistrictSelection]: {
    prompt: "Please select your District:",
    options: (session: Session) => {
      const { menuOptions } = getDistrictsOptions(session.selectedOptions?.[StepEnum.ProvinceSelection]!);
      return menuOptions;
    },
    nextStep: (session: Session, userInput: string) => {
      const { reverseMap } = getDistrictsOptions(session.selectedOptions?.[StepEnum.ProvinceSelection]!);
      const districtName = reverseMap[userInput];
      session.selectedOptions = { ...session.selectedOptions, [StepEnum.DistrictSelection]: districtName };
      return StepEnum.SectorSelection;
    },
  },
  [StepEnum.SectorSelection]: {
    prompt: "Please select your Sector:",
    options: (session: Session) => {
      const { menuOptions } = getSectorsOptions(
        session.selectedOptions?.[StepEnum.ProvinceSelection]!,
        session.selectedOptions?.[StepEnum.DistrictSelection]!,
      );
      return menuOptions;
    },
    nextStep: (session: Session, userInput: string) => {
      const { reverseMap } = getSectorsOptions(
        session.selectedOptions?.[StepEnum.ProvinceSelection]!,
        session.selectedOptions?.[StepEnum.DistrictSelection]!,
      );
      const sectorName = reverseMap[userInput];
      session.selectedOptions = { ...session.selectedOptions, [StepEnum.SectorSelection]: sectorName };
      return StepEnum.CellSelection;
    },
  },
  [StepEnum.CellSelection]: {
    prompt: "Please select your Cell:",
    options: (session: Session) => {
      const { menuOptions } = getCellsOptions(
        session.selectedOptions?.[StepEnum.ProvinceSelection]!,
        session.selectedOptions?.[StepEnum.DistrictSelection]!,
        session.selectedOptions?.[StepEnum.SectorSelection]!,
      );
      return menuOptions;
    },
    nextStep: (session: Session, userInput: string) => {
      const { reverseMap } = getCellsOptions(
        session.selectedOptions?.[StepEnum.ProvinceSelection]!,
        session.selectedOptions?.[StepEnum.DistrictSelection]!,
        session.selectedOptions?.[StepEnum.SectorSelection]!,
      );
      const cellName = reverseMap[userInput];
      session.selectedOptions = { ...session.selectedOptions, [StepEnum.CellSelection]: cellName };
      return StepEnum.VillageSelection;
    },
  },
  [StepEnum.VillageSelection]: {
    prompt: "Please select your Village:",
    options: (session: Session) => {
      const { menuOptions } = getVillagesOptions(
        session.selectedOptions?.[StepEnum.ProvinceSelection]!,
        session.selectedOptions?.[StepEnum.DistrictSelection]!,
        session.selectedOptions?.[StepEnum.SectorSelection]!,
        session.selectedOptions?.[StepEnum.CellSelection]!,
      );
      return menuOptions;
    },
    nextStep: (session: Session, userInput: string) => {
      const { reverseMap } = getVillagesOptions(
        session.selectedOptions?.[StepEnum.ProvinceSelection]!,
        session.selectedOptions?.[StepEnum.DistrictSelection]!,
        session.selectedOptions?.[StepEnum.SectorSelection]!,
        session.selectedOptions?.[StepEnum.CellSelection]!,
      );
      const villageName = reverseMap[userInput];
      session.selectedOptions = { ...session.selectedOptions, [StepEnum.VillageSelection]: villageName };
      return StepEnum.IncidentSelection;
    },
  },
};

export const incidentReport: DynamicFlow = {
  [StepEnum.MainMenu]: {
    prompt: "Please select an option:",
    options: {
      [OptionEnum.ReportSuspiciousActivity]: "Report Suspicious Activity",
      [OptionEnum.FollowUpAlert]: "Follow-up on an Alert",
      [OptionEnum.ConfirmAlert]: "Confirm an Alert",
      [OptionEnum.ChangeLanguage]: "Change Language",
    },
    nextStep: {
      [OptionEnum.ReportSuspiciousActivity]: StepEnum.ProvinceSelection,
      [OptionEnum.FollowUpAlert]: StepEnum.FollowUpAlert,
      [OptionEnum.ConfirmAlert]: StepEnum.ConfirmAlertID,
      [OptionEnum.ChangeLanguage]: StepEnum.ChangeLanguage,
    },
    config: { action: ActionTypeEnum.SEND_REPORT },
    isInitialStep: true,
  },
  [StepEnum.IncidentSelection]: {
    prompt: "Please select the type of incident you want to report:",
    options: {
      [OptionEnum.HumanDisease]: "Human Disease",
      [OptionEnum.HumanDeath]: "Human Death",
      [OptionEnum.AnimalDiseaseDeath]: "Animal Disease/Death",
      [OptionEnum.EbolaLikeSymptoms]: "Ebola-like Symptoms",
      [OptionEnum.DogBites]: "Dog Bites",
    },
    nextStep: {
      [OptionEnum.HumanDisease]: StepEnum.AffectedIndividuals,
      [OptionEnum.HumanDeath]: StepEnum.AffectedIndividuals,
      [OptionEnum.AnimalDiseaseDeath]: StepEnum.AffectedIndividuals,
      [OptionEnum.EbolaLikeSymptoms]: StepEnum.AffectedIndividuals,
      [OptionEnum.DogBites]: StepEnum.AffectedIndividuals,
    },
  },
  ...locationFlow,
  [StepEnum.AffectedIndividuals]: {
    prompt: "Please provide the number of individuals affected:",
    options: {
      [OptionEnum.OneToFiveIndividuals]: "1-5 Individuals",
      [OptionEnum.SixToTenIndividuals]: "6-10 Individuals",
      [OptionEnum.MoreThanTenIndividuals]: "More than 10 Individuals",
    },
    nextStep: {
      [OptionEnum.OneToFiveIndividuals]: StepEnum.AdditionalDetails,
      [OptionEnum.SixToTenIndividuals]: StepEnum.AdditionalDetails,
      [OptionEnum.MoreThanTenIndividuals]: StepEnum.AdditionalDetails,
    },
  },
  [StepEnum.AdditionalDetails]: {
    prompt: "Please provide additional information:",
    options: {
      [OptionEnum.Gender]: "Gender (Male/Female)",
      [OptionEnum.Age]: "Age",
      [OptionEnum.DurationSinceIncident]: "Duration since the incident",
    },
    expectsInput: true,
    nextStep: {
      [OptionEnum.Gender]: StepEnum.ConfirmReportDetails,
    },
  },
  [StepEnum.ConfirmReportDetails]: {
    prompt: "Please confirm the details of your report:",
    options: {
      [OptionEnum.ConfirmReport]: "Confirm Report",
      [OptionEnum.CancelReport]: "Cancel Report",
    },
    nextStep: {
      [OptionEnum.ConfirmReport]: StepEnum.ReportSubmission,
      [OptionEnum.CancelReport]: StepEnum.MainMenu,
    },
    config: { action: ActionTypeEnum.SEND_REPORT },
  },
  [StepEnum.ReportSubmission]: {
    prompt: "Thank you! Your report has been submitted.",
    options: {},
    isFinalStep: true,
  },
  [StepEnum.FollowUpAlert]: {
    prompt: "Please enter your alert ID to follow up:",
    options: {
      [OptionEnum.FreeText]: "Enter Alert ID",
    },
    expectsInput: true,
    nextStep: {
      [OptionEnum.FreeText]: StepEnum.ProvideFollowUpStatus,
    },
    config: { action: ActionTypeEnum.CHECK_ALERT_EXISTENCE },
  },
  [StepEnum.ProvideFollowUpStatus]: {
    prompt: "Please provide the status of the alert:",
    options: {
      [OptionEnum.FalseAlert]: "False Alert",
      [OptionEnum.SituationImproved]: "Situation Improved",
      [OptionEnum.SituationWorsened]: "Situation Worsened",
    },
    nextStep: {
      [OptionEnum.FalseAlert]: StepEnum.AlertStatusUpdated,
      [OptionEnum.SituationImproved]: StepEnum.AlertStatusUpdated,
      [OptionEnum.SituationWorsened]: StepEnum.AlertStatusUpdated,
    },
    config: { action: ActionTypeEnum.UPDATE_ALERT_STATUS },
  },
  [StepEnum.AlertStatusUpdated]: {
    prompt: "Thank you! The status of the alert has been updated.",
    options: {},
    isFinalStep: true,
  },
  [StepEnum.ConfirmAlertID]: {
    prompt: "Please provide the alert ID to confirm the status:",
    options: {
      [OptionEnum.FreeText]: "Enter Alert ID",
    },
    expectsInput: true,
    nextStep: {
      [OptionEnum.FreeText]: StepEnum.ConfirmAlertStatus,
    },
    config: { action: ActionTypeEnum.CHECK_ALERT_EXISTENCE },
  },
  [StepEnum.ConfirmAlertStatus]: {
    prompt: "Please confirm the alert status:",
    options: {
      [OptionEnum.ExaminationContinues]: "Examination Continues",
      [OptionEnum.DiseaseContained]: "Disease Contained",
    },
    nextStep: {
      [OptionEnum.ExaminationContinues]: StepEnum.MainMenu,
      [OptionEnum.DiseaseContained]: StepEnum.MainMenu,
    },
  },
  [StepEnum.ChangeLanguage]: {
    prompt: "Please select your language:",
    options: {
      [OptionEnum.English]: "English",
      [OptionEnum.Kinyarwanda]: "Kinyarwanda",
    },
    nextStep: {
      [OptionEnum.English]: StepEnum.MainMenu,
      [OptionEnum.Kinyarwanda]: StepEnum.MainMenu,
    },
    config: {
      action: ActionTypeEnum.CHANGE_LANGUAGE,
      params: {
        languageMap: {
          [OptionEnum.English]: "en",
          [OptionEnum.Kinyarwanda]: "rw",
        },
      },
    },
  },
};
