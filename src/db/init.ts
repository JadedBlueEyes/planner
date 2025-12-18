import "dotenv/config";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { existsSync } from "fs";

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// For SQLite, use a local file path
const dbPath = process.env.SQLITE_DB_PATH || join(__dirname, "../../planner.db");
const migrationsFolder = join(__dirname, "../../drizzle");

let isInitialized = false;

/**
 * Initialize the database by running migrations if needed
 */
export async function initializeDatabase(): Promise<void> {
  if (isInitialized) {
    return;
  }

  const dbExists = existsSync(dbPath);
  
  if (!dbExists) {
    console.error(`Database not found at ${dbPath}, creating and running migrations...`);
  }

  try {
    // Create SQLite database connection
    const sqlite = new Database(dbPath);
    
    // Enable foreign keys
    sqlite.pragma("foreign_keys = ON");
    
    // Create Drizzle instance
    const db = drizzle(sqlite);
    
    // Run migrations
    migrate(db, { migrationsFolder });
    
    // Close the migration connection
    sqlite.close();
    
    if (!dbExists) {
      console.error("Database created and migrations applied successfully!");
    }
    
    isInitialized = true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}