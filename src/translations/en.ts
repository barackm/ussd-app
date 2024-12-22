export const en = {
  mainMenu: {
    prompt: "Please select an option:",
    options: {
      reportSuspiciousActivity: "Report Suspicious Activity",
      followUpAlert: "Follow-up on an Alert",
      confirmAlert: "Confirm an Alert",
      changeLanguage: "Change Language",
    },
  },
  incidentSelection: {
    prompt: "Please select the type of incident you want to report:",
    options: {
      humanDisease: "Human Disease",
      humanDeath: "Human Death",
      animalDiseaseDeath: "Animal Disease/Death",
      ebolaLikeSymptoms: "Ebola-like Symptoms",
      dogBites: "Dog Bites",
    },
  },
  affectedIndividuals: {
    prompt: "Please provide the number of individuals affected:",
    options: {
      oneToFive: "1-5 Individuals",
      sixToTen: "6-10 Individuals",
      moreThanTen: "More than 10 Individuals",
    },
  },
  gender: {
    prompt: "Please select the gender:",
    options: {
      male: "Male",
      female: "Female",
    },
  },
  age: {
    prompt: "Please enter the age:",
    options: {
      freeText: "",
    },
  },
  durationSinceIncident: {
    prompt: "How long ago did the incident occur? (e.g. 2 hours, 1 day):",
    options: {
      freeText: "",
    },
  },
  confirmReportDetails: {
    prompt: "Please confirm the details of your report:",
    options: {
      confirm: "Confirm Report",
      cancel: "Cancel Report",
    },
  },
  reportSubmission: {
    prompt: "Thank you! Your report has been submitted.",
  },
  followUpAlert: {
    prompt: "Please enter your alert ID to follow up:",
    options: {
      freeText: "",
    },
  },
  provideFollowUpStatus: {
    prompt: "Please provide the status of the alert:",
    options: {
      falseAlert: "False Alert",
      situationImproved: "Situation Improved",
      situationWorsened: "Situation Worsened",
    },
  },
  alertStatusUpdated: {
    prompt: "Thank you! The status of the alert has been updated.",
  },
  confirmAlertID: {
    prompt: "Please provide the alert ID to confirm the status:",
    options: {
      freeText: "",
    },
  },
  confirmAlertStatus: {
    prompt: "Please confirm the alert status:",
    options: {
      examinationContinues: "Examination Continues [CONF.AI]",
      diseaseContained: "Disease Contained",
      casesDecreased: "Cases Decreased",
      noChange: "No Changes Observed",
      casesIncreased: "Cases Increased",
      deathsOccurred: "Deaths Occurred",
    },
  },
  changeLanguage: {
    prompt: "Please select your language:",
    options: {
      english: "English",
      kinyarwanda: "Kinyarwanda",
    },
  },
  main_menu_option: "00) Main Menu",
  back_option: "0) Back",
  alert_not_found: "Alert with the given ID was not found",
  unauthorized_alert_update: "You are not authorized to update this alert status",
  alert_status_updated: "Alert status updated successfully",
  unauthorized_alert_access: "You are not authorized to access this alert",
  alert_access_granted: "Alert access granted successfully",
  alert_send_failed: "Failed to send alert",
  alert_status_update_failed: "Failed to update alert status",
  unknown_action: "Unknown action",
  invalid_step_configuration: "Error: Invalid step configuration.",
  invalid_input: "Invalid input.",
  alert_sms_message: `
🚨 AlertHub
New alert:
- ID: {id}
- Sector: {sector}
- Cell/Village: {cell}, {village}
- Details: {details}

Please follow up and update the status.`,
};
