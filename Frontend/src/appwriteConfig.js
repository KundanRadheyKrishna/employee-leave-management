import { Client, Account, Databases } from "appwrite";

// Step 1: Client बनाएँ
const client = new Client();

// Step 2: Endpoint और Project ID set करें
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) // Appwrite cloud endpoint
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); // Dashboard → Web App → Project ID copy करो

// Step 3: Export Account और Databases objects
export const account = new Account(client);
export const databases = new Databases(client);