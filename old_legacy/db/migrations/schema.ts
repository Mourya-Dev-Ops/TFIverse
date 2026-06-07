import { pgTable, uniqueIndex, foreignKey, uuid, text, timestamp, integer, unique, json, boolean, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const heroFollows = pgTable("hero_follows", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	heroSlug: text("hero_slug").notNull(),
	heroName: text("hero_name").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	uniqueIndex("user_hero_idx").using("btree", table.userId.asc().nullsLast().op("text_ops"), table.heroSlug.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "hero_follows_user_id_user_id_fk"
		}).onDelete("cascade"),
]);

export const heroFollowCounts = pgTable("hero_follow_counts", {
	heroSlug: text("hero_slug").primaryKey().notNull(),
	count: integer().default(0).notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const session = pgTable("session", {
	sessionToken: text().primaryKey().notNull(),
	userId: uuid().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const passwordResetToken = pgTable("password_reset_token", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	unique("password_reset_token_token_unique").on(table.token),
]);

export const tierListLike = pgTable("tier_list_like", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	tierListId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "tier_list_like_userId_user_id_fk"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.tierListId],
			foreignColumns: [tierList.id],
			name: "tier_list_like_tierListId_tier_list_id_fk"
		}).onDelete("cascade"),
]);

export const userProfile = pgTable("user_profile", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	username: text().notNull(),
	bio: text(),
	location: text(),
	website: text(),
	coverImage: text(),
	totalReviews: integer().default(0),
	totalWatchlist: integer().default(0),
	totalFollowers: integer().default(0),
	totalFollowing: integer().default(0),
	badges: json().default([]),
	isPublic: boolean().default(true),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "user_profile_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("user_profile_userId_unique").on(table.userId),
	unique("user_profile_username_unique").on(table.username),
]);

export const tierList = pgTable("tier_list", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid().notNull(),
	title: text().notNull(),
	description: text(),
	tiers: json().default({"S":[],"A":[],"B":[],"C":[],"D":[],"F":[]}),
	isPublic: boolean().default(true),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "tier_list_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const user = pgTable("user", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text(),
	email: text().notNull(),
	emailVerified: timestamp({ mode: 'string' }),
	image: text(),
	password: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const verificationToken = pgTable("verificationToken", {
	identifier: text().notNull(),
	token: text().notNull(),
	expires: timestamp({ mode: 'string' }).notNull(),
}, (table) => [
	primaryKey({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk"}),
]);

export const account = pgTable("account", {
	userId: uuid().notNull(),
	type: text().notNull(),
	provider: text().notNull(),
	providerAccountId: text().notNull(),
	refreshToken: text("refresh_token"),
	accessToken: text("access_token"),
	expiresAt: integer("expires_at"),
	tokenType: text("token_type"),
	scope: text(),
	idToken: text("id_token"),
	sessionState: text("session_state"),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
	primaryKey({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk"}),
]);
