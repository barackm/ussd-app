import express from "npm:express@4.18.2";
import { Request, Response } from "npm:express@4.18.2";
import ussd from "./routes/ussd.ts";
import { fetchRwandaLocationData } from "./data/localtionData.ts";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/ussd", ussd);

app.get("/", async (_: Request, res: Response) => {
  const locationData = await fetchRwandaLocationData();

  res.json(locationData);
});

app.listen(8000, () => {
  console.log("Server running on http://localhost:8000");
});
