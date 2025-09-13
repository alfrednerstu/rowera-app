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

// Feeds - collections where posts can be added
export const feeds = pgTable('feeds', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	description: text('description'),
	isPublic: boolean('is_public').notNull().default(true),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Posts - content items that can be added to feeds
export const posts = pgTable('posts', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 500 }).notNull(),
	slug: varchar('slug', { length: 500 }).notNull(),
	content: json('content').notNull(), // Array of partial instances with filled data
	isPublished: boolean('is_published').notNull().default(false),
	publishedAt: timestamp('published_at'),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	feedId: uuid('feed_id').notNull().references(() => feeds.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Pages - standalone one-off pages
export const pages = pgTable('pages', {
	id: uuid('id').primaryKey().defaultRandom(),
	title: varchar('title', { length: 500 }).notNull(),
	slug: varchar('slug', { length: 500 }).notNull().unique(),
	content: json('content').notNull(), // Array of partial instances with filled data
	isPublished: boolean('is_published').notNull().default(false),
	publishedAt: timestamp('published_at'),
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Partials - reusable components made of semantic HTML elements
export const partials = pgTable('partials', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull(),
	description: text('description'),
	elements: json('elements').notNull(), // Array of semantic HTML elements with their structure
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Element Templates - predefined semantic HTML elements that can be used in partials
export const elementTemplates = pgTable('element_templates', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	tagName: varchar('tag_name', { length: 50 }).notNull(), // h1, p, section, etc.
	attributes: json('attributes'), // Default attributes like class, id, etc.
	isContentEditable: boolean('is_content_editable').notNull().default(true),
	defaultContent: text('default_content'),
	cssStyles: text('css_styles'), // CSS rules for this element
	description: text('description'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Presentations - visual style definitions that can be applied
export const presentations = pgTable('presentations', {
	id: uuid('id').primaryKey().defaultRandom(),
	name: varchar('name', { length: 255 }).notNull(),
	slug: varchar('slug', { length: 255 }).notNull().unique(),
	cssVariables: json('css_variables'), // CSS custom properties
	globalStyles: text('global_styles'), // Global CSS rules
	userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
	isActive: boolean('is_active').notNull().default(false),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	feeds: many(feeds),
	posts: many(posts),
	pages: many(pages),
	partials: many(partials),
	presentations: many(presentations)
}));

export const feedsRelations = relations(feeds, ({ one, many }) => ({
	user: one(users, {
		fields: [feeds.userId],
		references: [users.id]
	}),
	posts: many(posts)
}));

export const postsRelations = relations(posts, ({ one }) => ({
	user: one(users, {
		fields: [posts.userId],
		references: [users.id]
	}),
	feed: one(feeds, {
		fields: [posts.feedId],
		references: [feeds.id]
	})
}));

export const pagesRelations = relations(pages, ({ one }) => ({
	user: one(users, {
		fields: [pages.userId],
		references: [users.id]
	})
}));

export const partialsRelations = relations(partials, ({ one }) => ({
	user: one(users, {
		fields: [partials.userId],
		references: [users.id]
	})
}));

export const presentationsRelations = relations(presentations, ({ one }) => ({
	user: one(users, {
		fields: [presentations.userId],
		references: [users.id]
	})
}));
