import { getSession, saveSession, deleteSession } from "./utils/sessionManager.ts";
import type { Session } from "./interfaces/types.ts";
import { incidentReport } from "./data/data.ts";

class SessionStore {
  private static instance: SessionStore;
  private session: Session | null = null;
  private sessionId: string | null = null;

  private constructor() {}

  static getInstance(): SessionStore {
    if (!SessionStore.instance) {
      SessionStore.instance = new SessionStore();
    }
    return SessionStore.instance;
  }

  async init(sessionId: string, defaultSessionData?: Partial<Session>): Promise<void> {
    this.sessionId = sessionId;
    this.session = await getSession(sessionId);

    if (!this.session && defaultSessionData) {
      this.session = {
        step: Object.keys(incidentReport)[0],
        phoneNumber: "",
        serviceCode: "",
        networkCode: "",
        previousStep: null,
        language: "en",
        province: "",
        district: "",
        sector: "",
        cell: "",
        village: "",
        incidentType: "",
        details: "",
        ...defaultSessionData,
      };

      await this.save();
    }
  }

  get(): Session {
    if (!this.session) {
      throw new Error("Session not initialized or found.");
    }
    return this.session;
  }

  update(updates: Partial<Session>): void {
    if (!this.session) {
      throw new Error("Session not initialized or found.");
    }
    this.session = { ...this.session, ...updates };
  }

  async save(): Promise<void> {
    if (!this.session || !this.sessionId) {
      throw new Error("Session not initialized or found.");
    }
    await saveSession(this.sessionId, this.session);
  }

  create(newSession: Session): void {
    if (this.session) {
      throw new Error("Session already exists.");
    }
    this.session = newSession;
  }

  kill(): void {
    deleteSession(this.sessionId!);
    this.session = null;
    this.sessionId = null;
  }
}

export const sessionStore = SessionStore.getInstance();
