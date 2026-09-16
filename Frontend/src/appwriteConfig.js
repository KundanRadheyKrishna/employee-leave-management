import { Client, Account, Storage, TablesDB } from "appwrite";

const requiredEnv = (name) => {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Missing Appwrite environment variable: ${name}`);
  }
  return value;
};

const client = new Client()
  .setEndpoint(requiredEnv("VITE_APPWRITE_ENDPOINT"))
  .setProject(requiredEnv("VITE_APPWRITE_PROJECT_ID"));

export const account = new Account(client);
export const storage = new Storage(client);

// ✅ ONLY TablesDB (no Databases)
export const tablesDB = new TablesDB(client);

// ✅ IDs
export const DB_ID = requiredEnv("VITE_APPWRITE_DATABASE_ID");
export const USER_TABLE_ID = requiredEnv("VITE_APPWRITE_USER_COLLECTION_ID");
export const LEAVE_TABLE_ID = requiredEnv("VITE_APPWRITE_LEAVES_TABLE_ID");
export const DEPARTMENT_TABLE_ID =
  import.meta.env.VITE_APPWRITE_DEPARTMENTS_TABLE_ID || "departments";
export const NOTIFICATION_TABLE_ID =
  import.meta.env.VITE_APPWRITE_NOTIFICATIONS_TABLE_ID || "notifications";
export const PROFILE_BUCKET_ID =
  import.meta.env.VITE_APPWRITE_PROFILE_BUCKET_ID || "profile-images";