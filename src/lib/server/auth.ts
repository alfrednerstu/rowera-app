import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, organization } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { db } from "./db";
import * as schema from "./db/schema";
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
		},
	}),
	secret: env.BETTER_AUTH_SECRET || "fallback-secret-key",
	emailAndPassword: {
		enabled: true,
	},
	plugins: [
		username(),
		organization(),
		sveltekitCookies(getRequestEvent),
	],
	socialProviders: {},
});

export type Session = typeof auth.$Infer.Session;