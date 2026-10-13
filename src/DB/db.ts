import { Pool } from "pg";

const requiredEnv = [
    "DB_USER",
    "DB_PASSWORD",
    "DB_HOST",
    "DB_PORT",
    "DB_NAME",
] as const;

for (const key of requiredEnv) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

const dbPort = Number(process.env.DB_PORT);

if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
    throw new Error("DB_PORT must be a valid port number");
}

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: dbPort,
    database: process.env.DB_NAME,
});

export default pool;
