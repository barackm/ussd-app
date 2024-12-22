import { sessionStore } from "../sessionStore.ts";
import { translations } from "./translations.ts";

export function translate(key: string, params?: Record<string, string | number>) {
  const session = sessionStore.get();
  let lang = session?.language;

  if (!translations[lang]) lang = "rw";

  const keys = key.split(".");
  let result = translations[lang];

  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      return key;
    }
  }

  if (typeof result === "string" && params) {
    return result.replace(/\{(\w+)\}/g, (match, key) => {
      return (params[key] ?? match).toString();
    });
  }

  return typeof result === "string" ? result : key;
}
