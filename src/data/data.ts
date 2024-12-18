import { OptionEnum, StepEnum } from "../enums/menuKeys.ts";
import { ActionParamTragetEnum, ActionTypeEnum, DynamicFlow } from "../interfaces/types.ts";
import { sessionStore } from "../sessionStore.ts";
import { AlertStatus } from "../types/alerts.ts";
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
    nextStep: (userInput: string) => {
      const { reverseMap } = getProvincesOptions();
      const provinceName = reverseMap[userInput];
      sessionStore.update({
        province: provinceName,
      });

      return StepEnum.DistrictSelection;
    },
  },
  [StepEnum.DistrictSelection]: {
    prompt: "Please select your District:",
    options: () => {
      const session = sessionStore.get();
      const selectedProvince = session.province;
      const { menuOptions } = getDistrictsOptions(selectedProvince!);
      return menuOptions;
    },
    nextStep: (userInput: string) => {
      const session = sessionStore.get();
      const selectedProvince = session.province;
      const { reverseMap } = getDistrictsOptions(selectedProvince!);
      const districtName = reverseMap[userInput];

      sessionStore.update({
        district: districtName,
      });

      return StepEnum.SectorSelection;
    },
  },
  [StepEnum.SectorSelection]: {
    prompt: "Please select your Sector:",
    options: () => {
      const session = sessionStore.get();
      const { menuOptions } = getSectorsOptions(session.province, session.district);
      return menuOptions;
    },
    nextStep: (userInput: string) => {
      const session = sessionStore.get();
      const { reverseMap } = getSectorsOptions(session.province, session.district);
      const sectorName = reverseMap[userInput];

      sessionStore.update({
        sector: sectorName,
      });

      return StepEnum.CellSelection;
    },
  },
  [StepEnum.CellSelection]: {
    prompt: "Please select your Cell:",
    options: () => {
      const session = sessionStore.get();
      const { menuOptions } = getCellsOptions(session.province, session.district, session.sector);
      return menuOptions;
    },
    nextStep: (userInput: string) => {
      const session = sessionStore.get();
      const { reverseMap } = getCellsOptions(session.province, session.district, session.sector);
      const cellName = reverseMap[userInput];

      sessionStore.update({
        cell: cellName,
      });

      return StepEnum.VillageSelection;
    },
  },
  [StepEnum.VillageSelection]: {
    prompt: "Please select your Village:",
    options: () => {
      const session = sessionStore.get();
      const { menuOptions } = getVillagesOptions(session.province, session.district, session.sector, session.cell);
      return menuOptions;
    },
    nextStep: (userInput: string) => {
      const session = sessionStore.get();
      const { reverseMap } = getVillagesOptions(session.province, session.district, session.sector, session.cell);
      const villageName = reverseMap[userInput];

      sessionStore.update({
        village: villageName,
      });

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
    nextStep: (userInput) => {
      const selectedOptionText = (incidentReport[StepEnum.IncidentSelection]?.options as Record<string, string>)?.[
        userInput
      ];
      sessionStore.update({
        incidentType: selectedOptionText,
      });
      return {
        [OptionEnum.HumanDisease]: StepEnum.AffectedIndividuals,
        [OptionEnum.HumanDeath]: StepEnum.AffectedIndividuals,
        [OptionEnum.AnimalDiseaseDeath]: StepEnum.AffectedIndividuals,
        [OptionEnum.EbolaLikeSymptoms]: StepEnum.AffectedIndividuals,
        [OptionEnum.DogBites]: StepEnum.AffectedIndividuals,
      };
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
    nextStep: (userInput: string) => {
      const selectedOptionText = (incidentReport[StepEnum.AffectedIndividuals]?.options as Record<string, string>)?.[
        userInput
      ];
      sessionStore.update({
        affectedIndividuals: selectedOptionText,
      });

      return {
        [OptionEnum.OneToFiveIndividuals]: StepEnum.Gender,
        [OptionEnum.SixToTenIndividuals]: StepEnum.Gender,
        [OptionEnum.MoreThanTenIndividuals]: StepEnum.Gender,
      };
    },
  },
  [StepEnum.Gender]: {
    prompt: "Please select the gender:",
    options: {
      [OptionEnum.Male]: "Male",
      [OptionEnum.Female]: "Female",
    },
    nextStep: (userInput: string) => {
      const selectedOptionText = (incidentReport[StepEnum.Gender]?.options as Record<string, string>)?.[userInput];
      sessionStore.update({
        gender: selectedOptionText,
      });
      return {
        [OptionEnum.Male]: StepEnum.Age,
        [OptionEnum.Female]: StepEnum.Age,
      };
    },
  },
  [StepEnum.Age]: {
    prompt: "Please enter the age:",
    expectsInput: true,
    options: {
      [OptionEnum.FreeText]: "",
    },
    nextStep: (userInput: string) => {
      sessionStore.update({
        age: userInput,
      });
      return {
        [OptionEnum.FreeText]: StepEnum.DurationSinceIncident,
      };
    },
  },
  [StepEnum.DurationSinceIncident]: {
    prompt: "How long ago did the incident occur? (e.g. 2 hours, 1 day):",
    expectsInput: true,
    options: {
      [OptionEnum.FreeText]: "",
    },
    nextStep: (userInput: string) => {
      sessionStore.update({
        duration: userInput,
      });
      return {
        [OptionEnum.FreeText]: StepEnum.ConfirmReportDetails,
      };
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
    config: { action: ActionTypeEnum.SEND_ALERT },
  },
  [StepEnum.ReportSubmission]: {
    prompt: "Thank you! Your report has been submitted.",
    options: {},
    isFinalStep: true,
  },
  [StepEnum.FollowUpAlert]: {
    prompt: "Please enter your alert ID to follow up:",
    options: {
      [OptionEnum.FreeText]: "",
    },
    expectsInput: true,
    nextStep: {
      [OptionEnum.FreeText]: StepEnum.ProvideFollowUpStatus,
    },
    config: {
      action: ActionTypeEnum.CHECK_ALERT_EXISTENCE,
      params: {
        target: ActionParamTragetEnum.COMMUNITY_WORKER,
      },
    },
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
    optionMappedValues: {
      [OptionEnum.FalseAlert]: AlertStatus.FALSE_ALERT,
      [OptionEnum.SituationImproved]: AlertStatus.IMPROVED,
      [OptionEnum.SituationWorsened]: AlertStatus.WORSENED,
    },
    config: {
      action: ActionTypeEnum.UPDATE_ALERT_STATUS,
      params: {
        target: ActionParamTragetEnum.COMMUNITY_WORKER,
      },
    },
  },
  [StepEnum.AlertStatusUpdated]: {
    prompt: "Thank you! The status of the alert has been updated.",
    options: {},
    isFinalStep: true,
  },
  [StepEnum.ConfirmAlertID]: {
    prompt: "Please provide the alert ID to confirm the status:",
    options: {
      [OptionEnum.FreeText]: "",
    },
    expectsInput: true,
    nextStep: {
      [OptionEnum.FreeText]: StepEnum.ConfirmAlertStatus,
    },
    config: {
      action: ActionTypeEnum.CHECK_ALERT_EXISTENCE,
      params: {
        target: ActionParamTragetEnum.HEALTH_FACILITY,
      },
    },
  },
  [StepEnum.ConfirmAlertStatus]: {
    prompt: "Please confirm the alert status:",
    options: {
      [OptionEnum.ExaminationContinues]: "Examination Continues",
      [OptionEnum.DiseaseContained]: "Disease Contained",
    },
    nextStep: {
      [OptionEnum.ExaminationContinues]: StepEnum.AlertStatusUpdated,
      [OptionEnum.DiseaseContained]: StepEnum.AlertStatusUpdated,
    },
    config: {
      action: ActionTypeEnum.UPDATE_ALERT_STATUS,
      params: {
        target: ActionParamTragetEnum.HEALTH_FACILITY,
      },
    },
    optionMappedValues: {
      [OptionEnum.ExaminationContinues]: AlertStatus.EXAMINATION_CONTINUES,
      [OptionEnum.DiseaseContained]: AlertStatus.CONTAINED,
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
