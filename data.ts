import { ActionTypeEnum, DynamicFlow } from "./types.ts";

export const dynamicFlow: DynamicFlow = {
  1: {
    prompt:
      "Welcome to the Incident Reporting System! Please select an incident type:",
    options: {
      1: "Report a Disease Outbreak",
      2: "Report a Natural Disaster",
      3: "Report a Crime",
    },
    nextStep: {
      1: 2,
      2: 2,
      3: 2,
    },
  },
  2: {
    prompt: "Please select your Province:",
    options: {
      1: "Kigali City",
      2: "Northern Province",
      3: "Southern Province",
      4: "Eastern Province",
      5: "Western Province",
    },
    nextStep: {
      1: 3,
      2: 3,
      3: 3,
      4: 3,
      5: 3,
    },
  },
  3: {
    prompt: "Please select your District:",
    options: {
      1: "Gasabo",
      2: "Kicukiro",
      3: "Nyarugenge",
    },
    nextStep: {
      1: 4,
      2: 4,
      3: 4,
    },
  },
  4: {
    prompt: "Please select your Sector:",
    options: {
      1: "Remera",
      2: "Kacyiru",
      3: "Gisozi",
    },
    nextStep: {
      1: 5,
      2: 5,
      3: 5,
    },
  },
  5: {
    prompt: (session) => {
      const incident = session.selectedOptions?.[1]
        ? dynamicFlow[1].options[session.selectedOptions?.[1]]
        : "N/A";
      const province = session.selectedOptions?.[2]
        ? dynamicFlow[2].options[session.selectedOptions?.[2]]
        : "N/A";
      const district = session.selectedOptions?.[3]
        ? dynamicFlow[3].options[session.selectedOptions?.[3]]
        : "N/A";
      const sector = session.selectedOptions?.[4]
        ? dynamicFlow[4].options[session.selectedOptions?.[4]]
        : "N/A";

      return `You are about to report a ${incident} in ${province} -> ${district} -> ${sector}. Do you want to confirm?`;
    },
    options: {
      1: "Confirm",
      2: "Cancel",
    },
    nextStep: {
      1: 6,
      2: 7,
    },
    config: {
      action: ActionTypeEnum.SEND_REPORT,
    },
  },
  6: {
    prompt: "Thank you! Your report has been submitted.",
    options: {},
    isFinalStep: true,
  },
  7: {
    prompt: "Your report has been canceled.",
    options: {},
    isFinalStep: true,
  },
};
