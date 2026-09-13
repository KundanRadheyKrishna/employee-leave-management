import { Client, Account, TablesDB } from "appwrite";

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);

// ✅ ONLY TablesDB (no Databases)
export const tablesDB = new TablesDB(client);

// ✅ IDs
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const USER_TABLE_ID = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID;
export const LEAVE_TABLE_ID = import.meta.env.VITE_APPWRITE_LEAVES_TABLE_ID;