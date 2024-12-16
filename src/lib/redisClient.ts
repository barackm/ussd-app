import { load } from "https://deno.land/std@0.208.0/dotenv/mod.ts";
import { createClient } from "npm:redis@4.6.11";

await load({ export: true });

const REDIS_HOST = Deno.env.get("REDIS_HOST") || "127.0.0.1";
const REDIS_PASSWORD = Deno.env.get("REDIS_PASSWORD") || null;

const client = createClient({
  username: "default",
  password: REDIS_PASSWORD!,
  socket: {
    host: REDIS_HOST,
    port: 10806,
  },
});

client.on("error", (err) => console.log("Redis Client Error", err));

const redis = await client.connect();
console.log("Connected to Redis!");

// export default redis;
export default {};
