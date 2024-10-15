import { DynamicFlow } from "./types.ts";

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
      1: 2, // Proceed to province selection
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
      1: 3, // Proceed to district selection based on province
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
    }, // Add more districts based on provinces if needed
    nextStep: {
      1: 4, // Proceed to sector selection
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
    }, // Add real sectors based on districts
    nextStep: {
      1: 5, // Proceed to confirmation
      2: 5,
      3: 5,
    },
  },
  5: {
    prompt: "Please confirm your report:",
    options: {
      1: "Confirm",
      2: "Cancel",
    },
    nextStep: {
      1: 6, // Go to confirmation
      2: 7, // Go to cancellation
    },
  },
  6: {
    prompt: "Thank you! Your report has been submitted.",
    options: {},
    isFinalStep: true, // Mark as the final step
  },
  7: {
    prompt: "Your report has been canceled.",
    options: {},
    isFinalStep: true, // Mark as the final step
  },
};
