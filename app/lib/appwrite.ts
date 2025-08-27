import { Client, Account } from "appwrite";
import { env } from "~/lib/env";

export const client = new Client();

client
	.setEndpoint(env.VITE_APPWRITE_ENDPOINT)
	.setProject(env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export { ID } from "appwrite";
