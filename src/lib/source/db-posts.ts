import { desc, eq } from 'drizzle-orm'
import { db } from '@/server/db'
import { posts } from '@/server/db/schema'

export type DbPost = typeof posts.$inferSelect

export async function getDbPosts(): Promise<DbPost[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
}

export async function getAllDbPosts(): Promise<DbPost[]> {
  return db.select().from(posts).orderBy(desc(posts.createdAt))
}

export async function getDbPost(slug: string): Promise<DbPost | undefined> {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
  return post
}

export async function getDbPostById(id: number): Promise<DbPost | undefined> {
  const [post] = await db.select().from(posts).where(eq(posts.id, id))
  return post
}

export async function getPinnedDbPosts(): Promise<DbPost[]> {
  return db
    .select()
    .from(posts)
    .where(eq(posts.isPinned, true))
    .orderBy(desc(posts.createdAt))
}

export async function getDbTags(): Promise<string[]> {
  const allPosts = await getDbPosts()
  const tagSet = new Set<string>()
  for (const post of allPosts) {
    for (const tag of post.tags ?? []) {
      tagSet.add(tag)
    }
  }
  return Array.from(tagSet).sort()
}

export async function getDbPostsByTag(tag: string): Promise<DbPost[]> {
  const allPosts = await getDbPosts()
  return allPosts.filter((p) => p.tags?.includes(tag))
}
