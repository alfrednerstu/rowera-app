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

// Project - top-level container for content
export const project = pgTable('project', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Project Content - the primitives and partials on a project root page with their content
export const projectContent = pgTable('project_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  primitiveId: uuid('primitive_id').references(() => primitive.id, { onDelete: 'restrict' }),
  sourcePresetId: uuid('source_preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  sourcePartialId: uuid('source_partial_id').references(() => partial.id, { onDelete: 'restrict' }),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Publication - groups posts under a project
export const publication = pgTable('publication', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Packet - groups pieces under a project
export const packet = pgTable('packet', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  projectId: uuid('project_id').notNull().references(() => project.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Preset - template used by posts and pieces
export const preset = pgTable('preset', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  publicationId: uuid('publication_id').references(() => publication.id, { onDelete: 'cascade' }),
  packetId: uuid('packet_id').references(() => packet.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Preset Primitive - defines which primitives are in a preset and their order
export const presetPrimitive = pgTable('preset_primitive', {
  id: uuid('id').primaryKey().defaultRandom(),
  presetId: uuid('preset_id').notNull().references(() => preset.id, { onDelete: 'cascade' }),
  primitiveId: uuid('primitive_id').notNull().references(() => primitive.id, { onDelete: 'restrict' }),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Piece - belongs to packet, can use preset
export const piece = pgTable('piece', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  publishedAt: timestamp('published_at'),
  packetId: uuid('packet_id').notNull().references(() => packet.id, { onDelete: 'cascade' }),
  presetId: uuid('preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  plateId: uuid('plate_id').references(() => plate.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Packet Content - the primitives and partials on a packet root page with their content
export const packetContent = pgTable('packet_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  packetId: uuid('packet_id').notNull().references(() => packet.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  primitiveId: uuid('primitive_id').references(() => primitive.id, { onDelete: 'restrict' }),
  sourcePresetId: uuid('source_preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  sourcePartialId: uuid('source_partial_id').references(() => partial.id, { onDelete: 'restrict' }),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Piece Content - the primitives and partials on a piece with their content
export const pieceContent = pgTable('piece_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  pieceId: uuid('piece_id').notNull().references(() => piece.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  primitiveId: uuid('primitive_id').references(() => primitive.id, { onDelete: 'restrict' }),
  sourcePresetId: uuid('source_preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  sourcePartialId: uuid('source_partial_id').references(() => partial.id, { onDelete: 'restrict' }),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Primitive - basic building block
export const primitive = pgTable('primitive', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  tags: text('tags').notNull(),
  category: varchar('category', { length: 50 }).notNull().default('content'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Primitive Field - defines inputs for primitives
export const primitiveField = pgTable('primitive_field', {
  id: uuid('id').primaryKey().defaultRandom(),
  primitiveId: uuid('primitive_id').notNull().references(() => primitive.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  label: varchar('label', { length: 255 }).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  description: text('description'),
  placeholder: varchar('placeholder', { length: 255 }),
  optional: boolean('optional').notNull().default(false),
  order: integer('order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Part - belongs to exactly one of page/post/piece (keeping for backward compatibility if needed)
export const part = pgTable('part', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  pageId: uuid('page_id').references(() => page.id, { onDelete: 'cascade' }),
  postId: uuid('post_id').references(() => post.id, { onDelete: 'cascade' }),
  pieceId: uuid('piece_id').references(() => piece.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Posts - content items that can be added to publications
export const post = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  publishedAt: timestamp('published_at'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  publicationId: uuid('publication_id').references(() => publication.id, { onDelete: 'cascade' }),
  presetId: uuid('preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  plateId: uuid('plate_id').references(() => plate.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Publication Content - the primitives and partials on a publication root page with their content
export const publicationContent = pgTable('publication_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  publicationId: uuid('publication_id').notNull().references(() => publication.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  primitiveId: uuid('primitive_id').references(() => primitive.id, { onDelete: 'restrict' }),
  sourcePresetId: uuid('source_preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  sourcePartialId: uuid('source_partial_id').references(() => partial.id, { onDelete: 'restrict' }),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
})

// Post Content - the primitives and partials on a post with their content
export const postContent = pgTable('post_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  postId: uuid('post_id').notNull().references(() => post.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  primitiveId: uuid('primitive_id').references(() => primitive.id, { onDelete: 'restrict' }),
  sourcePresetId: uuid('source_preset_id').references(() => preset.id, { onDelete: 'restrict' }),
  sourcePartialId: uuid('source_partial_id').references(() => partial.id, { onDelete: 'restrict' }),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Pages - standalone one-off pages
export const page = pgTable('page', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 500 }).notNull(),
  slug: varchar('slug', { length: 500 }).notNull(),
  publishedAt: timestamp('published_at'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => project.id, { onDelete: 'cascade' }),
  plateId: uuid('plate_id').references(() => plate.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Page Content - the primitives and partials on a page with their content
export const pageContent = pgTable('page_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  pageId: uuid('page_id').notNull().references(() => page.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  primitiveId: uuid('primitive_id').references(() => primitive.id, { onDelete: 'restrict' }),
  sourcePartialId: uuid('source_partial_id').references(() => partial.id, { onDelete: 'restrict' }),
  content: json('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Partials - reusable components made of primitives
export const partial = pgTable('partial', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Partial Primitive - defines which primitives are in a partial and their order
export const partialPrimitive = pgTable('partial_primitive', {
  id: uuid('id').primaryKey().defaultRandom(),
  partialId: uuid('partial_id').notNull().references(() => partial.id, { onDelete: 'cascade' }),
  primitiveId: uuid('primitive_id').notNull().references(() => primitive.id, { onDelete: 'restrict' }),
  order: integer('order').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Plate - defines the structural layout for pages/posts/pieces
export const plate = pgTable('plate', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// Plate Content - ordered partials with a slot marker for main content
export const plateContent = pgTable('plate_content', {
  id: uuid('id').primaryKey().defaultRandom(),
  plateId: uuid('plate_id').notNull().references(() => plate.id, { onDelete: 'cascade' }),
  order: integer('order').notNull(),
  partialId: uuid('partial_id').references(() => partial.id, { onDelete: 'restrict' }),
  isContentSlot: boolean('is_content_slot').notNull().default(false),
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
  projectId: uuid('project_id').references(() => project.id, { onDelete: 'cascade' }),
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
  plates: many(plate),
  presentations: many(presentation),
  sessions: many(session),
  accounts: many(account),
  memberships: many(member),
  teamMemberships: many(teamMember),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  owner: one(user, {
    fields: [project.userId],
    references: [user.id]
  }),
  pages: many(page),
  publications: many(publication),
  packets: many(packet),
  content: many(projectContent)
}));

export const postRelations = relations(post, ({ one, many }) => ({
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
  }),
  plate: one(plate, {
    fields: [post.plateId!],
    references: [plate.id]
  }),
  content: many(postContent)
}));

export const projectContentRelations = relations(projectContent, ({ one }) => ({
  project: one(project, {
    fields: [projectContent.projectId],
    references: [project.id]
  }),
  primitive: one(primitive, {
    fields: [projectContent.primitiveId!],
    references: [primitive.id]
  }),
  sourcePreset: one(preset, {
    fields: [projectContent.sourcePresetId!],
    references: [preset.id]
  }),
  sourcePartial: one(partial, {
    fields: [projectContent.sourcePartialId!],
    references: [partial.id]
  })
}))

export const publicationContentRelations = relations(publicationContent, ({ one }) => ({
  publication: one(publication, {
    fields: [publicationContent.publicationId],
    references: [publication.id]
  }),
  primitive: one(primitive, {
    fields: [publicationContent.primitiveId!],
    references: [primitive.id]
  }),
  sourcePreset: one(preset, {
    fields: [publicationContent.sourcePresetId!],
    references: [preset.id]
  }),
  sourcePartial: one(partial, {
    fields: [publicationContent.sourcePartialId!],
    references: [partial.id]
  })
}))

export const postContentRelations = relations(postContent, ({ one }) => ({
  post: one(post, {
    fields: [postContent.postId],
    references: [post.id]
  }),
  primitive: one(primitive, {
    fields: [postContent.primitiveId!],
    references: [primitive.id]
  }),
  sourcePreset: one(preset, {
    fields: [postContent.sourcePresetId!],
    references: [preset.id]
  }),
  sourcePartial: one(partial, {
    fields: [postContent.sourcePartialId!],
    references: [partial.id]
  })
}));

export const pageRelations = relations(page, ({ one, many }) => ({
  user: one(user, {
    fields: [page.userId],
    references: [user.id]
  }),
  project: one(project, {
    fields: [page.projectId!],
    references: [project.id]
  }),
  plate: one(plate, {
    fields: [page.plateId!],
    references: [plate.id]
  }),
  content: many(pageContent)
}));

export const pageContentRelations = relations(pageContent, ({ one }) => ({
  page: one(page, {
    fields: [pageContent.pageId],
    references: [page.id]
  }),
  primitive: one(primitive, {
    fields: [pageContent.primitiveId!],
    references: [primitive.id]
  }),
  sourcePartial: one(partial, {
    fields: [pageContent.sourcePartialId!],
    references: [partial.id]
  })
}));

export const partialRelations = relations(partial, ({ one, many }) => ({
  user: one(user, {
    fields: [partial.userId],
    references: [user.id]
  }),
  primitives: many(partialPrimitive)
}));

export const partialPrimitiveRelations = relations(partialPrimitive, ({ one }) => ({
  partial: one(partial, {
    fields: [partialPrimitive.partialId],
    references: [partial.id]
  }),
  primitive: one(primitive, {
    fields: [partialPrimitive.primitiveId],
    references: [primitive.id]
  })
}));

export const plateRelations = relations(plate, ({ one, many }) => ({
  user: one(user, {
    fields: [plate.userId],
    references: [user.id]
  }),
  content: many(plateContent),
  pages: many(page),
  posts: many(post),
  pieces: many(piece)
}));

export const plateContentRelations = relations(plateContent, ({ one }) => ({
  plate: one(plate, {
    fields: [plateContent.plateId],
    references: [plate.id]
  }),
  partial: one(partial, {
    fields: [plateContent.partialId!],
    references: [partial.id]
  })
}));

export const presentationRelations = relations(presentation, ({ one }) => ({
  user: one(user, {
    fields: [presentation.userId],
    references: [user.id]
  }),
  project: one(project, {
    fields: [presentation.projectId!],
    references: [project.id]
  })
}));

export const publicationRelations = relations(publication, ({ one, many }) => ({
  project: one(project, {
    fields: [publication.projectId],
    references: [project.id]
  }),
  posts: many(post),
  presets: many(preset),
  content: many(publicationContent)
}));

export const presetRelations = relations(preset, ({ one, many }) => ({
  publication: one(publication, {
    fields: [preset.publicationId],
    references: [publication.id]
  }),
  packet: one(packet, {
    fields: [preset.packetId!],
    references: [packet.id]
  }),
  posts: many(post),
  pieces: many(piece),
  primitives: many(presetPrimitive)
}));

export const presetPrimitiveRelations = relations(presetPrimitive, ({ one }) => ({
  preset: one(preset, {
    fields: [presetPrimitive.presetId],
    references: [preset.id]
  }),
  primitive: one(primitive, {
    fields: [presetPrimitive.primitiveId],
    references: [primitive.id]
  })
}));

export const packetRelations = relations(packet, ({ one, many }) => ({
  project: one(project, {
    fields: [packet.projectId],
    references: [project.id]
  }),
  pieces: many(piece),
  presets: many(preset),
  content: many(packetContent)
}));

export const pieceRelations = relations(piece, ({ one, many }) => ({
  packet: one(packet, {
    fields: [piece.packetId],
    references: [packet.id]
  }),
  preset: one(preset, {
    fields: [piece.presetId!],
    references: [preset.id]
  }),
  plate: one(plate, {
    fields: [piece.plateId!],
    references: [plate.id]
  }),
  content: many(pieceContent)
}));

export const packetContentRelations = relations(packetContent, ({ one }) => ({
  packet: one(packet, {
    fields: [packetContent.packetId],
    references: [packet.id]
  }),
  primitive: one(primitive, {
    fields: [packetContent.primitiveId!],
    references: [primitive.id]
  }),
  sourcePreset: one(preset, {
    fields: [packetContent.sourcePresetId!],
    references: [preset.id]
  }),
  sourcePartial: one(partial, {
    fields: [packetContent.sourcePartialId!],
    references: [partial.id]
  })
}))

export const pieceContentRelations = relations(pieceContent, ({ one }) => ({
  piece: one(piece, {
    fields: [pieceContent.pieceId],
    references: [piece.id]
  }),
  primitive: one(primitive, {
    fields: [pieceContent.primitiveId!],
    references: [primitive.id]
  }),
  sourcePreset: one(preset, {
    fields: [pieceContent.sourcePresetId!],
    references: [preset.id]
  }),
  sourcePartial: one(partial, {
    fields: [pieceContent.sourcePartialId!],
    references: [partial.id]
  })
}));

export const primitiveRelations = relations(primitive, ({ many }) => ({
  fields: many(primitiveField)
}));

export const primitiveFieldRelations = relations(primitiveField, ({ one }) => ({
  primitive: one(primitive, {
    fields: [primitiveField.primitiveId],
    references: [primitive.id]
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
