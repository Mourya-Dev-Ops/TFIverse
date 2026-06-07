import { relations } from "drizzle-orm/relations";
import { user, heroFollows, session, tierListLike, tierList, userProfile, account } from "./schema";

export const heroFollowsRelations = relations(heroFollows, ({one}) => ({
	user: one(user, {
		fields: [heroFollows.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	heroFollows: many(heroFollows),
	sessions: many(session),
	tierListLikes: many(tierListLike),
	userProfiles: many(userProfile),
	tierLists: many(tierList),
	accounts: many(account),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const tierListLikeRelations = relations(tierListLike, ({one}) => ({
	user: one(user, {
		fields: [tierListLike.userId],
		references: [user.id]
	}),
	tierList: one(tierList, {
		fields: [tierListLike.tierListId],
		references: [tierList.id]
	}),
}));

export const tierListRelations = relations(tierList, ({one, many}) => ({
	tierListLikes: many(tierListLike),
	user: one(user, {
		fields: [tierList.userId],
		references: [user.id]
	}),
}));

export const userProfileRelations = relations(userProfile, ({one}) => ({
	user: one(user, {
		fields: [userProfile.userId],
		references: [user.id]
	}),
}));

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));