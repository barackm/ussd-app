type Options<T extends string = string> = {
  [key: string]: T;
};

type TranslationNode = {
  prompt: string;
  options?: Options;
};

export type TranslationKeys = {
  mainMenu: TranslationNode;
  incidentSelection: TranslationNode;
  affectedIndividuals: TranslationNode;
  gender: TranslationNode;
  age: TranslationNode;
  durationSinceIncident: TranslationNode;
  confirmReportDetails: TranslationNode;
  reportSubmission: { prompt: string };
  followUpAlert: TranslationNode;
  provideFollowUpStatus: TranslationNode;
  alertStatusUpdated: { prompt: string };
  confirmAlertID: TranslationNode;
  confirmAlertStatus: TranslationNode;
  changeLanguage: TranslationNode;
};
