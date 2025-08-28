import { Account, Client, ID } from "appwrite";
import { env } from "@/env";

const client = new Client().setProject(env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export { ID };
