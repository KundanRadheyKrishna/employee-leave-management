import { Client, Account, Databases } from "appwrite";

// Step 1: Client बनाएँ
const client = new Client();

// Step 2: Endpoint और Project ID set करें
client
  .setEndpoint("https://sgp.cloud.appwrite.io/v1") // Appwrite cloud endpoint
  .setProject("69d65aaa00043804cb9d"); // Dashboard → Web App → Project ID copy करो

// Step 3: Export Account और Databases objects
export const account = new Account(client);
export const databases = new Databases(client);