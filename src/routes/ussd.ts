import express from "npm:express@4.18.2";
import { Request, Response } from "npm:express@4.18.2";
import type { Session } from "../interfaces/types.ts";
import { incidentReport } from "../data/data.ts";
import { handleStep } from "../utils/stepHandler.ts";
import { StepEnum } from "../enums/menuKeys.ts";

const router = express.Router();
const sessionState: Record<string, Session> = {};

router.post("/", async (req: Request, res: Response) => {
  const { text, sessionId, serviceCode, phoneNumber, networkCode } = req.body;
  const appData = incidentReport;

  const session: Session = sessionState[sessionId] || {
    step: Object.keys(appData)[0],
    phoneNumber,
    serviceCode,
    networkCode,
  };

  if (text === "") {
    const response = await handleStep(appData, session, undefined);
    sessionState[sessionId] = session;
    return res.send(response);
  }

  const inputs = text.split("*").filter(Boolean);
  let response = "";
  let previousSession = { ...session };

  for (let i = 0; i < inputs.length; i++) {
    const currentInput = inputs[i].trim();

    if (currentInput === "00") {
      session.step = StepEnum.MainMenu;
      session.selectedOptions = {};
      continue;
    }

    if (currentInput === "0") {
      session.step = previousSession.step;
      session.selectedOptions = { ...previousSession.selectedOptions };
      continue;
    }

    previousSession = { ...session };

    response = await handleStep(appData, session, currentInput);

    if (response.startsWith("END") || response.includes("Error:")) {
      break;
    }
  }

  response = await handleStep(appData, session, undefined);

  sessionState[sessionId] = session;
  return res.send(response);
});

export default router;
