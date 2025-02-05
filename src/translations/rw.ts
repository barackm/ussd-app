export const rw = {
  mainMenu: {
    prompt: "Hitamo uburyo bwo gukomeza:",
    options: {
      reportSuspiciousActivity: "Tanga raporo y'ibikorwa bidasanzwe",
      followUpAlert: "Gukurikirana amakuru yatanzwe",
      confirmAlert: "Emeza amakuru yatanzwe",
      changeLanguage: "Hindura ururimi",
    },
  },
  incidentSelection: {
    prompt: "Hitamo ubwoko bw'ibyabaye ushaka gutanga raporo kuri byo:",
    options: {
      humanDisease: "Indwara y'abantu",
      humanDeath: "Urupfu rw'umuntu",
      animalDiseaseDeath: "Indwara/Urupfu rw'inyamaswa",
      ebolaLikeSymptoms: "Ibimenyetso bisa n'Ebola",
      dogBites: "Kurumwa n'imbwa",
    },
  },
  affectedIndividuals: {
    prompt: "Andika umubare w'abantu byagizeho ingaruka:",
    options: {
      oneToFive: "Abantu 1-5",
      sixToTen: "Abantu 6-10",
      moreThanTen: "Abantu barenze 10",
    },
  },
  gender: {
    prompt: "Hitamo igitsina:",
    options: {
      male: "Gabo",
      female: "Gore",
    },
  },
  age: {
    prompt: "Andika imyaka y'ubukure:",
    options: {
      freeText: "",
    },
  },
  durationSinceIncident: {
    prompt: "Hashize igihe kingana iki ibyabaye bibaye? (nko: amasaha 2, umunsi 1):",
    options: {
      freeText: "",
    },
  },
  confirmReportDetails: {
    prompt: "Emeze amakuru y'ibyabaye washyizemo:",
    options: {
      confirm: "Emeza raporo",
      cancel: "Hagarika raporo",
    },
  },
  reportSubmission: {
    prompt: "Murakoze! Raporo yawe yagejejwe neza.",
  },
  followUpAlert: {
    prompt: "Andika ID y'amakuru ushaka gukurikirana:",
    options: {
      freeText: "",
    },
  },
  provideFollowUpStatus: {
    prompt: "Andika uko ibyabaye bihagaze:",
    options: {
      falseAlert: "Amakuru atari ukuri",
      situationImproved: "Ibyabaye byoroheje",
      situationWorsened: "Ibyabaye byakomeye",
    },
  },
  alertStatusUpdated: {
    prompt: "Murakoze! Uko ibyabaye bihagaze byavuguruwe neza.",
  },
  confirmAlertID: {
    prompt: "Shyiramo ID y'amakuru kugira ngo wemeze uko bihagaze:",
    options: {
      freeText: "",
    },
  },
  confirmAlertStatus: {
    prompt: "Emeze uko ibyabaye bihagaze:",
    options: {
      examinationContinues: "Isuzuma rirakomeje [CONF.AI]",
      diseaseContained: "Indwara yahagaze",
      casesDecreased: "Abafashwe baragabanutse",
      noChange: "Nta gihindutse",
      casesIncreased: "Abafashwe biyongereye",
      deathsOccurred: "Abantu bapfuye",
    },
  },
  changeLanguage: {
    prompt: "Hitamo ururimi rwifuzwa:",
    options: {
      english: "Icyongereza",
      kinyarwanda: "Ikinyarwanda",
    },
  },
  main_menu_option: "00) Subira Inyuma",
  back_option: "0) Subira",
  alert_not_found: "Amakuru afite uwo murongo ntabashije kuboneka",
  unauthorized_alert_update: "Ntabwo wemerewe kuvugurura aya makuru",
  alert_status_updated: "Uko amakuru ahagaze byavuguruwe neza",
  unauthorized_alert_access: "Ntabwo wemerewe kubona aya makuru",
  alert_access_granted: "Uburenganzira bwo kubona amakuru bwatanzwe neza",
  alert_send_failed: "Ntibishoboye kohereza amakuru",
  alert_status_update_failed: "Ntibishoboye kuvugurura uko amakuru ahagaze",
  unknown_action: "Igikorwa kitazwi",
  invalid_step_configuration: "Ikosa: Intambwe itemewe.",
  invalid_input: "Ibyo washyizemo sibyo.",
  alert_sms_message: `
🚨 AlertHub
Amakuru mashya:
- ID: {id}
- Umurenge: {sector}
- Akagari/Umudugudu: {cell}, {village}
- Ibisobanuro: {details}

Kurikirana kandi uvugurure uko bihagaze.`,
select_province: "Hitamo Intara yawe",
select_district: "Hitamo Akarere kawe:",
select_sector: "Hitamo umurenge wawe:",
select_cell: "Hitamo Akagari kawe:",
select_village: "Hitamo umudugudu wawe:",
};
