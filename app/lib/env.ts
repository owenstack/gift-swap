import { z } from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
	clientPrefix: "VITE_",
	client: {
		VITE_APPWRITE_PROJECT_ID: z.string().min(1).max(100),
		VITE_APPWRITE_PROJECT_NAME: z.string().min(1).max(100),
		VITE_APPWRITE_ENDPOINT: z.url(),
	},
	server: {},
	runtimeEnv: process.env,
});
