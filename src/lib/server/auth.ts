import { betterAuth } from "better-auth";
import { createAuthMiddleware } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, organization, admin } from "better-auth/plugins";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { db } from "./db";
import * as schema from "./db/schema";
import { product, publication, project } from "./db/schema";
import { env } from '$env/dynamic/private';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		schema: {
			...schema,
		},
		usePlural: false,
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
	hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (!ctx.path.startsWith('/sign-up')) return

            const newSession = ctx.context?.newSession
            const userId = newSession?.user?.id
            if (!userId) return

            try {
                const [defaultProduct] = await db.insert(product).values({
                    name: 'Default',
                    userId
                }).returning()

                await db.insert(publication).values({
                    name: 'Default publication',
                    slug: 'default',
                    productId: defaultProduct.id
                })

                await db.insert(project).values({
                    name: 'Default project',
                    slug: 'default',
                    productId: defaultProduct.id
                })
            } catch (error) {
                console.error('Error creating default entities for user:', userId, error)
            }
        })
    }
});

export type Session = typeof auth.$Infer.Session;