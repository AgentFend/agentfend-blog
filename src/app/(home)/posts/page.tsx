import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { NumberedPagination } from '@/components/numbered-pagination'
import { PostCard } from '@/components/blog/post-card'
import { Section } from '@/components/section'
import { Wrapper } from '@/components/wrapper'
import { postsPerPage } from '@/constants/config'
import { createMetadata } from '@/lib/metadata'
import { getDbPosts } from '@/lib/source/db-posts'
import { getPostsByTag, getSortedByDatePosts, getTags } from '@/lib/source'
import { ViewAnimation } from '@/components/view-animation'
import { SearchRedirectInput } from '@/components/search-redirect-input'
import { Hero } from './_components/hero'
import { NewsletterSection } from './_components/newsletter-section'
import { TagsAccordion, TagsSidebar } from './_components/tags-sidebar'

export const dynamic = 'force-dynamic'

const getTagsWithCount = async () => {
  const mdxTags = getTags()
  const dbPosts = await getDbPosts()

  const dbTagSet = new Set<string>()
  for (const p of dbPosts) {
    for (const t of p.tags ?? []) dbTagSet.add(t)
  }

  const allTags = Array.from(new Set([...mdxTags, ...dbTagSet])).sort()

  return allTags.map((name) => ({
    name,
    count:
      getPostsByTag(name).length +
      dbPosts.filter((p) => p.tags?.includes(name)).length,
  }))
}

const Pagination = ({ pageIndex, totalPages }: { pageIndex: number; totalPages: number }) => {
  const handlePageChange = async (page: number) => {
    'use server'
    redirect(`/posts?page=${page}`)
  }

  return (
    <Section className='bg-dashed'>
      <NumberedPagination
        currentPage={pageIndex + 1}
        onPageChange={handlePageChange}
        paginationItemsToDisplay={5}
        totalPages={totalPages}
      />
    </Section>
  )
}

export default async function Page(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page as string, 10) - 1
    : 0

  const mdxPosts = getSortedByDatePosts()
  const dbPosts = await getDbPosts()

  // Unify posts into a single sortable list
  type UnifiedPost = {
    key: string
    url: string
    title: string
    description: string
    image?: string | null
    date: Date
    author: string
    tags?: string[]
    slugs: string[]
    isPinned?: boolean
  }

  const unified: UnifiedPost[] = [
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
      tags: p.data.tags,
      slugs: p.slugs,
      isPinned: false,
    })),
  ].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return b.date.getTime() - a.date.getTime()
  })

  const totalPosts = unified.length
  const pageCount = Math.max(1, Math.ceil(totalPosts / postsPerPage))

  if (pageIndex < 0 || pageIndex >= pageCount) {
    redirect('/posts')
  }

  const startIndex = pageIndex * postsPerPage
  const endIndex = startIndex + postsPerPage
  const pagePosts = unified.slice(startIndex, endIndex)
  const tags = await getTagsWithCount()

  return (
    <Wrapper>
      <Hero endIndex={Math.min(endIndex, totalPosts)} startIndex={startIndex} totalPosts={totalPosts} />
      <Section className='h-full' sectionClassName='flex flex-1'>
        <div className='grid h-full lg:grid-cols-[1fr_280px]'>
          <div className='min-w-0 lg:border-border lg:border-r lg:border-dashed'>
            <div className='border-border border-b border-dashed px-4 py-2.5 lg:hidden'>
              <TagsAccordion tags={tags} />
            </div>
            <Section className='flex flex-col divide-y divide-dashed divide-border h-full border-none' sectionClassName='flex flex-1'>
              <ViewAnimation
                delay={0.05}
                initial={{ opacity: 0, translateY: -6 }}
                whileInView={{ opacity: 1, translateY: 0 }}
              >
                <SearchRedirectInput
                  className='min-w-full'
                  placeholder='Search posts...'
                  tag='blog'
                />
              </ViewAnimation>
              <div className='grid divide-y divide-dashed divide-border text-left'>
                {pagePosts.map((post, index) => (
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
          </div>
          <aside className='hidden lg:block'>
            <TagsSidebar tags={tags} />
          </aside>
        </div>
      </Section>
      {pageCount > 1 && <Pagination pageIndex={pageIndex} totalPages={pageCount} />}
      <NewsletterSection />
    </Wrapper>
  )
}

export async function generateMetadata(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}): Promise<Metadata> {
  const searchParams = await props.searchParams
  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page as string, 10)
    : 1

  const isFirstPage = pageIndex === 1 || !searchParams.page
  const pageTitle = isFirstPage ? 'Posts' : `Posts - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? '/posts' : `/posts?page=${pageIndex}`

  return createMetadata({
    title: pageTitle,
    description: `Posts${isFirstPage ? '' : ` - Page ${pageIndex}`}`,
    openGraph: { url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  })
}
