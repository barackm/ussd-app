// Enum for Incident Types
export enum IncidentTypeEnum {
  ReportDisease = "1",
  ReportDeath = "2",
  AnimalIncident = "3",
  EbolaSymptoms = "4",
  DogBites = "5",
}

export enum ProvinceEnum {
  KigaliCity = "1",
  NorthernProvince = "2",
  SouthernProvince = "3",
  EasternProvince = "4",
  WesternProvince = "5",
}

export enum DistrictEnum {
  Gasabo = "1",
  Kicukiro = "2",
  Nyarugenge = "3",
}

export enum StepEnum {
  MainMenu = "1",
  IncidentSelection = "2",
  ProvinceSelection = "3",
  DistrictSelection = "4",
  SectorSelection = "5",
  CellSelection = "6",
  VillageSelection = "7",
  AffectedIndividuals = "8",
  AdditionalDetails = "9",
  ConfirmReportDetails = "10",
  ReportSubmission = "11",
  FollowUpAlert = "12",
  ProvideFollowUpStatus = "13",
  ConfirmAlertID = "14",
  ConfirmAlertStatus = "15",
  ChangeLanguage = "16",
}

export enum OptionEnum {
  ReportSuspiciousActivity = "1",
  FollowUpAlert = "2",
  ConfirmAlert = "3",
  ChangeLanguage = "4",

  // Incident Types
  HumanDisease = "1",
  HumanDeath = "2",
  AnimalDiseaseDeath = "3",
  EbolaLikeSymptoms = "4",
  DogBites = "5",
  BackToMainMenu = "00",

  // Affected Individuals
  OneToFiveIndividuals = "1",
  SixToTenIndividuals = "2",
  MoreThanTenIndividuals = "3",

  // Additional Details
  Gender = "1",
  Age = "2",
  DurationSinceIncident = "3",

  // Report Actions
  ConfirmReport = "1",
  CancelReport = "2",

  // Follow-up on an Alert
  EnterAlertID = "1",
  FalseAlert = "1",
  SituationImproved = "2",
  SituationWorsened = "3",

  // Confirm an Alert
  ExaminationContinues = "1",
  DiseaseContained = "2",

  // Language Options
  English = "1",
  Kinyarwanda = "2",

  FreeText = "",
}
