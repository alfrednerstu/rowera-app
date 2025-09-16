import { pgTable, serial, integer, varchar, text, timestamp, boolean, json, uuid, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// User table for authentication and profile
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }),
  image: varchar('image', { length: 500 }),
  // keep avatar for now if used elsewhere in app
  avatar: varchar('avatar', { length: 500 }),
  emailVerified: boolean('email_verified').notNull().default(false),
  // Username plugin fields
  username: varchar('username', { length: 255 }).unique(),
  displayUsername: varchar('display_username', { length: 255 }),
  // Admin plugin fields
  role: varchar('role', { length: 50 }).notNull().default('user'),
  banned: boolean('banned').notNull().default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
  index('idx_user_email').on(t.email),
]);

// Product - top-level container for content
export const product = pgTable('product', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Publication - groups posts under a product
export const publication = pgTable('publication', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  productId: uuid('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Project - groups pieces under a product
export const project = pgTable('project', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  productId: uuid('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Preset - template used by posts and pieces
export const preset = pgTable('preset', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  publicationId: uuid('publication_id').references(() => publication.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => project.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Piece - belongs to project, can use preset
export const piece = pgTable('piece', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  presetId: uuid('preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Primitive - basic building block
export const primitive = pgTable('primitive', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  tagName: varchar('tag_name', { length: 50 }).notNull(),
  attributes: json('attributes'),
  defaultContent: text('default_content'),
  cssStyles: text('css_styles'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Part - belongs to exactly one of page/post/piece
export const part = pgTable('part', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  pageId: uuid('page_id').references(() => page.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').references(() => post.id, { onDelete: 'cascade' }),
  pieceId: uuid('piece_id').references(() => piece.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Junctions for partials on page/post/piece
export const pagePartial = pgTable('page_partial', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => page.id, { onDelete: 'cascade' }),
  partialId: uuid('partial_id').notNull().references(() => partial.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const postPartial = pgTable('post_partial', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => post.id, { onDelete: 'cascade' }),
  partialId: uuid('partial_id').notNull().references(() => partial.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

export const piecePartial = pgTable('piece_partial', {
  id: uuid('id').primaryKey().defaultRandom(),
  pieceId: uuid('piece_id').notNull().references(() => piece.id, { onDelete: 'cascade' }),
  partialId: uuid('partial_id').notNull().references(() => partial.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow()
});

// Posts - content items that can be added to publications
export const post = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  content: json('content').notNull(), // Array of partial instances with filled data
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  publicationId: uuid('publication_id').references(() => publication.id, { onDelete: 'cascade' }),
  presetId: uuid('preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Pages - standalone one-off pages
export const page = pgTable('page', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull().unique(),
  content: json('content').notNull(), // Array of partial instances with filled data
  isPublished: boolean('is_published').notNull().default(false),
  publishedAt: timestamp('published_at'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => product.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Partials - reusable components made of semantic HTML elements
export const partial = pgTable('partial', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  description: text('description'),
  elements: json('elements').notNull(), // Array of semantic HTML elements with their structure
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Presentations - visual style definitions that can be applied
export const presentation = pgTable('presentation', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  cssVariables: json('css_variables'), // CSS custom properties
  globalStyles: text('global_styles'), // Global CSS rules
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => product.id, { onDelete: 'cascade' }),
  isActive: boolean('is_active').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Better Auth core tables (UUID-based)
export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: varchar('ip_address', { length: 45 }),
  userAgent: varchar('user_agent', { length: 255 }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  // Organization plugin session fields
  activeOrganizationId: text('active_organization_id'),
  activeTeamId: text('active_team_id'),
  // Admin plugin session field
  impersonatedBy: text('impersonated_by'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
  index('idx_session_user_id').on(t.userId),
  index('idx_session_token').on(t.token),
]);

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  // Better Auth expected fields
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
  index('idx_accounts_user_id').on(t.userId),
]);

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: varchar('identifier', { length: 255 }).notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
  index('idx_verifications_identifier').on(t.identifier),
]);

// Organization plugin tables (with Teams)
export const organization = pgTable('organization', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  ownerId: text('owner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
  index('idx_organization_slug').on(t.slug),
]);

export const member = pgTable('member', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
  index('idx_member_user_id').on(t.userId),
  index('idx_member_organization_id').on(t.organizationId),
]);

export const team = pgTable('team', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const teamMember = pgTable('team_member', {
  id: text('id').primaryKey(),
  teamId: text('team_id').notNull().references(() => team.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const invitation = pgTable('invitation', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id').notNull().references(() => organization.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('member'),
  inviterId: text('inviter_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  teamId: text('team_id').references(() => team.id),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
}, (t) => [
  index('idx_invitations_email').on(t.email),
  index('idx_invitations_organization_id').on(t.organizationId),
]);

// Relations
export const userRelations = relations(user, ({ many }) => ({
  posts: many(post),
  pages: many(page),
  partials: many(partial),
  presentations: many(presentation),
  sessions: many(session),
  accounts: many(account),
  memberships: many(member),
  teamMemberships: many(teamMember),
}));

export const productRelations = relations(product, ({ one, many }) => ({
  owner: one(user, {
    fields: [product.userId],
    references: [user.id]
  }),
  pages: many(page),
  publications: many(publication),
  projects: many(project)
}));

export const postRelations = relations(post, ({ one }) => ({
  user: one(user, {
    fields: [post.userId],
    references: [user.id]
  }),
  publication: one(publication, {
    fields: [post.publicationId!],
    references: [publication.id]
  }),
  preset: one(preset, {
    fields: [post.presetId!],
    references: [preset.id]
  })
}));

export const pageRelations = relations(page, ({ one }) => ({
  user: one(user, {
    fields: [page.userId],
    references: [user.id]
  }),
  product: one(product, {
    fields: [page.productId!],
    references: [product.id]
  })
}));

export const partialRelations = relations(partial, ({ one }) => ({
  user: one(user, {
    fields: [partial.userId],
    references: [user.id]
  })
}));

export const presentationRelations = relations(presentation, ({ one }) => ({
  user: one(user, {
    fields: [presentation.userId],
    references: [user.id]
  }),
  product: one(product, {
    fields: [presentation.productId!],
    references: [product.id]
  })
}));

export const publicationRelations = relations(publication, ({ one, many }) => ({
  product: one(product, {
    fields: [publication.productId],
    references: [product.id]
  }),
  posts: many(post),
  presets: many(preset)
}));

export const presetRelations = relations(preset, ({ one, many }) => ({
  publication: one(publication, {
    fields: [preset.publicationId],
    references: [publication.id]
  }),
  project: one(project, {
    fields: [preset.projectId!],
    references: [project.id]
  }),
  posts: many(post),
  pieces: many(piece)
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  product: one(product, {
    fields: [project.productId],
    references: [product.id]
  }),
  pieces: many(piece),
  presets: many(preset)
}));

export const pieceRelations = relations(piece, ({ one, many }) => ({
  project: one(project, {
    fields: [piece.projectId],
    references: [project.id]
  }),
  preset: one(preset, {
    fields: [piece.presetId!],
    references: [preset.id]
  })
}));

export const partRelations = relations(part, ({ one }) => ({
  page: one(page, {
    fields: [part.pageId!],
    references: [page.id]
  }),
  post: one(post, {
    fields: [part.postId!],
    references: [post.id]
  }),
  piece: one(piece, {
    fields: [part.pieceId!],
    references: [piece.id]
  })
}));

export const pagePartialRelations = relations(pagePartial, ({ one }) => ({
  page: one(page, {
    fields: [pagePartial.pageId],
    references: [page.id]
  }),
  partial: one(partial, {
    fields: [pagePartial.partialId],
    references: [partial.id]
  })
}));

export const postPartialRelations = relations(postPartial, ({ one }) => ({
  post: one(post, {
    fields: [postPartial.postId],
    references: [post.id]
  }),
  partial: one(partial, {
    fields: [postPartial.partialId],
    references: [partial.id]
  })
}));

export const piecePartialRelations = relations(piecePartial, ({ one }) => ({
  piece: one(piece, {
    fields: [piecePartial.pieceId],
    references: [piece.id]
  }),
  partial: one(partial, {
    fields: [piecePartial.partialId],
    references: [partial.id]
  })
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}));

export const organizationRelations = relations(organization, ({ one, many }) => ({
  owner: one(user, {
    fields: [organization.ownerId],
    references: [user.id]
  }),
  members: many(member),
  teams: many(team),
  invitations: many(invitation),
}));

export const membersRelations = relations(member, ({ one }) => ({
  user: one(user, {
    fields: [member.userId],
    references: [user.id]
  }),
  organization: one(organization, {
    fields: [member.organizationId],
    references: [organization.id]
  }),
}));

export const teamsRelations = relations(team, ({ one, many }) => ({
  organization: one(organization, {
    fields: [team.organizationId],
    references: [organization.id]
  }),
  members: many(teamMember),
}));

export const teamMembersRelations = relations(teamMember, ({ one }) => ({
  team: one(team, {
    fields: [teamMember.teamId],
    references: [team.id]
  }),
  user: one(user, {
    fields: [teamMember.userId],
    references: [user.id]
  }),
}));

export const invitationRelations = relations(invitation, ({ one }) => ({
  organization: one(organization, {
    fields: [invitation.organizationId],
    references: [organization.id]
  }),
  inviter: one(user, {
    fields: [invitation.inviterId],
    references: [user.id]
  }),
}));
