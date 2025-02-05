import express from "npm:express@4.18.2";
import { Request, Response } from "npm:express@4.18.2";
import { incidentReport } from "../data/data.ts";
import { handleStep } from "../utils/stepHandler.ts";
import { StepEnum } from "../enums/menuKeys.ts";
import { sessionMiddleware } from "../middlewares/sessionMiddleware.ts";
import { sessionStore } from "../sessionStore.ts";

const router = express.Router();

router.post("/", sessionMiddleware, async (req: Request, res: Response) => {
  const { text, sessionId, serviceCode, phoneNumber, networkCode } = req.body;
  const appData = incidentReport;
  try {
    if (!phoneNumber || !serviceCode) {
      return res.status(400).send("END Error: Invalid request, provide phoneNumber and serviceCode");
    }
    if (serviceCode !== "*180#") {
      return res.status(400).send("END Error: Invalid request, Service Code invalid");
    }
    await sessionStore.init(sessionId, {
      phoneNumber,
      serviceCode,
      networkCode,
      language: "rw",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      incidentType: "",
      details: "",
    });

    const session = sessionStore.get();

    if (text === "") {
      const response = await handleStep(appData);
      await sessionStore.save();
      return res.send(response);
    }

    const inputs = text.split("*").filter(Boolean);
    let response = "";
    let previousSession = { ...session };

    for (let i = 0; i < inputs.length; i++) {
      const currentInput = inputs[i].trim();

      if (currentInput === "00") {
        sessionStore.update({
          step: StepEnum.MainMenu,
        });
        continue;
      }

      if (currentInput === "0") {
        sessionStore.update({
          step: previousSession.step,
        });
        continue;
      }

      previousSession = { ...sessionStore.get() };

      response = await handleStep(appData, currentInput);

      if (response.startsWith("END") || response.includes("Error:")) {
        sessionStore.kill();
        return res.send(response);
      }
    }

    response = await handleStep(appData);
    await sessionStore.save();
    return res.send(response);
  } catch (error: any) {
    return res.status(500).send(`END Error: ${error.message}`);
  }
});
export default router;
