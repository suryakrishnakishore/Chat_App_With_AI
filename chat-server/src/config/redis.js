import Redis from "ioredis";
import { REDIS_URL } from "../env.js";

const redis = new Redis(REDIS_URL, {
  tls: {
    rejectUnauthorized: false,
  },
});

redis.on("connect", () => {
  console.log("Connected to Redis via Upstash TCP");
});

redis.on("ready", () => {
  console.log("Redis client is ready");
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redis.on("close", () => {
  console.warn("Redis connection closed");
});

export default redis;
