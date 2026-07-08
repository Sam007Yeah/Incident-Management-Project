import { Pool } from "pg";

const pool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "0.0.0.0",
    port: 5432,
    database: "node-postgres-db"
});

export default pool;