import en from "./en.json" with { type: "json" };
import rw from "./rw.json" with { type: "json" };

export const translations = {
  en,
  rw,
};

export type TranslationKey = keyof (typeof translations)["en"];
