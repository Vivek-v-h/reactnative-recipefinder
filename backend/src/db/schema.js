import {pgTable,serial,text,timestamp,integer} from 'drizzle-orm/pg-core';

export const favourites = pgTable('favourites', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull(),
    recipeId: integer('recipe_id').notNull(),
    title:text('title').notNull(),
    image:text('image'),
    cookTime:text('cook_time'),
    servings:text('servings'),
    createdAt: timestamp('created_at').defaultNow()
});