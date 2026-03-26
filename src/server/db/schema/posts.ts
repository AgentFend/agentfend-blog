import { boolean, json, pgTableCreator, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { users } from './auth'

const createTable = pgTableCreator((name) => `blog_${name}`)

export const posts = createTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  slug: varchar('slug', { length: 256 }).notNull().unique(),
  description: text('description'),
  content: text('content').notNull().default(''),
  image: varchar('image', { length: 512 }),
  tags: json('tags').$type<string[]>().default([]),
  isPinned: boolean('is_pinned').notNull().default(false),
  published: boolean('published').notNull().default(true),
  discordNotifiedAt: timestamp('discord_notified_at'),
  authorName: varchar('author_name', { length: 256 }).notNull().default(''),
  authorId: varchar('author_id', { length: 256 }).references(() => users.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Post = typeof posts.$inferSelect
export type NewPost = typeof posts.$inferInsert
