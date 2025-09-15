import { pgTable, serial, integer, varchar, text, timestamp, boolean, json, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table for authentication and profile
export const users = pgTable('users', {
	id: uuid('id').primaryKey().defaultRandom(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	name: varchar('name', { length: 255 }).notNull(),
	avatar: varchar('avatar', { length: 500 }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Products - main container for user's products
export const products = pgTable('products', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
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
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
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
	projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),
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
export const usersRelations = relations(users, ({ many }) => ({
	products: many(products),
	partials: many(partials)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
	user: one(users, {
		fields: [products.userId],
		references: [users.id]
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

export const partialsRelations = relations(partials, ({ one, many }) => ({
	user: one(users, {
		fields: [partials.userId],
		references: [users.id]
	}),
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
	project: one(projects, {
		fields: [presets.projectId],
		references: [projects.id]
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
	pieces: many(pieces),
	presets: many(presets)
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
