import { translations } from "./translations.ts";
import { ActionTypeEnum, DynamicFlow, type Session } from "./types.ts";

const getConfirmMessage = (session: Session) => {
  const language = session.language || "en";
  const translation = translations[language];

  const incidentKey = session.selectedOptions?.[1]
    ? dynamicFlow[1].options[session.selectedOptions[1]]
    : "N/A";

  const provinceKey = session.selectedOptions?.[2]
    ? dynamicFlow[2].options[session.selectedOptions[2]]
    : "N/A";

  const districtKey = session.selectedOptions?.[3]
    ? dynamicFlow[3].options[session.selectedOptions[3]]
    : "N/A";

  const sectorKey = session.selectedOptions?.[4]
    ? dynamicFlow[4].options[session.selectedOptions[4]]
    : "N/A";

  const incident = incidentKey !== "N/A" ? translation[incidentKey] : "N/A";
  const province = provinceKey !== "N/A" ? translation[provinceKey] : "N/A";
  const district = districtKey !== "N/A" ? translation[districtKey] : "N/A";
  const sector = sectorKey !== "N/A" ? translation[sectorKey] : "N/A";

  const confirmMessageTemplate = translation["confirmMessage"];

  const confirmMessage = confirmMessageTemplate
    .replace("{incident}", incident)
    .replace("{province}", province)
    .replace("{district}", district)
    .replace("{sector}", sector);

  return confirmMessage;
};

export const dynamicFlow: DynamicFlow = {
  "1": {
    prompt: "welcome",
    options: {
      "1": "reportDisease",
      "2": "reportDisaster",
      "3": "reportCrime",
      "4": "changeLanguage",
    },
    nextStep: {
      "1": "2",
      "2": "2",
      "3": "2",
      "4": "8",
    },
  },
  "2": {
    prompt: "selectProvince",
    options: {
      "1": "kigali",
      "2": "northernProvince",
      "3": "southernProvince",
      "4": "easternProvince",
      "5": "westernProvince",
      "0": "goBack",
    },
    nextStep: {
      "1": "3",
      "2": "3",
      "3": "3",
      "4": "3",
      "5": "3",
      "0": "1",
    },
  },
  "3": {
    prompt: "selectDistrict",
    options: {
      "1": "gasabo",
      "2": "kicukiro",
      "3": "nyarugenge",
      "00": "goBack",
    },
    nextStep: {
      "1": "4",
      "2": "4",
      "3": "4",
      "00": "2",
    },
  },
  "4": {
    prompt: "selectSector",
    options: {
      "1": "remera",
      "2": "kacyiru",
      "3": "gisozi",
      "00": "goBack",
    },
    nextStep: {
      "1": "5",
      "2": "5",
      "3": "5",
      "00": "3",
    },
  },
  "5": {
    prompt: getConfirmMessage,
    options: {
      "1": "confirm",
      "2": "cancel",
    },
    nextStep: {
      "1": "6",
      "2": "7",
    },
    config: {
      action: ActionTypeEnum.SEND_REPORT,
    },
  },
  "6": {
    prompt: "thankYou",
    options: {},
    isFinalStep: true,
  },
  "7": {
    prompt: "canceled",
    options: {},
    isFinalStep: true,
  },
  "8": {
    prompt: "selectLanguage",
    options: {
      "1": "english",
      "2": "french",
      "3": "swahili",
      "4": "kinyarwanda",
    },
    nextStep: {
      "1": "1",
      "2": "1",
      "3": "1",
      "4": "1",
    },
    config: {
      action: ActionTypeEnum.CHANGE_LANGUAGE,
      params: {
        languageMap: {
          "1": "en",
          "2": "fr",
          "3": "sw",
          "4": "rw",
        },
      },
    },
  },
};

export const sampleApp: DynamicFlow = {
  1: {
    prompt: "app2Welcome",
    options: {
      "1": "checkBalance",
      "2": "updateDetails",
      "3": "changeLanguage",
    },
    nextStep: {
      "1": "2",
      "2": "3",
      "3": "4",
    },
  },
  2: {
    prompt: "yourBalance",
    options: {
      "1": "backToMainMenu",
    },
    nextStep: {
      "1": "1",
    },
  },
  3: {
    prompt: "updateDetailsPrompt",
    options: {
      "1": "updatePhoneNumber",
      "2": "updateEmail",
      "00": "backToMainMenu",
    },
    nextStep: {
      "1": "5",
      "2": "6",
      "00": "1",
    },
  },
  4: {
    prompt: "selectLanguage",
    options: {
      "1": "english",
      "2": "french",
      "3": "swahili",
      "4": "kinyarwanda",
      "00": "backToMainMenu",
    },
    nextStep: {
      "1": "1",
      "2": "1",
      "3": "1",
      "4": "1",
      "00": "1",
    },
    config: {
      action: ActionTypeEnum.CHANGE_LANGUAGE,
      params: {
        languageMap: {
          "1": "en",
          "2": "fr",
          "3": "sw",
          "4": "rw",
        },
      },
    },
  },
  5: {
    prompt: "enterNewPhoneNumber",
    options: {
      "1": "backToMainMenu",
    },
    nextStep: {
      "1": "1",
    }, // Placeholder for handling user input
  },
  6: {
    prompt: "enterNewEmail",
    options: {
      "1": "backToMainMenu",
    },
    nextStep: {
      "1": "1",
    }, // Placeholder for handling user input
  },
};
