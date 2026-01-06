import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {},
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
