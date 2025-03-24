import express from "npm:express@4.18.2";
import { Request, Response } from "npm:express@4.18.2";
import cors from "npm:cors@2.8.5";
import ussd from "./src/routes/ussd.ts";
import location from "./src/routes/location.ts";
import "./scheduler.ts";
import { fetchAgentsByLocation } from "./src/db/agents.ts";
import { translate } from "./src/translations/translate.ts";
import { sendSMS } from "./src/lib/twilio.ts";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use("/ussd", ussd);
app.use("/location", location);
app.get("/test-sms", async (req: Request, res: Response) => {
  const agents = await fetchAgentsByLocation({
    village: "Akakaza",
    cell: "Kinyaga",
    sector: "Bumbogo",
  });

  const message = `Hello, this is a test message from AlertHub.`;
  sendSMS(agents[0].phone, message);

  console.log(agents);
  res.send(agents);
});

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to the AlertHub API");
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
