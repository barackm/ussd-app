import { sessionStore } from "../sessionStore.ts";
import { Request, Response } from "npm:express@4.18.2";

export const sessionMiddleware = async (req: Request, res: Response, next: Function) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).send("Missing sessionId.");
  }

  try {
    await sessionStore.init(sessionId);
  } catch (error: any) {
    console.error("+++Failed to initialize session:", error.message);
  }

  next();
};
