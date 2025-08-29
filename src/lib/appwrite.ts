import { Account, Client, ID, Query, Storage, TablesDB } from "appwrite";
import { env } from "@/env";

const client = new Client().setProject(env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const db = new TablesDB(client);
export const storage = new Storage(client);
export { ID, Query };
