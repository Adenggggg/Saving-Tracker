import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Works with Neon / Supabase / any standard Postgres connection string.
// Set DATABASE_URL in your .env (and in Vercel project env vars).
const connectionString = process.env.DATABASE_URL!;

const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
