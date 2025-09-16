import { betterAuth } from "better-auth";
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
		after: [
			{
				matcher: (context) => {
					return context.path === "/sign-up/email"
				},
				handler: async (context) => {
					if (context.returned && context.returned.user) {
						const userId = context.returned.user.id
						
						try {
							// Create default product
							const [defaultProduct] = await db.insert(product).values({
								name: 'My First Product',
								userId: userId
							}).returning()

							// Create default publication
							await db.insert(publication).values({
								name: 'Default Publication',
								slug: 'default',
								productId: defaultProduct.id
							})

							// Create default project  
							await db.insert(project).values({
								name: 'Default Project',
								slug: 'default',
								productId: defaultProduct.id
							})
							
							console.log('Default entities created for new user:', userId)
						} catch (error) {
							console.error('Error creating default entities for user:', userId, error)
						}
					}
				}
			}
		]
	}
});

export type Session = typeof auth.$Infer.Session;