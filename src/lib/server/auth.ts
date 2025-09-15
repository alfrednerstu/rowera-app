import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, organization, admin } from "better-auth/plugins";
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
		admin({
			adminUserIds: ["274286d8-0132-44ca-8898-1b483061a65d"], // alfred's user ID
			adminRoles: ["admin"]
		}),
		sveltekitCookies(getRequestEvent), // must be last plugin
	],
	socialProviders: {},
});

export type Session = typeof auth.$Infer.Session;