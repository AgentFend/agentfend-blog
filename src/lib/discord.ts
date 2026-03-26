import { env } from '@/env'

export interface DiscordPostPayload {
  id: number
  title: string
  slug: string
  description?: string | null
  image?: string | null
  tags?: string[] | null
  authorName: string
}

export async function sendDiscordPostNotification(post: DiscordPostPayload): Promise<boolean> {
  if (!env.DISCORD_WEBHOOK_URL) return false

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const postUrl = `${baseUrl}/posts/${post.slug}`

  const embed = {
    title: post.title,
    description: post.description ?? '',
    url: postUrl,
    color: 0x6366f1,
    fields: [
      ...(post.tags?.length
        ? [{ name: 'Tags', value: post.tags.join(', '), inline: true }]
        : []),
    ],
    ...(post.image ? { image: { url: post.image } } : {}),
    footer: { text: 'New blog post published' },
    timestamp: new Date().toISOString(),
  }

  const body = {
    username: 'AgentFend - Changelog',
    embeds: [embed],
  }

  try {
    const res = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
  }
}
