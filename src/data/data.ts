import { OptionEnum, StepEnum } from "../enums/menuKeys.ts";
import { ActionParamTragetEnum, ActionTypeEnum, DynamicFlow } from "../interfaces/types.ts";
import { sessionStore } from "../sessionStore.ts";
import { TranslationKey } from "../translations/translations.ts";
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
      return menuOptions as any;
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
      return menuOptions as any;
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
      return menuOptions as any;
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
      return menuOptions as any;
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
      return menuOptions as any;
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
    prompt: "mainMenu.prompt",
    options: {
      [OptionEnum.ReportSuspiciousActivity]: "mainMenu.options.reportSuspiciousActivity",
      [OptionEnum.FollowUpAlert]: "mainMenu.options.followUpAlert",
      [OptionEnum.ConfirmAlert]: "mainMenu.options.confirmAlert",
      [OptionEnum.ChangeLanguage]: "mainMenu.options.changeLanguage",
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
    prompt: "incidentSelection.prompt",
    options: {
      [OptionEnum.HumanDisease]: "incidentSelection.options.humanDisease",
      [OptionEnum.HumanDeath]: "incidentSelection.options.humanDeath",
      [OptionEnum.AnimalDiseaseDeath]: "incidentSelection.options.animalDiseaseDeath",
      [OptionEnum.EbolaLikeSymptoms]: "incidentSelection.options.ebolaLikeSymptoms",
      [OptionEnum.DogBites]: "incidentSelection.options.dogBites",
    },
    nextStep: (userInput) => {
      const selectedOptionText = (
        incidentReport[StepEnum.IncidentSelection]?.options as Record<string, TranslationKey>
      )?.[userInput];
      sessionStore.update({
        incidentType: String(selectedOptionText),
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
    prompt: "affectedIndividuals.prompt",
    options: {
      [OptionEnum.OneToFiveIndividuals]: "affectedIndividuals.options.oneToFive",
      [OptionEnum.SixToTenIndividuals]: "affectedIndividuals.options.sixToTen",
      [OptionEnum.MoreThanTenIndividuals]: "affectedIndividuals.options.moreThanTen",
    },
    nextStep: (userInput: string) => {
      const selectedOptionText = (
        incidentReport[StepEnum.AffectedIndividuals]?.options as Record<string, TranslationKey>
      )?.[userInput];
      sessionStore.update({
        affectedIndividuals: String(selectedOptionText),
      });

      return {
        [OptionEnum.OneToFiveIndividuals]: StepEnum.Gender,
        [OptionEnum.SixToTenIndividuals]: StepEnum.Gender,
        [OptionEnum.MoreThanTenIndividuals]: StepEnum.Gender,
      };
    },
  },
  [StepEnum.Gender]: {
    prompt: "gender.prompt",
    options: {
      [OptionEnum.Male]: "gender.options.male",
      [OptionEnum.Female]: "gender.options.female",
    },
    nextStep: (userInput: string) => {
      const selectedOptionText = (incidentReport[StepEnum.Gender]?.options as Record<string, TranslationKey>)?.[
        userInput
      ];
      sessionStore.update({
        gender: String(selectedOptionText),
      });
      return {
        [OptionEnum.Male]: StepEnum.Age,
        [OptionEnum.Female]: StepEnum.Age,
      };
    },
  },
  [StepEnum.Age]: {
    prompt: "age.prompt",
    expectsInput: true,
    options: {
      [OptionEnum.FreeText]: "age.options.freeText",
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
    prompt: "durationSinceIncident.prompt",
    expectsInput: true,
    options: {
      [OptionEnum.FreeText]: "durationSinceIncident.options.freeText",
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
    prompt: "confirmReportDetails.prompt",
    options: {
      [OptionEnum.ConfirmReport]: "confirmReportDetails.options.confirm",
      [OptionEnum.CancelReport]: "confirmReportDetails.options.cancel",
    },
    nextStep: {
      [OptionEnum.ConfirmReport]: StepEnum.ReportSubmission,
      [OptionEnum.CancelReport]: StepEnum.MainMenu,
    },
    config: { action: ActionTypeEnum.SEND_ALERT },
  },
  [StepEnum.ReportSubmission]: {
    prompt: "reportSubmission.prompt",
    options: {},
    isFinalStep: true,
  },
  [StepEnum.FollowUpAlert]: {
    prompt: "followUpAlert.prompt",
    options: {
      [OptionEnum.FreeText]: "followUpAlert.options.freeText",
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
    prompt: "provideFollowUpStatus.prompt",
    options: {
      [OptionEnum.FalseAlert]: "provideFollowUpStatus.options.falseAlert",
      [OptionEnum.SituationImproved]: "provideFollowUpStatus.options.situationImproved",
      [OptionEnum.SituationWorsened]: "provideFollowUpStatus.options.situationWorsened",
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
    prompt: "alertStatusUpdated.prompt",
    options: {},
    isFinalStep: true,
  },
  [StepEnum.ConfirmAlertID]: {
    prompt: "confirmAlertID.prompt",
    options: {
      [OptionEnum.FreeText]: "confirmAlertID.options.freeText",
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
    prompt: "confirmAlertStatus.prompt",
    options: {
      [OptionEnum.ExaminationContinues]: "confirmAlertStatus.options.examinationContinues", // [CONF.AI]
      [OptionEnum.DiseaseContained]: "confirmAlertStatus.options.diseaseContained", // [CONF.CL]
      [OptionEnum.CasesDecreased]: "confirmAlertStatus.options.casesDecreased", // [CMT.CD]
      [OptionEnum.NoChange]: "confirmAlertStatus.options.noChange", // [CMT.NCH]
      [OptionEnum.CasesIncreased]: "confirmAlertStatus.options.casesIncreased", // [CMT.CI]
      [OptionEnum.DeathsOccurred]: "confirmAlertStatus.options.deathsOccurred", // [CMT.DO]
    },
    nextStep: {
      [OptionEnum.ExaminationContinues]: StepEnum.AlertStatusUpdated,
      [OptionEnum.DiseaseContained]: StepEnum.AlertStatusUpdated,
      [OptionEnum.CasesDecreased]: StepEnum.AlertStatusUpdated,
      [OptionEnum.NoChange]: StepEnum.AlertStatusUpdated,
      [OptionEnum.CasesIncreased]: StepEnum.AlertStatusUpdated,
      [OptionEnum.DeathsOccurred]: StepEnum.AlertStatusUpdated,
    },
    config: {
      action: ActionTypeEnum.UPDATE_ALERT_STATUS,
      params: {
        target: ActionParamTragetEnum.HEALTH_FACILITY,
      },
    },
    optionMappedValues: {
      [OptionEnum.ExaminationContinues]: AlertStatus.EXAMINATION_CONTINUES, // [CONF.AI]
      [OptionEnum.DiseaseContained]: AlertStatus.CONTAINED, // [CONF.CL]
      [OptionEnum.CasesDecreased]: AlertStatus.CASES_DECREASED, // [CMT.CD]
      [OptionEnum.NoChange]: AlertStatus.NO_CHANGE, // [CMT.NCH]
      [OptionEnum.CasesIncreased]: AlertStatus.CASES_INCREASED, // [CMT.CI]
      [OptionEnum.DeathsOccurred]: AlertStatus.DEATHS_OCCURRED, // [CMT.DO]
    },
  },
  [StepEnum.ChangeLanguage]: {
    prompt: "changeLanguage.prompt",
    options: {
      [OptionEnum.English]: "changeLanguage.options.english",
      [OptionEnum.Kinyarwanda]: "changeLanguage.options.kinyarwanda",
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

export const translationKeyToCodeMap: Record<string, string> = {
  // Incident Types
  "incidentSelection.options.humanDisease": "HI",
  "incidentSelection.options.humanDeath": "HD",
  "incidentSelection.options.animalDiseaseDeath": "AID",
  "incidentSelection.options.ebolaLikeSymptoms": "VHF",
  "incidentSelection.options.dogBites": "DB",

  // Affected Individuals
  "affectedIndividuals.options.oneToFive": "NC",
  "affectedIndividuals.options.sixToTen": "NC",
  "affectedIndividuals.options.moreThanTen": "NC",

  // Gender
  "gender.options.male": "SX.M",
  "gender.options.female": "SX.F",

  // Status
  "status.options.noEpidemic": "ST.FA",
  "status.options.riskIncreasing": "ST.IM",
  "status.options.worsening": "ST.WO",

  // Additional Notes
  "notes.options.casesDecreased": "CMT.CD",
  "notes.options.noChange": "CMT.NCH",
  "notes.options.casesIncreased": "CMT.CI",
  "notes.options.deathsOccurred": "CMT.DO",

  // Confirmation
  "confirmation.options.diseaseContained": "CONF.CL",
  "confirmation.options.examinationContinues": "CONF.AI",

  // Static Codes
  age: "AG", // User-provided age
  duration: "DF", // User-provided time since incident
};
