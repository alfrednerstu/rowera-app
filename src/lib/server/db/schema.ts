import { pgTable, serial, integer, varchar, text, timestamp, boolean, json, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table for authentication and profile (Better Auth compatible)
export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').default(false).notNull(),
	image: text('image'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
	username: text('username').unique(),
	displayUsername: text('display_username'),
	role: text('role'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: timestamp('ban_expires'),
	// Legacy fields for compatibility
	avatar: text('avatar')
});

// Better Auth session table
export const session = pgTable('session', {
	id: text('id').primaryKey(),
	expiresAt: timestamp('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	activeOrganizationId: text('active_organization_id'),
	impersonatedBy: text('impersonated_by'),
});

// Better Auth account table
export const account = pgTable('account', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.$onUpdate(() => new Date())
		.notNull(),
});

// Better Auth verification table
export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at')
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Better Auth organization table
export const organization = pgTable('organization', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').unique(),
	logo: text('logo'),
	createdAt: timestamp('created_at').notNull(),
	metadata: text('metadata'),
});

// Better Auth member table
export const member = pgTable('member', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text('role').default('member').notNull(),
	createdAt: timestamp('created_at').notNull(),
});

// Better Auth invitation table
export const invitation = pgTable('invitation', {
	id: text('id').primaryKey(),
	organizationId: text('organization_id')
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role'),
	status: text('status').default('pending').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	inviterId: text('inviter_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

// Alias for backward compatibility
export const users = user;

// Products - main container for user's products
export const products = pgTable('products', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Pages - belong to products
export const pages = pgTable('pages', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull(),
	productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Parts - belong to pages
export const parts = pgTable('parts', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	pageId: uuid('page_id').notNull().references(() => pages.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Partials - reusable components
export const partials = pgTable('partials', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Primitives - basic building blocks
export const primitives = pgTable('primitives', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	tagName: varchar('tag_name', { length: 50 }).notNull(),
	attributes: json('attributes'),
	defaultContent: text('default_content'),
	cssStyles: text('css_styles'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Publications - belong to products
export const publications = pgTable('publications', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull(),
	productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Presets - templates that can be used by posts and pieces
export const presets = pgTable('presets', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	publicationId: uuid('publication_id').references(() => publications.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Posts - belong to publications and use presets
export const posts = pgTable('posts', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 500 }).notNull(),
	slug: varchar('slug', { length: 500 }),
	content: json('content'),
	publicationId: uuid('publication_id').notNull().references(() => publications.id, { onDelete: 'cascade' }),
	presetId: uuid('preset_id').notNull().references(() => presets.id, { onDelete: 'restrict' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Projects - belong to products
export const projects = pgTable('projects', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull(),
	productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Pieces - belong to projects and use presets
export const pieces = pgTable('pieces', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull(),
	projectId: uuid('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
	presetId: uuid('preset_id').notNull().references(() => presets.id, { onDelete: 'restrict' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Junction tables for many-to-many relationships

// Parts to Partials relationship
export const partPartials = pgTable('part_partials', {
	id: uuid('id').primaryKey().defaultRandom(),
	partId: uuid('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
	partialId: uuid('partial_id').notNull().references(() => partials.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Parts to Primitives relationship
export const partPrimitives = pgTable('part_primitives', {
	id: uuid('id').primaryKey().defaultRandom(),
	partId: uuid('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
	primitiveId: uuid('primitive_id').notNull().references(() => primitives.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Partials to Primitives relationship
export const partialPrimitives = pgTable('partial_primitives', {
	id: uuid('id').primaryKey().defaultRandom(),
	partialId: uuid('partial_id').notNull().references(() => partials.id, { onDelete: 'cascade' }),
	primitiveId: uuid('primitive_id').notNull().references(() => primitives.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Posts to Partials relationship
export const postPartials = pgTable('post_partials', {
	id: uuid('id').primaryKey().defaultRandom(),
	postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
	partialId: uuid('partial_id').notNull().references(() => partials.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Posts to Primitives relationship
export const postPrimitives = pgTable('post_primitives', {
	id: uuid('id').primaryKey().defaultRandom(),
	postId: uuid('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
	primitiveId: uuid('primitive_id').notNull().references(() => primitives.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Presets to Parts relationship
export const presetParts = pgTable('preset_parts', {
	id: uuid('id').primaryKey().defaultRandom(),
	presetId: uuid('preset_id').notNull().references(() => presets.id, { onDelete: 'cascade' }),
	partId: uuid('part_id').notNull().references(() => parts.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Pieces to Partials relationship
export const piecePartials = pgTable('piece_partials', {
	id: uuid('id').primaryKey().defaultRandom(),
	pieceId: uuid('piece_id').notNull().references(() => pieces.id, { onDelete: 'cascade' }),
	partialId: uuid('partial_id').notNull().references(() => partials.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Pieces to Primitives relationship
export const piecePrimitives = pgTable('piece_primitives', {
	id: uuid('id').primaryKey().defaultRandom(),
	pieceId: uuid('piece_id').notNull().references(() => pieces.id, { onDelete: 'cascade' }),
	primitiveId: uuid('primitive_id').notNull().references(() => primitives.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow()
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
	products: many(products)
}));

// Alias for backward compatibility
export const usersRelations = userRelations;

export const productsRelations = relations(products, ({ one, many }) => ({
	user: one(user, {
		fields: [products.userId],
		references: [user.id]
	}),
	pages: many(pages),
	publications: many(publications),
	projects: many(projects)
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
	product: one(products, {
		fields: [pages.productId],
		references: [products.id]
	}),
	parts: many(parts)
}));

export const partsRelations = relations(parts, ({ one, many }) => ({
	page: one(pages, {
		fields: [parts.pageId],
		references: [pages.id]
	}),
	partPartials: many(partPartials),
	partPrimitives: many(partPrimitives),
	presetParts: many(presetParts)
}));

export const partialsRelations = relations(partials, ({ many }) => ({
	partPartials: many(partPartials),
	partialPrimitives: many(partialPrimitives),
	postPartials: many(postPartials),
	piecePartials: many(piecePartials)
}));

export const primitivesRelations = relations(primitives, ({ many }) => ({
	partPrimitives: many(partPrimitives),
	partialPrimitives: many(partialPrimitives),
	postPrimitives: many(postPrimitives),
	piecePrimitives: many(piecePrimitives)
}));

export const publicationsRelations = relations(publications, ({ one, many }) => ({
	product: one(products, {
		fields: [publications.productId],
		references: [products.id]
	}),
	posts: many(posts),
	presets: many(presets)
}));

export const presetsRelations = relations(presets, ({ one, many }) => ({
	publication: one(publications, {
		fields: [presets.publicationId],
		references: [publications.id]
	}),
	posts: many(posts),
	pieces: many(pieces),
	presetParts: many(presetParts)
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	publication: one(publications, {
		fields: [posts.publicationId],
		references: [publications.id]
	}),
	preset: one(presets, {
		fields: [posts.presetId],
		references: [presets.id]
	}),
	postPartials: many(postPartials),
	postPrimitives: many(postPrimitives)
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	product: one(products, {
		fields: [projects.productId],
		references: [products.id]
	}),
	pieces: many(pieces)
}));

export const piecesRelations = relations(pieces, ({ one, many }) => ({
	project: one(projects, {
		fields: [pieces.projectId],
		references: [projects.id]
	}),
	preset: one(presets, {
		fields: [pieces.presetId],
		references: [presets.id]
	}),
	piecePartials: many(piecePartials),
	piecePrimitives: many(piecePrimitives)
}));

// Junction table relations
export const partPartialsRelations = relations(partPartials, ({ one }) => ({
	part: one(parts, {
		fields: [partPartials.partId],
		references: [parts.id]
	}),
	partial: one(partials, {
		fields: [partPartials.partialId],
		references: [partials.id]
	})
}));

export const partPrimitivesRelations = relations(partPrimitives, ({ one }) => ({
	part: one(parts, {
		fields: [partPrimitives.partId],
		references: [parts.id]
	}),
	primitive: one(primitives, {
		fields: [partPrimitives.primitiveId],
		references: [primitives.id]
	})
}));

export const partialPrimitivesRelations = relations(partialPrimitives, ({ one }) => ({
	partial: one(partials, {
		fields: [partialPrimitives.partialId],
		references: [partials.id]
	}),
	primitive: one(primitives, {
		fields: [partialPrimitives.primitiveId],
		references: [primitives.id]
	})
}));

export const postPartialsRelations = relations(postPartials, ({ one }) => ({
	post: one(posts, {
		fields: [postPartials.postId],
		references: [posts.id]
	}),
	partial: one(partials, {
		fields: [postPartials.partialId],
		references: [partials.id]
	})
}));

export const postPrimitivesRelations = relations(postPrimitives, ({ one }) => ({
	post: one(posts, {
		fields: [postPrimitives.postId],
		references: [posts.id]
	}),
	primitive: one(primitives, {
		fields: [postPrimitives.primitiveId],
		references: [primitives.id]
	})
}));

export const presetPartsRelations = relations(presetParts, ({ one }) => ({
	preset: one(presets, {
		fields: [presetParts.presetId],
		references: [presets.id]
	}),
	part: one(parts, {
		fields: [presetParts.partId],
		references: [parts.id]
	})
}));

export const piecePartialsRelations = relations(piecePartials, ({ one }) => ({
	piece: one(pieces, {
		fields: [piecePartials.pieceId],
		references: [pieces.id]
	}),
	partial: one(partials, {
		fields: [piecePartials.partialId],
		references: [partials.id]
	})
}));

export const piecePrimitivesRelations = relations(piecePrimitives, ({ one }) => ({
	piece: one(pieces, {
		fields: [piecePrimitives.pieceId],
		references: [pieces.id]
	}),
	primitive: one(primitives, {
		fields: [piecePrimitives.primitiveId],
		references: [primitives.id]
	})
}));
