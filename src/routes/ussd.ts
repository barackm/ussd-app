import express from "npm:express@4.18.2";
import { Request, Response } from "npm:express@4.18.2";
import type { Session } from "../interfaces/types.ts";
import { incidentReport } from "../data/data.ts";
import { handleStep } from "../utils/utils.ts";

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

  const inputs = text.split("*");
  const lastInput = inputs[inputs.length - 1];

  const userInput = lastInput.trim();

  const response = await handleStep(appData, session, userInput);

  if (response.startsWith("END")) {
    sessionState[sessionId] = session;
    return res.send(response);
  }

  sessionState[sessionId] = session;
  return res.send(response);
});
export default router;
