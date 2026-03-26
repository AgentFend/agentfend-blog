import type { Metadata, ResolvingMetadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { PostCard } from '@/components/blog/post-card'
import { Icons } from '@/components/icons/icons'
import { TagJsonLd } from '@/components/json-ld'
import { NumberedPagination } from '@/components/numbered-pagination'
import { Section } from '@/components/section'
import { HeroSection } from '@/components/sections/hero'
import { ViewAnimation } from '@/components/view-animation'
import { postsPerPage } from '@/constants/config'
import { createMetadata } from '@/lib/metadata'
import { getDbPosts } from '@/lib/source/db-posts'
import { getPostsByTag, getTags } from '@/lib/source'

export const dynamic = 'force-dynamic'

const Header = ({ tag, startIndex, endIndex, total }: {
  tag: string; startIndex: number; endIndex: number; total: number
}) => {
  const start = startIndex + 1
  const end = Math.min(endIndex, total)
  return (
    <HeroSection
      align='start'
      title={
        <div className='flex items-center justify-between gap-4'>
          <span className='flex items-center gap-2'>
            <Icons.tag
              className='text-muted-foreground transition-transform hover:rotate-12 hover:scale-125'
              size={20}
            />
            {tag} <span className='text-muted-foreground'>Posts</span>{' '}
            <span>({start === end ? start : `${start}-${end}`})</span>
          </span>
        </div>
      }
      variant='compact'
    />
  )
}

const Pagination = ({ pageIndex, tag, totalPages }: { pageIndex: number; tag: string; totalPages: number }) => {
  const handlePageChange = async (page: number) => {
    'use server'
    redirect(`/tags/${tag}?page=${page}`)
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
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await props.params
  const searchParams = await props.searchParams

  const tag = params.slug[0]
  if (!tag) return notFound()

  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page[0] ?? '', 10) - 1
    : 0

  const mdxPosts = getPostsByTag(tag)
  const dbPosts = await getDbPosts()
  const dbTagPosts = dbPosts.filter((p) => p.tags?.includes(tag))

  const unified = [
    ...dbTagPosts.map((p) => ({
      key: `db-${p.id}`,
      url: `/posts/${p.slug}`,
      title: p.title,
      description: p.description ?? '',
      image: p.image,
      date: new Date(p.createdAt),
      author: p.authorName,
      tags: p.tags ?? [],
      slugs: [p.slug],
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
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const totalPosts = unified.length
  const pageCount = Math.max(1, Math.ceil(totalPosts / postsPerPage))

  if (pageIndex < 0 || pageIndex >= pageCount) notFound()

  const startIndex = pageIndex * postsPerPage
  const endIndex = startIndex + postsPerPage
  const pagePosts = unified.slice(startIndex, endIndex)

  return (
    <>
      <Header endIndex={endIndex} startIndex={startIndex} tag={tag} total={totalPosts} />
      <Section className='h-full' sectionClassName='flex flex-1'>
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
      {pageCount > 1 && <Pagination pageIndex={pageIndex} tag={tag} totalPages={pageCount} />}
      <TagJsonLd tag={tag} />
    </>
  )
}

export const generateStaticParams = () => {
  const tags = getTags()
  return tags.map((tag) => ({ slug: [tag] }))
}

interface Props {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  props: Props,
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params
  const searchParams = await props.searchParams

  const tag = params.slug[0]
  const pageIndex = searchParams.page
    ? Number.parseInt(searchParams.page.toString(), 10)
    : 1

  const isFirstPage = pageIndex === 1 || !searchParams.page
  const pageTitle = isFirstPage ? `${tag} Posts` : `${tag} Posts - Page ${pageIndex}`
  const canonicalUrl = isFirstPage ? `/tags/${tag}` : `/tags/${tag}?page=${pageIndex}`

  return createMetadata({
    title: pageTitle,
    description: `Posts tagged with ${tag}${isFirstPage ? '' : ` - Page ${pageIndex}`}`,
    openGraph: { url: canonicalUrl },
    alternates: { canonical: canonicalUrl },
  })
}
