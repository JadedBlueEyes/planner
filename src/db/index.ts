import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema.js";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { initializeDatabase } from "./init.js";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For SQLite, use a local file path
// Default to a file in the project root if SQLITE_DB_PATH is not set
const dbPath = process.env.SQLITE_DB_PATH || join(__dirname, "../../planner.db");

// Initialize the database (run migrations if needed)
await initializeDatabase();

// Create SQLite database connection
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// Create Drizzle instance with our schema
export const db = drizzle(sqlite, { schema });

// Export the raw client for cleanup if needed
export const client = sqlite;

// Export schema for use in other files
export * from "./schema.js";