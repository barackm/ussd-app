import redis from "../lib/redisClient.ts";
import type { Session } from "../interfaces/types.ts";

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessionData = await redis.get(sessionId);
  return sessionData ? JSON.parse(sessionData) : null;
}

export async function saveSession(sessionId: string, session: Session): Promise<void> {
  await redis.set(sessionId, JSON.stringify(session));
  await redis.expire(sessionId, 600);
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(sessionId);
}
