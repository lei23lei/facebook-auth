import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema";
import { join } from "path";

let sqlite: Database.Database;
let db: ReturnType<typeof drizzle>;

try {
  sqlite = new Database("sqlite.db");
  db = drizzle(sqlite, { schema });

  // Run migrations only if we need to
  try {
    migrate(db, { migrationsFolder: join(process.cwd(), "drizzle") });
  } catch (error) {
    console.log("Migration already run or database already exists");
  }
} catch (error) {
  console.error("Database initialization error:", error);
  // Create a fallback database connection
  sqlite = new Database(":memory:");
  db = drizzle(sqlite, { schema });
}

export { db };
