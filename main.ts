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
  const appData = dynamicFlow;

  if (text === "") {
    const response = await handleStep(appData, session, undefined);
    sessionState[sessionId] = session;
    return res.send(response);
  }

  const inputs = text.split("*");
  const lastInput = inputs[inputs.length - 1];

  const userInput = parseInt(lastInput, 10);

  if (isNaN(userInput)) {
    return res.send("END Invalid input.");
  }

  const response = await handleStep(appData, session, userInput.toString());

  if (response.startsWith("END")) {
    sessionState[sessionId] = session;
    return res.send(response);
  }

  sessionState[sessionId] = session;
  return res.send(response);
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
