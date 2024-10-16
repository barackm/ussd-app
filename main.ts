import express from "npm:express@4.18.2";
import type { Session } from "./types.ts";
import { Request, Response } from "npm:express@4.18.2";
import { handleStep } from "./utils.ts";
import { dynamicFlow, sampleApp } from "./data.ts";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_: Request, res: Response) => {
  res.send("Hello World!");
});

const sessionState: Record<string, Session> = {};

app.post("/ussd", async (req: Request, res: Response) => {
  const { text, sessionId, serviceCode, phoneNumber, networkCode } = req.body;

  const session: Session = sessionState[sessionId] || {
    step: 1,
    phoneNumber,
    serviceCode,
    networkCode,
  };

  console.log("Session:", session, text);
  // sampleApp
  const appData = sampleApp;

  if (text === "") {
    const response = await handleStep(appData, session, undefined);
    sessionState[sessionId] = session;
    return res.send(response);
  }

  const inputs = text.split("*");

  for (const input of inputs) {
    const userInput = input;

    if (isNaN(userInput)) {
      return res.send("END Invalid input.");
    }

    const response = await handleStep(appData, session, userInput);

    if (response.startsWith("END")) {
      sessionState[sessionId] = session;
      return res.send(response);
    }
  }

  sessionState[sessionId] = session;
  const response = await handleStep(appData, session, undefined);
  return res.send(response);
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
