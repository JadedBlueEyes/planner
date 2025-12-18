import {
  sqliteTable,
  text,
  integer,
  blob,
} from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

/*

1. Make project (save to db)
2. Ask user for product requirements
3. Repeatedly refine product, gather all necessary app capabilities
4. Propose user stories (save to db)
5. Get user stories approved by the client
6. Propose tech stack, auth method, and shared components
7. Get approval for tech stack, auth method, and shared components (save to db)
8. Propose data models
9. Get data models approved by the client (save to db)
10. Make api endpoints (save to db)
11. Get api endpoints approved by the client
12. Propose screens
13. Get screens approved by the client
*/

// Projects table
export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  stage: text("stage").notNull().default("requirements"),
});

export const projectRequirements = sqliteTable("project_requirements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  requirement: text("requirement").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

// Tasks table
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  parentId: text("parent_id"),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  priority: text("priority", { enum: ["low", "medium", "high"] }),
  position: integer("position"),
});

export const userStories = sqliteTable("user_stories", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
});

export const projectOverviews = sqliteTable("project_overviews", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  techStack: blob("tech_stack", { mode: "json" }).$type<{
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
    auth: string;
  }>(),
  sharedComponents: blob("shared_components", { mode: "json" }).$type<
    {
      name: string;
      description: string;
    }[]
  >(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  status: text("status", { enum: ["open", "in progress", "completed"] }).notNull().default("open"),
});

export const dataModels = sqliteTable("data_models", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  properties: blob("properties", { mode: "json" }).notNull(),
  relations: blob("relations", { mode: "json" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  status: text("status", { enum: ["open", "in progress", "completed"] }).notNull().default("open"),
});

export const apiEndpoints = sqliteTable("api_endpoints", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  endpoint: text("endpoint").notNull(),
  description: text("description"),
  method: text("method").notNull(),
  parameters: blob("parameters", { mode: "json" }).notNull(),
  requestFormat: text("request_format").notNull(),
  responseFormat: text("response_format").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  status: text("status", { enum: ["open", "in progress", "completed"] }).notNull().default("open"),
});

export const screens = sqliteTable("screens", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  projectId: text("project_id")
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  path: text("path").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(unixepoch())`),
  status: text("status", { enum: ["open", "in progress", "completed"] }).notNull().default("open"),
});

// Types for use in the application
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type UserStory = typeof userStories.$inferSelect;
export type NewUserStory = typeof userStories.$inferInsert;
export type DataModel = typeof dataModels.$inferSelect;
export type NewDataModel = typeof dataModels.$inferInsert;
export type ApiEndpoint = typeof apiEndpoints.$inferSelect;
export type NewApiEndpoint = typeof apiEndpoints.$inferInsert;
export type Screen = typeof screens.$inferSelect;
export type NewScreen = typeof screens.$inferInsert;
export type ProjectOverview = typeof projectOverviews.$inferSelect;
export type NewProjectOverview = typeof projectOverviews.$inferInsert;