import express from "npm:express@4.18.2";
import { Request, Response } from "npm:express@4.18.2";
import cors from "npm:cors@2.8.5";
import ussd from "./routes/ussd.ts";
import location from "./routes/location.ts";

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

app.get("/", (_: Request, res: Response) => {
  res.send("Welcome to the AlertHub API");
});

const port = Deno.env.get("PORT") || "8000";
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
