import { pgTable, text, timestamp, boolean, primaryKey, index } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	username: text('username').unique(),
	displayUsername: text('displayUsername'),
	email: text('email').notNull().unique(),
	emailVerified: boolean('emailVerified').notNull().default(false),
	image: text('image'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
	emailIdx: index('user_email_idx').on(table.email),
}));

export const session = pgTable('session', {
	id: text('id').primaryKey(),
	userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
	token: text('token').notNull(),
	expiresAt: timestamp('expiresAt').notNull(),
	ipAddress: text('ipAddress'),
	userAgent: text('userAgent'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
	userIdIdx: index('session_userId_idx').on(table.userId),
	tokenIdx: index('session_token_idx').on(table.token),
}));

export const account = pgTable('account', {
	id: text('id').primaryKey(),
	userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
	accountId: text('accountId').notNull(),
	providerId: text('providerId').notNull(),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
	refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
	scope: text('scope'),
	idToken: text('idToken'),
	password: text('password'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
	userIdIdx: index('account_userId_idx').on(table.userId),
}));

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expiresAt').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	updatedAt: timestamp('updatedAt').notNull().defaultNow(),
}, (table) => ({
	identifierIdx: index('verification_identifier_idx').on(table.identifier),
}));

export const organization = pgTable('organization', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	slug: text('slug').unique(),
	logo: text('logo'),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
	metadata: text('metadata'),
}, (table) => ({
	slugIdx: index('organization_slug_idx').on(table.slug),
}));

export const member = pgTable('member', {
	id: text('id').primaryKey(),
	organizationId: text('organizationId').notNull().references(() => organization.id, { onDelete: 'cascade' }),
	userId: text('userId').notNull().references(() => user.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role').notNull(),
	createdAt: timestamp('createdAt').notNull().defaultNow(),
}, (table) => ({
	userIdIdx: index('member_userId_idx').on(table.userId),
	organizationIdIdx: index('member_organizationId_idx').on(table.organizationId),
}));

export const invitation = pgTable('invitation', {
	id: text('id').primaryKey(),
	organizationId: text('organizationId').notNull().references(() => organization.id, { onDelete: 'cascade' }),
	email: text('email').notNull(),
	role: text('role'),
	status: text('status').notNull(),
	expiresAt: timestamp('expiresAt').notNull(),
	inviterId: text('inviterId').notNull().references(() => user.id),
}, (table) => ({
	emailIdx: index('invitation_email_idx').on(table.email),
	organizationIdIdx: index('invitation_organizationId_idx').on(table.organizationId),
}));
