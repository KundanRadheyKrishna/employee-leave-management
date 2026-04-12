import { Client, Account, Databases } from "appwrite";

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 
  
export const account = new Account(client);
export const databases = new Databases(client);
export const USER_COLLECTION_ID = import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID;
export const DB_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;