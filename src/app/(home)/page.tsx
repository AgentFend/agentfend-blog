import { Pin } from 'lucide-react'
import Link from 'next/link'
import { CTA } from '@/app/(home)/_components/call-to-action'
import Hero from '@/app/(home)/_components/hero'
import Posts from '@/app/(home)/_components/posts'
import { Icons } from '@/components/icons/icons'
import { PostCard } from '@/components/blog/post-card'
import { Section } from '@/components/section'
import Separator from '@/components/separator'
import { ViewAnimation } from '@/components/view-animation'
import { getPinnedDbPosts, getDbPosts } from '@/lib/source/db-posts'
import { getSortedByDatePosts } from '@/lib/source'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const mdxPosts = getSortedByDatePosts()
  const dbPosts = await getDbPosts()
  const pinnedPosts = await getPinnedDbPosts()

  // Merge and sort latest 3 (pinned first)
  const allPosts = [
    ...dbPosts.map((p) => ({
      key: `db-${p.id}`,
      url: `/posts/${p.slug}`,
      title: p.title,
      description: p.description ?? '',
      image: p.image,
      date: new Date(p.createdAt),
      author: p.authorName,
      tags: p.tags ?? [],
      slugs: [p.slug],
      isPinned: p.isPinned,
    })),
    ...mdxPosts.map((p) => ({
      key: `mdx-${p.slugs[0]}`,
      url: p.url,
      title: p.data.title,
      description: p.data.description ?? '',
      image: p.data.image,
      date: new Date(p.data.date),
      author: p.data.author,
      tags: p.data.tags ?? [],
      slugs: p.slugs,
      isPinned: false,
    })),
  ].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.date.getTime() - a.date.getTime()
  })

  const latestPosts = allPosts.slice(0, 3)

  return (
    <>
      <Hero />

      {pinnedPosts.length > 0 && (
        <>
          <Section className='py-8 sm:py-12'>
            <ViewAnimation
              delay={0.05}
              initial={{ opacity: 0, translateY: -6 }}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <h2 className='text-center font-semibold text-2xl sm:text-3xl'>
                <span className='inline-flex items-center gap-3'>
                  Pinned
                  <Pin className='size-7 fill-fd-primary/30 text-fd-primary' />
                </span>
              </h2>
            </ViewAnimation>
          </Section>
          <Separator />
          <Section className='flex flex-col divide-y divide-dashed divide-border'>
            <div className='grid divide-y divide-dashed divide-border text-left'>
              {pinnedPosts.map((post, index) => (
                <ViewAnimation
                  delay={0.05 * index}
                  initial={{ opacity: 0, translateY: -6 }}
                  key={post.id}
                  whileInView={{ opacity: 1, translateY: 0 }}
                >
                  <PostCard
                    author={post.authorName}
                    date={new Date(post.createdAt).toDateString()}
                    description={post.description ?? ''}
                    image={post.image}
                    index={index}
                    slugs={[post.slug]}
                    tags={post.tags ?? []}
                    title={post.title}
                    url={`/posts/${post.slug}`}
                  />
                </ViewAnimation>
              ))}
            </div>
          </Section>
          <Separator />
        </>
      )}

      <Section className='py-8 sm:py-16'>
        <ViewAnimation
          delay={0.05}
          initial={{ opacity: 0, translateY: -6 }}
          whileInView={{ opacity: 1, translateY: 0 }}
        >
          <h2 className='text-center font-semibold text-2xl sm:text-3xl md:text-4xl lg:text-5xl'>
            <span className='inline-flex items-center gap-3'>
              Posts{' '}
              <Icons.posts className='size-10 fill-fd-primary/30 text-fd-primary transition-transform hover:rotate-12 hover:scale-125' />
            </span>
          </h2>
        </ViewAnimation>
      </Section>
      <Separator />
      <Section className='flex flex-col divide-y divide-dashed divide-border'>
        <div className='grid divide-y divide-dashed divide-border text-left'>
          {latestPosts.map((post, index) => (
            <ViewAnimation
              delay={0.05 * index}
              initial={{ opacity: 0, translateY: -6 }}
              key={post.key}
              whileInView={{ opacity: 1, translateY: 0 }}
            >
              <PostCard
                author={post.author}
                date={post.date.toDateString()}
                description={post.description}
                image={post.image}
                index={index}
                slugs={post.slugs}
                tags={post.tags}
                title={post.title}
                url={post.url}
              />
            </ViewAnimation>
          ))}
        </div>
      </Section>
      <Separator />
      <CTA />
    </>
  )
}
