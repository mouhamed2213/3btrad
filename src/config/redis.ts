// import Redis from "ioredis";
// import { env } from "./env.js";

// export const redisConnection = new Redis({
//   host: env.REDIS_HOST,
//   port: Number(env.REDIS_PORT),
//   password: env.REDIS_PASSWORD || undefined,
//   maxRetriesPerRequest: null, // Requis par BullMQ
// });

// redisConnection.on("connect", () => {
//   console.log("✅ Connecté à Redis avec succès");
// });

// redisConnection.on("error", (err) => {
//   console.error("❌ Erreur de connexion Redis :", err);
// });
