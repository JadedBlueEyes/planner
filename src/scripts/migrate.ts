import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For SQLite, use a local file path
const dbPath = process.env.SQLITE_DB_PATH || join(__dirname, "../../planner.db");

console.log(`Migrating database at: ${dbPath}`);

// Create SQLite database connection
const sqlite = new Database(dbPath);

// Enable foreign keys
sqlite.pragma("foreign_keys = ON");

// Create Drizzle instance
const db = drizzle(sqlite);

// Run migrations
try {
  console.log("Running migrations...");
  migrate(db, { migrationsFolder: join(__dirname, "../../drizzle") });
  console.log("Migrations completed successfully!");
} catch (error) {
  console.error("Migration failed:", error);
  process.exit(1);
} finally {
  sqlite.close();
}