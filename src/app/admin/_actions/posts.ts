'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sendDiscordPostNotification } from '@/lib/discord'
import { db } from '@/server/db'
import { posts } from '@/server/db/schema'
import { getSession } from '@/server/auth'

async function requireAdmin() {
  const session = await getSession()
  if (!session?.user || session.user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return session.user
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function createPost(formData: FormData) {
  const user = await requireAdmin()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const image = formData.get('image') as string
  const tagsRaw = formData.get('tags') as string
  const published = formData.get('published') === 'true'

  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  const baseSlug = slugify(title)
  let slug = baseSlug
  let counter = 1
  while (true) {
    const existing = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug))
    if (existing.length === 0) break
    slug = `${baseSlug}-${counter++}`
  }

  const [post] = await db
    .insert(posts)
    .values({
      title,
      slug,
      description: description || null,
      content,
      image: image || null,
      tags,
      published,
      authorName: user.name,
      authorId: user.id,
    })
    .returning()

  if (published && post) {
    const notified = await sendDiscordPostNotification({
      id: post.id,
      title: post.title,
      slug: post.slug,
      description: post.description,
      image: post.image,
      tags: post.tags,
      authorName: post.authorName,
    })
    if (notified) {
      await db
        .update(posts)
        .set({ discordNotifiedAt: new Date() })
        .where(eq(posts.id, post.id))
    }
  }

  revalidatePath('/')
  revalidatePath('/posts')
  redirect('/admin')
}

export async function updatePost(id: number, formData: FormData) {
  await requireAdmin()

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const content = formData.get('content') as string
  const image = formData.get('image') as string
  const tagsRaw = formData.get('tags') as string
  const published = formData.get('published') === 'true'

  const tags = tagsRaw
    ? tagsRaw.split(',').map((t) => t.trim()).filter(Boolean)
    : []

  await db
    .update(posts)
    .set({
      title,
      description: description || null,
      content,
      image: image || null,
      tags,
      published,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, id))

  revalidatePath('/')
  revalidatePath('/posts')
  revalidatePath(`/posts/${(await db.select({ slug: posts.slug }).from(posts).where(eq(posts.id, id)))[0]?.slug}`)
  redirect('/admin')
}

export async function deletePost(id: number) {
  await requireAdmin()

  const [post] = await db.select({ slug: posts.slug }).from(posts).where(eq(posts.id, id))
  await db.delete(posts).where(eq(posts.id, id))

  revalidatePath('/')
  revalidatePath('/posts')
  if (post) revalidatePath(`/posts/${post.slug}`)
}

export async function togglePin(id: number, isPinned: boolean) {
  await requireAdmin()

  await db.update(posts).set({ isPinned: !isPinned }).where(eq(posts.id, id))

  revalidatePath('/')
  revalidatePath('/posts')
}

export async function resendDiscordNotification(id: number) {
  await requireAdmin()

  const [post] = await db.select().from(posts).where(eq(posts.id, id))
  if (!post) throw new Error('Post not found')

  const notified = await sendDiscordPostNotification({
    id: post.id,
    title: post.title,
    slug: post.slug,
    description: post.description,
    image: post.image,
    tags: post.tags,
    authorName: post.authorName,
  })

  if (notified) {
    await db
      .update(posts)
      .set({ discordNotifiedAt: new Date() })
      .where(eq(posts.id, id))
    revalidatePath('/admin')
  }

  return notified
}
