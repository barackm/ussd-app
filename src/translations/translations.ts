import { en } from "./en.ts";
import { rw } from "./rw.ts";

export const translations: Record<string, any> = {
  en,
  rw,
};

export type TranslationKey = keyof (typeof translations)["rw"];
